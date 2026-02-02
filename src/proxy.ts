// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const AUTH_URL = "/";

// export default async function proxy(req: NextRequest) {
//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET,
//   });

//   const accessToken = token?.accessToken as string;

//   console.log("[Proxy] Token:", accessToken);

//   if (!accessToken) {
//     return redirectToAuth(req);
//   }

//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 3500);

//     const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       signal: controller.signal,
//       cache: "no-store",
//     });

//     clearTimeout(timeoutId);
//     console.log("[Proxy] Auth response status:", res.status);

//     if (!res.ok) {
//       console.warn("[Proxy] Backend rejected token");
//       return redirectToAuth(req, true);
//     }

//     const userData = await res.json();
//     console.log("[Proxy] User data fetched:", userData);

//     if (!userData?.email) {
//       console.error("[Proxy] Invalid user data received");
//       return redirectToAuth(req, true);
//     }

//     const requestHeaders = new Headers(req.headers);
//     requestHeaders.set("Authorization", `Bearer ${accessToken}`);
//     requestHeaders.set("x-proxy-validated", "true");

//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   } catch (error) {
//     console.error("[Proxy] Critical Auth Error:", error);
//     return redirectToAuth(req, true);
//   }
// }

// function redirectToAuth(req: NextRequest, clearSession = false) {
//   const url = new URL(AUTH_URL, req.url);

//   if (req.nextUrl.pathname !== AUTH_URL) {
//     url.searchParams.set("callbackUrl", req.nextUrl.pathname);
//   }

//   const response = NextResponse.redirect(url);

//   if (clearSession) {
//     const cookieOptions = {
//       path: "/",
//       maxAge: 0,
//       expires: new Date(0),
//     };

//     // Comprehensive list of NextAuth cookies to wipe
//     const cookiesToClear = [
//       "next-auth.session-token",
//       "__Secure-next-auth.session-token",
//       "next-auth.csrf-token",
//       "next-auth.callback-url",
//     ];

//     cookiesToClear.forEach((name) => {
//       response.cookies.set(name, "", cookieOptions);
//     });
//   }

//   return response;
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/bingwa/:path*"],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export default async function proxy(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;

//   // LOG 1: Check if middleware is even firing for this path
//   console.log(`[Proxy-Monitor] Request Path: ${pathname}`);

//   try {
//     const token = await getToken({
//       req,
//       secret: process.env.AUTH_SECRET,
//     });

//     // LOG 2: Check if token exists
//     if (!token) {
//       console.log(`[Proxy-Monitor] No token found for: ${pathname}`);
//     } else {
//       // We only log a slice of the token for security
//       const tokenPreview = (token.accessToken as string)?.substring(0, 10);
//       console.log(`[Proxy-Monitor] Token found! Preview: ${tokenPreview}...`);
//       console.log(`[Proxy-Monitor] User Email in Token: ${token.email}`);
//     }

//     // Prepare headers to pass along
//     const requestHeaders = new Headers(req.headers);
//     if (token?.accessToken) {
//       requestHeaders.set("Authorization", `Bearer ${token.accessToken}`);
//     }
//     requestHeaders.set("x-proxy-monitor", "active");

//     // ALWAYS allow the request to proceed
//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     // LOG 3: Catch any runtime crashes (like environment variable issues)
//     console.error(`[Proxy-Monitor] CRITICAL ERROR at ${pathname}:`, error);

//     // Even on error, we let the user through for now to debug
//     return NextResponse.next();
//   }
// }

// export const config = {
//   // Broadened matcher to ensure we see logs for more than just dashboard
//   matcher: [
//     "/dashboard/:path*",
//     "/api/bingwa/:path*",
//     "/((?!api|_next/static|_next/image|favicon.ico).*)", // Catch-all excluding assets
//   ],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isProd = process.env.NODE_ENV === "production";
  const accessToken = req.cookies.get("accessToken")?.value;

  // LOG 1: Heartbeat
  console.log(`[Proxy-Diagnostic] Path: ${pathname}`);
  console.log(`[Proxy-Diagnostic] Access Token: ${accessToken}`);

  try {
    // LOG 2: Cookie Inspection
    // This identifies if the browser is even sending the session cookie
    const allCookies = req.cookies.getAll().map((c) => c.name);
    console.log(`[Proxy-Diagnostic] Cookie Names:`, allCookies);

    // Attempt to get token with explicit security settings
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      // Force it to check both secure and non-secure cookie name variants
      secureCookie: isProd || req.url.startsWith("https://"),
    });

    // LOG 3: Result of getToken
    if (!token) {
      console.log(`[Proxy-Diagnostic] !! TOKEN NULL !! for: ${pathname}`);
    } else {
      const tokenPreview = (token.accessToken as string)?.substring(0, 10);
      console.log(
        `[Proxy-Diagnostic] Token Success: ${tokenPreview}... | User: ${token.email}`,
      );
    }

    // Prepare headers
    const requestHeaders = new Headers(req.headers);
    if (token?.accessToken) {
      requestHeaders.set("Authorization", `Bearer ${token.accessToken}`);
    }
    requestHeaders.set("x-proxy-diagnostic", "active");

    // ALWAYS allow the request to proceed (No blocking)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Catch-all for decryption errors (e.g. wrong secret)
    console.error(`[Proxy-Diagnostic] CRITICAL ERROR at ${pathname}:`, error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/bingwa/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};