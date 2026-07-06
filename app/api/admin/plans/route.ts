import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET — fetch all plans
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const db = getDb();
    const plans = await db.collection("plans").find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({
      success: true,
      plans: plans.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        period: p.period || "month",
        description: p.description || "",
        active: p.active !== false,
      })),
    });
  } catch (error: any) {
    console.error("Failed to fetch plans:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch plans", error: error.message }, { status: 500 });
  }
}

// POST — create a new plan
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, price, period, description, active } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ success: false, message: "Name and price are required" }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();

    const result = await db.collection("plans").insertOne({
      name,
      price: Number(price),
      period: period || "month",
      description: description || "",
      active: active !== false,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json({
      success: true,
      message: "Plan created successfully",
      planId: result.insertedId.toString(),
    });
  } catch (error: any) {
    console.error("Failed to create plan:", error);
    return NextResponse.json({ success: false, message: "Failed to create plan", error: error.message }, { status: 500 });
  }
}

// PUT — update an existing plan
export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Plan ID is required" }, { status: 400 });
    }

    const db = getDb();
    updates.updatedAt = new Date().toISOString();
    if (updates.price !== undefined) updates.price = Number(updates.price);

    await db.collection("plans").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    return NextResponse.json({ success: true, message: "Plan updated successfully" });
  } catch (error: any) {
    console.error("Failed to update plan:", error);
    return NextResponse.json({ success: false, message: "Failed to update plan", error: error.message }, { status: 500 });
  }
}

// DELETE — delete a plan
export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Plan ID is required" }, { status: 400 });
    }

    const db = getDb();
    await db.collection("plans").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, message: "Plan deleted successfully" });
  } catch (error: any) {
    console.error("Failed to delete plan:", error);
    return NextResponse.json({ success: false, message: "Failed to delete plan", error: error.message }, { status: 500 });
  }
}
