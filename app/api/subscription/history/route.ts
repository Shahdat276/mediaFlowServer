import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || !session.user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending | approved | rejected
    const plan = searchParams.get("plan");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const db = getDb();
    const userId = session.user.id;

    // Build filter
    const filter: Record<string, any> = { userId };
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }
    if (plan) {
      filter.plan = { $regex: plan, $options: "i" };
    }

    // Get total count for pagination
    const total = await db.collection("transactions").countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated transactions
    const transactions = await db.collection("transactions")
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Compute stats for the user (always across all transactions)
    const allTx = await db.collection("transactions").find({ userId }).toArray();
    const stats = {
      totalTransactions: allTx.length,
      totalPaid: allTx.filter((t: any) => t.status === "approved").reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
      pending: allTx.filter((t: any) => t.status === "pending").length,
      approved: allTx.filter((t: any) => t.status === "approved").length,
      rejected: allTx.filter((t: any) => t.status === "rejected").length,
    };

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
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      stats,
    });
  } catch (error: any) {
    console.error("Billing history fetch error:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch billing history",
    }, { status: 500 });
  }
}
