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
    const { plan, billing, paymentMethod, senderNumber, transactionId } = body;

    if (!paymentMethod || !senderNumber || !transactionId) {
      return NextResponse.json({ success: false, message: "All payment verification details are required." }, { status: 400 });
    }

    const db = getDb();
    const userId = session.user.id;

    // Check if the transaction ID was already submitted to prevent duplicates
    const duplicate = await db.collection("transactions").findOne({ transactionId });
    if (duplicate) {
      return NextResponse.json({ success: false, message: "This Transaction ID has already been submitted." }, { status: 409 });
    }

    // Look up plan pricing from DB
    const planDoc = await db.collection("plans").findOne({
      name: { $regex: `^${plan}$`, $options: "i" },
      active: true,
    });

    let amount: number;
    if (planDoc) {
      amount = billing === "yearly" ? planDoc.price * 10 : planDoc.price;
    } else {
      // Fallback to hardcoded prices if plan not in DB
      amount = billing === "yearly" ? 4990 : 499;
    }
    const now = new Date().toISOString();

    // 1. Insert transaction verification request
    const transactionDoc = {
      userId,
      userEmail: session.user.email,
      userName: session.user.name,
      plan: plan || "Pro",
      billing: billing || "monthly",
      amount,
      paymentMethod,
      senderNumber,
      transactionId,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };

    const txResult = await db.collection("transactions").insertOne(transactionDoc);

    // 2. Update user state to pending verification
    const updateFields = {
      subscriptionStatus: "pending_verification",
      subscriptionPlan: plan || "Pro",
      updatedAt: now,
    };

    let userUpdateResult = await db.collection("user").updateOne(
      { _id: userId as any },
      { $set: updateFields }
    );

    if (userUpdateResult.matchedCount === 0 && ObjectId.isValid(userId)) {
      userUpdateResult = await db.collection("user").updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateFields }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verification details submitted successfully.",
      transactionId: txResult.insertedId.toString()
    });
  } catch (error: any) {
    console.error("Submit payment error:", error);
    return NextResponse.json({
      success: false,
      message: "Submission failed.",
      error: error.message
    }, { status: 500 });
  }
}
