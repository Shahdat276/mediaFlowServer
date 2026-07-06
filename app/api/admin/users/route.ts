import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { hashPassword } from "better-auth/crypto";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const db = getDb();
    const usersRaw = await db.collection("user").find({}).toArray();

    const users = usersRaw.map((u) => ({
      id: u._id.toString(),
      name: u.name || "",
      email: u.email || "",
      role: u.role || "user",
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
    }));

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: error.message || String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if user already exists
    const existing = await db.collection("user").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const now = new Date().toISOString();
    const result = await db.collection("user").insertOne({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: now,
      updatedAt: now,
      emailVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: `${role === "admin" ? "Admin" : "User"} created successfully`,
      userId: result.insertedId.toString(),
    });
  } catch (error: any) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: error.message || String(error) },
      { status: 500 }
    );
  }
}
