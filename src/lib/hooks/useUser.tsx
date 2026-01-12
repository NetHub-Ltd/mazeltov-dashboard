// import { useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export const useAuthenticatedUser = (redirectTo = "/") => {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.replace(redirectTo);
//     }
//   }, [status, redirectTo, router]);

//   return {
//     session: status === "authenticated" ? session : null,
//     user: status === "authenticated" ? session?.user ?? null : null,
//     status,
//     isAuthenticated: status === "authenticated",
//     isLoading: status === "loading",
//   };
// };

import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAuthenticatedUser = (redirectTo = "/") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(redirectTo);
    }
  }, [status, redirectTo, router]);

  // Memoize the return value to prevent unnecessary downstream re-renders
  return useMemo(
    () => ({
      session: status === "authenticated" ? session : null,
      user: status === "authenticated" ? session?.user ?? null : null,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
    }),
    [session, status]
  );
};
