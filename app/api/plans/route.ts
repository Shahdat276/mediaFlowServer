import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = getDb();
    const plans = await db.collection("plans").find({ active: true }).toArray();

    return NextResponse.json({
      success: true,
      plans: plans.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        period: p.period || "month",
        description: p.description || "",
        features: p.features || [],
      })),
    });
  } catch (error: any) {
    console.error("Failed to fetch public plans:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch plans" }, { status: 500 });
  }
}
