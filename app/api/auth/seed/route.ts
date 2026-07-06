import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = getDb();

    // 1. Create standard user if not exists
    const standardUser = await db.collection("user").findOne({ email: "user@mediaflow.com" });
    if (!standardUser) {
      await auth.api.signUpEmail({
        body: {
          email: "user@mediaflow.com",
          password: "Password123",
          name: "Standard User",
        },
      });
      await db.collection("user").updateOne(
        { email: "user@mediaflow.com" },
        { $set: { role: "user" } }
      );
    }

    // 2. Create admin user if not exists
    const adminUser = await db.collection("user").findOne({ email: "admin@mediaflow.com" });
    if (!adminUser) {
      await auth.api.signUpEmail({
        body: {
          email: "admin@mediaflow.com",
          password: "Password123",
          name: "System Admin",
        },
      });
      await db.collection("user").updateOne(
        { email: "admin@mediaflow.com" },
        { $set: { role: "admin" } }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Seeding complete. Test accounts initialized:",
      accounts: {
        user: { email: "user@mediaflow.com", password: "Password123", role: "user" },
        admin: { email: "admin@mediaflow.com", password: "Password123", role: "admin" },
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed accounts",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
