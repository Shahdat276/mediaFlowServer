import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

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

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();

    const usersRaw = await db.collection("user").find({}).toArray();

    const users = usersRaw.map((u) => ({
      id: u._id.toString(),
      name: u.name || "",
      email: u.email || "",
      role: u.role || "user",
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : "",
    }));

    await client.close();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
