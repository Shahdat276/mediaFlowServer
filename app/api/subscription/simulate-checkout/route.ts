import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    const db = getDb();
    const userId = session.user.id;

    const expiryTime = plan === "Lifetime" 
      ? new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000) // 50 years
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year

    const updateFields = {
      subscriptionStatus: "active",
      subscriptionPlan: plan || "Pro",
      subscriptionExpiresAt: expiryTime.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try updating with string ID first
    let result = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: updateFields }
    );

    // Try updating with ObjectId if string ID didn't match and it's a valid hex string
    if (result.matchedCount === 0 && ObjectId.isValid(userId)) {
      result = await db.collection("user").updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscription plan '${plan || "Pro"}' activated successfully.`,
      plan: plan || "Pro",
      expiresAt: expiryTime.toISOString()
    });
  } catch (error: any) {
    console.error("Simulated checkout error:", error);
    return NextResponse.json({
      success: false,
      message: "Checkout simulation failed.",
      error: error.message
    }, { status: 500 });
  }
}
