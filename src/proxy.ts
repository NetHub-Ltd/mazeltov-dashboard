import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const authUrl = "/";

export async function proxy(req: NextRequest) {
  console.log("PROXY CALLED:", req.url);

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET, // make sure this matches your env
  });

  const accessToken = token?.accessToken as string | undefined;

  // No access token → redirect
  if (!accessToken) {
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

    // Token valid → allow request
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
 