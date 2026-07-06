import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  const origin = request.headers.get("origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        active: false,
        plan: "Free Tier",
        message: "No active session. Please log in.",
        daysRemaining: 0,
      }, { headers: corsHeaders });
    }

    const db = getDb();
    const userId = session.user.id;

    // Fetch user from DB to get the latest subscription status
    let user = await db.collection("user").findOne({ _id: userId as any });
    if (!user && ObjectId.isValid(userId)) {
      user = await db.collection("user").findOne({ _id: new ObjectId(userId) });
    }

    if (!user) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        active: false,
        plan: "Free Tier",
        message: "User document not found.",
        daysRemaining: 0,
      }, { headers: corsHeaders });
    }

    const plan = user.subscriptionPlan || "Free Tier";
    const expiresAt = user.subscriptionExpiresAt;
    const status = user.subscriptionStatus || "inactive";

    let active = false;
    let daysRemaining = 0;

    if (status === "active" && expiresAt) {
      const expDate = new Date(expiresAt);
      const now = new Date();
      if (expDate > now) {
        active = true;
        const diffTime = expDate.getTime() - now.getTime();
        daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      active,
      plan,
      expiresAt,
      daysRemaining,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role || "user"
      }
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Subscription status fetch error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch subscription status.",
      error: error.message
    }, { status: 500, headers: corsHeaders });
  }
}

// OPTIONS handler for preflight CORS requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    }
  });
}
