import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_URL = "/";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const accessToken = token?.accessToken as string;

  if (!accessToken) {
    return redirectToAuth(req);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn("[Proxy] Backend rejected token");
      return redirectToAuth(req, true);
    }

    const userData = await res.json();

    if (!userData?.email) {
      return redirectToAuth(req, true);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    requestHeaders.set("x-proxy-validated", "true");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (error) {
    console.error("[Proxy] Critical Auth Error:", error);
    return redirectToAuth(req, true);
  }
}

function redirectToAuth(req: NextRequest, clearSession = false) {
  const url = new URL(AUTH_URL, req.url);

  if (req.nextUrl.pathname !== AUTH_URL) {
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  }

  const response = NextResponse.redirect(url);

  if (clearSession) {
    const cookieOptions = {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    };

    // Comprehensive list of NextAuth cookies to wipe
    const cookiesToClear = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "next-auth.callback-url",
    ];

    cookiesToClear.forEach((name) => {
      response.cookies.set(name, "", cookieOptions);
    });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/bingwa/:path*"],
};