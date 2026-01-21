import { auth } from "@/app/auth";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { AnalyticsSchema, SalesSchema } from "@/lib/schemas/zodschemas";


// Move schemas outside the handler to prevent re-initialization on every request

export async function GET() {

  // get a real token from auth service in production
  const session = await auth();
  const token = session?.accessToken

  if (!token) {
    console.error("No token found in session");
    return new Response("Unauthorized", { status: 401 });
  }
  
  try {
    const user = await auth();
    if (!user?.accessToken)
      return new Response("Unauthorized", { status: 401 });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // replace with dynamic token from auth
    };

    const [salesRes, analyticsRes] = await Promise.allSettled([
      fetch(`${process.env.API_BASE_URL}/bingwa/sales-summary`, { headers }),
      fetch(`${process.env.API_BASE_URL}/bingwa/popular-offers`, { headers }),
    ]);

    // Helper to abstract the "Catch & Validate" logic
    const validateResponse = async (
      result: PromiseSettledResult<Response>,
      schema: z.ZodSchema,
      label: string
    ) => {
      if (result.status === "rejected") {
        console.error(`${label} Network Error:`, result.reason);
        return null;
      }

      if (!result.value.ok) {
        console.error(`${label} HTTP Error:`, result.value.status);
        return null;
      }

      try {
        const json = await result.value.json();
        const validation = schema.safeParse(json);
        if (validation.success) return validation.data;

        console.error(`${label} Schema Mismatch:`, validation.error.format());
        return null;
      } catch (e) {
        console.error(`${label} JSON Parse Error`);
        return null;
      }
    };

    const [salesData, analyticsData] = await Promise.all([
      validateResponse(salesRes, SalesSchema, "Sales"),
      validateResponse(analyticsRes, AnalyticsSchema, "Analytics"),
    ]);

    return NextResponse.json({
      sales: salesData,
      analytics: analyticsData,
      fetchedAt: new Date().toISOString(),
    });
  } catch (globalError) {
    // Catch-all for unexpected crashes (e.g. auth service down)
    console.error("Critical Route Error:", globalError);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
