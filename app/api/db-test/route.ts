import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    const conn = await dbConnect();
    const isConnected = conn.connection.readyState === 1;

    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
      readyState: conn.connection.readyState,
      isConnected,
    });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
