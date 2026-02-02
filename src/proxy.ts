import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_URL = "/";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProd = process.env.NODE_ENV === "production";
  const isDashboardRoute = pathname.startsWith("/dashboard");

  console.log(`[Proxy] Processing: ${pathname}`);

  try {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: isProd || req.url.startsWith("https://"),
    });

    const accessToken = token?.accessToken as string;
    const requestHeaders = new Headers(req.headers);
    let isValidated = false;

    // 1. Attempt Backend Validation if token exists
    if (accessToken) {
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

        if (res.ok) {
          const userData = await res.json();
          if (userData?.email) {
            console.log(`[Proxy] Token validated for: ${userData.email}`);
            requestHeaders.set("Authorization", `Bearer ${accessToken}`);
            requestHeaders.set("x-proxy-validated", "true");
            isValidated = true;
          }
        } else {
          console.warn(
            `[Proxy] Backend rejected token for ${pathname} (Status: ${res.status})`,
          );
        }
      } catch (fetchError) {
        console.error(
          `[Proxy] Backend validation failed (Timeout or Network)`,
          fetchError,
        );
      }
    }

    // 2. Blocking Logic: Redirect if /dashboard is accessed without a valid backend session
    if (isDashboardRoute && !isValidated) {
      console.log(
        `[Proxy] Unauthorized access to ${pathname}. Redirecting and clearing session.`,
      );
      return redirectToAuth(req, true);
    }

    // 3. Pass through for non-dashboard routes or validated dashboard routes
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error(`[Proxy] Critical Error at ${pathname}:`, error);
    // If we crash on a dashboard route, redirect to safety
    if (isDashboardRoute) return redirectToAuth(req, true);
    return NextResponse.next();
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
  matcher: [
    "/dashboard/:path*",
    "/api/bingwa/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};