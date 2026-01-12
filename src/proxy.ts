// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const authUrl = "/";

// export async function proxy(req: NextRequest) {
//   console.log("Proxy middleware called for:", req.url);
//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET, // make sure this matches your env
//   });

//   const accessToken = token?.accessToken as string;

//   // No access token → redirect
//   if (!accessToken) {
//     console.error("No access token found");
//     return NextResponse.redirect(new URL(authUrl, req.url));
//   }

//   try {
//     const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!res.ok) {
//       return NextResponse.redirect(new URL(authUrl, req.url));
//     }

//     const data = await res.json();

//     if (!data.email) {
//       console.error("No user found");
//       return NextResponse.redirect(new URL(authUrl, req.url));
//     }

//     // Token valid → allow request
//     console.log("User authenticated:", data.email);
//     return NextResponse.next();
//   } catch {
//     // Backend unreachable → fail closed
//     return NextResponse.redirect(new URL(authUrl, req.url));
//   }
// }

// /**
//  * Route matcher (kept in same file)
//  */
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_URL = "/";

/**
 * High-performance Proxy Middleware
 * Performs JWT validation + Remote "Hard" Session Check
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Extract JWT from request
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  const accessToken = token?.accessToken as string;

  // 2. Immediate local check (Saves a network call if JWT is missing/expired)
  if (!accessToken) {
    console.warn(`[Proxy] No token for: ${pathname}`);
    return redirectToAuth(req);
  }

  try {
    // 3. Perform the "Hard" Validation (Network-on-Network)
    // We use a AbortController to set a timeout so the proxy doesn't hang
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`[Proxy] Token invalid on backend: ${res.status}`);
      return redirectToAuth(req);
    }

    const userData = await res.json();

    if (!userData?.email) {
      return redirectToAuth(req);
    }

    // 4. Token is valid -> Inject user identity into headers for downstream use
    const response = NextResponse.next();
    response.headers.set("x-user-email", userData.email);

    return response;
  } catch (error) {
    // Fail closed if the backend is down or timeout reached
    console.error("[Proxy] Auth check failed or timed out:", error);
    return redirectToAuth(req);
  }
}

/**
 * Helper to handle clean redirects with callback tracking
 */
function redirectToAuth(req: NextRequest) {
  const url = new URL(AUTH_URL, req.url);
  // Store where the user was trying to go
  url.searchParams.set("callbackUrl", encodeURI(req.nextUrl.pathname));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/bingwa/:path*"],
};
