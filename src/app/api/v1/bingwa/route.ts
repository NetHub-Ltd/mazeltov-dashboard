// Bingwa API endpoint
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET() {
  // Dummy response for Bingwa API
  const data = {
    message: "Hello from Bingwa API!",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(data);
}
