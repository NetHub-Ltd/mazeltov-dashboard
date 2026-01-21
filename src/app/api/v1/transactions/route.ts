import { auth } from "@/app/auth";
import { NextResponse, NextRequest } from "next/server";
import { TransactionsArraySchema } from "@/lib/schemas/zodschemas";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const token = session?.accessToken;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Robust Query Param Extraction
    const { searchParams } = new URL(request.url);
    const rawLimit = searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(rawLimit || "50", 10), 1), 100); // Clamp between 1-100

    // 2. Fetch with Timeout/Abort logic (best practice for proxying)
    const res = await fetch(
      `${process.env.API_BASE_URL}/transactions/mpesa/transactions?limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // Ensure fresh data for financial transactions
      },
    );

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorBody.message || "Upstream service error" },
        { status: res.status },
      );
    }

    const json = await res.json();

    // 3. Logic Check vs. Data Check
    if (!json.success || !json.data) {
      return NextResponse.json(
        { error: "Backend failed to fulfill request" },
        { status: 400 },
      );
    }

    // 4. Zero-Hallucination Schema Validation
    const validation = TransactionsArraySchema.safeParse(json.data);

    if (!validation.success) {
      console.error("[Validation Error]:", validation.error.format());
      return NextResponse.json(
        {
          error: "Data integrity check failed",
          details: validation.error.issues[0]?.message,
        },
        { status: 422 }, // Unprocessable Entity
      );
    }

    return NextResponse.json(
      {
        message: "Transactions fetched successfully",
        data: validation.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Route Handler Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
