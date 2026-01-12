// Bingwa API endpoint
import { NextResponse, NextRequest } from "next/server";
import { AnalyticsSchema } from "@/lib/schemas/zodschemas";
import { ProductSchema } from "@/lib/schemas/zodschemas";

const dummyToken = process.env.DummtyToken;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${dummyToken}`, // replace with dynamic token from auth
};

export async function GET() {
  // Dummy response for Bingwa API

  const res = await fetch(`${process.env.API_BASE_URL}/bingwa/get-all`);
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch Bingwa data" },
      { status: res.status }
    );
  }

  const data = await res.json();
  const validation = AnalyticsSchema.parse(data);
  if (!validation.success) {
    return NextResponse.json({ error: "Invalid Bingwa data" }, { status: 400 });
  }

  return NextResponse.json(validation.data, { status: 200 });
}
// import { NextRequest, NextResponse } from "next/server";
// import { ProductSchema } from "@/lib/schemas/zodschemas";

// --- CREATE (POST) ---
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    const res = await fetch(`${process.env.API_BASE_URL}/bingwa/create`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(validatedData),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Create failed" }, { status: 400 });
  }
}

// --- UPDATE (PUT) ---
export async function PUT(request: NextRequest) {
  try {
    // 1. Extract ID from the URL query string (?id=XXX)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = ProductSchema.parse(body);

    // 2. Proxy to backend using the ID from query params
    const res = await fetch(`${process.env.API_BASE_URL}/bingwa/update/${id}`, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(validatedData),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    console.debug("Update response data:", data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

// --- DELETE (DELETE) ---
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter" },
        { status: 400 }
      );
    }

    const res = await fetch(`${process.env.API_BASE_URL}/bingwa/delete/${id}`, {
      method: "DELETE",
      headers: headers,
    });

    if (!res.ok)
      return NextResponse.json(
        { error: "Delete failed" },
        { status: res.status }
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
