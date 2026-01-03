import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authUrl = "/";

export async function proxy(req: NextRequest) {
  console.log("Proxy middleware called for:", req.url);
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET, // make sure this matches your env
  });


  const accessToken = token?.accessToken as string;

  // No access token → redirect
  if (!accessToken) {
    console.error("No access token found");
    return NextResponse.redirect(new URL(authUrl, req.url));
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL(authUrl, req.url));
    }

    const data = await res.json();

    if (!data.email) {
      console.error("No user found");
      return NextResponse.redirect(new URL(authUrl, req.url));
    }

    // Token valid → allow request
    console.log("User authenticated:", data.email);
    return NextResponse.next();
  } catch {
    // Backend unreachable → fail closed
    return NextResponse.redirect(new URL(authUrl, req.url));
  }
}

/**
 * Route matcher (kept in same file)
 */
export const config = {
  matcher: ["/dashboard/:path*"],
};
