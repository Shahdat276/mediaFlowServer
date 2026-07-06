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

    const db = getDb();
    const userId = session.user.id;

    const updateFields = {
      cancelAtPeriodEnd: false,
      subscriptionStatus: "active",
      updatedAt: new Date().toISOString(),
    };

    let result = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: updateFields }
    );

    if (result.matchedCount === 0 && ObjectId.isValid(userId)) {
      result = await db.collection("user").updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription auto-renewal reactivated successfully.",
      cancelAtPeriodEnd: false
    });
  } catch (error: any) {
    console.error("Reactivation API error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to reactivate subscription.",
      error: error.message
    }, { status: 500 });
  }
}
