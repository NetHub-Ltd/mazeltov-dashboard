// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// const AUTH_URL = "/";

// export default async function proxy(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // 1. Local JWT Extraction
//   const token = await getToken({
//     req,
//     secret: process.env.AUTH_SECRET,
//   });

//   const accessToken = token?.accessToken as string;

//   if (!accessToken) {
//     return redirectToAuth(req);
//   }

//   try {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 2000);

//     // 2. Hard Validation
//     const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       signal: controller.signal,
//     });

//     clearTimeout(timeoutId);

//     if (!res.ok) {
//       return redirectToAuth(req);
//     }

//     const userData = await res.json();

//     if (!userData?.email) {
//       return redirectToAuth(req);
//     }

//     // 3. Downstream Identity Injection

//     const requestHeaders = new Headers(req.headers);

//     // Inject the validated token so downstream components don't have to re-extract it
//     requestHeaders.set("Authorization", `Bearer ${accessToken}`);
//     requestHeaders.set("x-proxy-validated", "true");

//     return NextResponse.next({
//       request: {
//         headers: requestHeaders,
//       },
//     });
//   } catch (error) {
//     console.error("[Proxy] Auth check failed:", error);
//     return redirectToAuth(req);
//   }
// }

// function redirectToAuth(req: NextRequest) {
//   const url = new URL(AUTH_URL, req.url);
//   url.searchParams.set("callbackUrl", req.nextUrl.pathname);
//   return NextResponse.redirect(url);
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/bingwa/:path*"],
// };



// proxy.ts (Middleware)
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_URL = "/";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If backend rejects token or check fails
    if (!res.ok) {
      return redirectToAuth(req, true); // Pass true to clear cookie
    }

    const userData = await res.json();
    console.log("User data from proxy auth check:", userData);

    if (!userData?.email) {
      return redirectToAuth(req, true);
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
    requestHeaders.set("x-proxy-validated", "true");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("[Proxy] Auth check failed:", error);
    return redirectToAuth(req, true);
  }
}

/**
 * Redirects and optionally clears the auth session cookie 
 * to stay in sync with the client-side hook.
 */
function redirectToAuth(req: NextRequest, shouldClearSession = false) {
  const url = new URL(AUTH_URL, req.url);
  url.searchParams.set("callbackUrl", req.nextUrl.pathname);
  
  const response = NextResponse.redirect(url);

  if (shouldClearSession) {
    // Manually expire the NextAuth session cookies
    // Note: Adjust 'next-auth.session-token' if using __Secure- prefix in prod
    response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
    response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/bingwa/:path*"],
};