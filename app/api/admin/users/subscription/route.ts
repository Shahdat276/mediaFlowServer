import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, plan, status, expiresAt } = body;

    if (!userId || !plan || !status) {
      return NextResponse.json({ success: false, message: "User ID, plan name, and subscription status are required." }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    const userUpdates: any = {
      subscriptionPlan: plan,
      subscriptionStatus: status,
      updatedAt: now,
    };

    if (expiresAt) {
      userUpdates.subscriptionExpiresAt = new Date(expiresAt).toISOString();
    } else {
      userUpdates.subscriptionExpiresAt = null;
    }

    // If setting to active, make sure cancelAtPeriodEnd is reset to false
    if (status === "active") {
      userUpdates.cancelAtPeriodEnd = false;
    }

    let result = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: userUpdates }
    );

    if (result.matchedCount === 0 && ObjectId.isValid(userId)) {
      result = await db.collection("user").updateOne(
        { _id: new ObjectId(userId) },
        { $set: userUpdates }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User subscription updated successfully.",
    });
  } catch (error: any) {
    console.error("Admin user subscription update error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to update user subscription.",
      error: error.message
    }, { status: 500 });
  }
}
