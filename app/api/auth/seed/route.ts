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

    // 3. Seed default plans if plans collection is empty
    const plansCount = await db.collection("plans").countDocuments();
    if (plansCount === 0) {
      const defaultPlans = [
        {
          name: "Starter Pack",
          price: 0,
          period: "week",
          description: "Test the interface and standard features before subscribing. Perfect to explore the app.",
          features: [
            "Standard compression",
            "Max resolution: 720p",
            "AI Analytics (locked)",
            "Hook Rate Predictor (locked)"
          ],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          name: "Creator Pro",
          price: 499,
          period: "month",
          description: "Unlock the full suite. Unlimited video resolutions, AI-driven metrics, and smart visual enhancements.",
          features: [
            "Unrestricted exports (1080p, 4K)",
            "AI Video Analytics Unlocked",
            "Hook Rate retention helper",
            "All Video Enhancers (Stabilize, Denoise)"
          ],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          name: "Enterprise",
          price: 15000,
          period: "year",
          description: "For media production teams and agencies requiring dedicated cloud nodes and volume software licenses.",
          features: [
            "Volume license activation keys",
            "Custom branding & metadata templates",
            "Dedicated support line (24/7)",
            "SLA uptime agreements"
          ],
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ];
      await db.collection("plans").insertMany(defaultPlans);
    }

    return NextResponse.json({
      success: true,
      message: "Seeding complete. Test accounts and default plans initialized:",
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
