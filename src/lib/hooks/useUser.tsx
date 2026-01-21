// import { useEffect, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter, usePathname } from "next/navigation";

// /**
//  * Enhanced hook for session management.
//  * @param redirectTo - Path to redirect to if unauthenticated. Set to null to disable redirection.
//  */
// export const useAuthenticatedUser = (redirectTo: string | null = "/") => {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     // 1. Only redirect if a path is provided
//     // 2. Prevent infinite loops by checking if we are already at the destination
//     const shouldRedirect =
//       redirectTo !== null &&
//       status === "unauthenticated" &&
//       pathname !== redirectTo;

//     if (shouldRedirect) {
//       router.replace(redirectTo as string);
//     }
//   }, [status, redirectTo, router, pathname]);

//   return useMemo(
//     () => ({
//       session,
//       // Fallback to null safely if not authenticated
//       user: status === "authenticated" ? (session?.user ?? null) : null,
//       status,
//       isAuthenticated: status === "authenticated",
//       isLoading: status === "loading",
//     }),
//     [session, status],
//   );
// };


// hooks/useAuthenticatedUser.ts
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export const useAuthenticatedUser = (redirectTo: string | null = "/") => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If we're loading, or if no redirect is desired, do nothing.
    if (status === "loading" || redirectTo === null) return;

    // If the Middleware cleared the cookie, status will be 'unauthenticated'
    if (status === "unauthenticated" && pathname !== redirectTo) {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, pathname, router]);

  return useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
    }),
    [session, status]
  );
};