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
      cancelAtPeriodEnd: true,
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
      message: "Subscription renewal cancelled successfully. Access remains active until the end of the period.",
      cancelAtPeriodEnd: true
    });
  } catch (error: any) {
    console.error("Cancellation API error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to cancel subscription.",
      error: error.message
    }, { status: 500 });
  }
}
