import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const userId = session.user.id;

    const transactions = await db.collection("transactions")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      transactions: transactions.map((tx) => ({
        id: tx._id.toString(),
        plan: tx.plan,
        billing: tx.billing,
        amount: tx.amount,
        paymentMethod: tx.paymentMethod,
        senderNumber: tx.senderNumber,
        transactionId: tx.transactionId,
        status: tx.status,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        approvedAt: tx.approvedAt || null,
        rejectedAt: tx.rejectedAt || null,
        rejectReason: tx.rejectReason || null,
      })),
    });
  } catch (error: any) {
    console.error("Billing history fetch error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch billing history",
    }, { status: 500 });
  }
}
