import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET — Fetch all transactions for admin review
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const db = getDb();
    const transactionsRaw = await db.collection("transactions").find({}).sort({ createdAt: -1 }).toArray();

    const transactions = transactionsRaw.map((tx) => ({
      id: tx._id.toString(),
      userId: tx.userId,
      userEmail: tx.userEmail || "",
      userName: tx.userName || "",
      plan: tx.plan,
      billing: tx.billing || "monthly",
      amount: tx.amount,
      paymentMethod: tx.paymentMethod,
      senderNumber: tx.senderNumber,
      transactionId: tx.transactionId,
      status: tx.status || "pending",
      createdAt: tx.createdAt,
    }));

    return NextResponse.json({ success: true, transactions });
  } catch (error: any) {
    console.error("Admin fetch transactions error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch transactions" }, { status: 500 });
  }
}

// POST — Approve or Reject a transaction
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, action } = body; // action is either "approve" or "reject"

    if (!id || !action) {
      return NextResponse.json({ success: false, message: "Transaction ID and action are required." }, { status: 400 });
    }

    const db = getDb();
    const tx = await db.collection("transactions").findOne({ _id: new ObjectId(id) });
    if (!tx) {
      return NextResponse.json({ success: false, message: "Transaction record not found." }, { status: 404 });
    }

    const now = new Date().toISOString();
    const targetUserId = tx.userId;

    if (action === "approve") {
      // Calculate expiry date (monthly = 30 days, yearly = 365 days)
      const expiryPeriod = tx.billing === "yearly" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      const expiryDate = new Date(Date.now() + expiryPeriod).toISOString();

      // 1. Update Transaction status to approved
      await db.collection("transactions").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "approved", updatedAt: now } }
      );

      // 2. Activate user subscription
      const userUpdates = {
        subscriptionStatus: "active",
        subscriptionPlan: tx.plan,
        subscriptionExpiresAt: expiryDate,
        cancelAtPeriodEnd: false,
        updatedAt: now,
      };

      let result = await db.collection("user").updateOne(
        { _id: targetUserId as any },
        { $set: userUpdates }
      );

      if (result.matchedCount === 0 && ObjectId.isValid(targetUserId)) {
        result = await db.collection("user").updateOne(
          { _id: new ObjectId(targetUserId) },
          { $set: userUpdates }
        );
      }

      return NextResponse.json({ success: true, message: "Transaction approved. Subscription activated successfully." });
    } else if (action === "reject") {
      // 1. Update Transaction status to rejected
      await db.collection("transactions").updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "rejected", updatedAt: now } }
      );

      // 2. Deactivate user pending subscription status
      const userUpdates = {
        subscriptionStatus: "inactive",
        updatedAt: now,
      };

      let result = await db.collection("user").updateOne(
        { _id: targetUserId as any },
        { $set: userUpdates }
      );

      if (result.matchedCount === 0 && ObjectId.isValid(targetUserId)) {
        result = await db.collection("user").updateOne(
          { _id: new ObjectId(targetUserId) },
          { $set: userUpdates }
        );
      }

      return NextResponse.json({ success: true, message: "Transaction rejected. User status reset." });
    } else {
      return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin update transaction error:", error);
    return NextResponse.json({ success: false, message: "Failed to update transaction", error: error.message }, { status: 500 });
  }
}
