import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export const useAuthenticatedUser = (redirectTo: string | null = "/") => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Strict check: Must have 'authenticated' status AND a valid user object.
  // This prevents 'False Positives' where a session object exists but is empty.
  const isAuthenticated = useMemo(() => {
    return status === "authenticated" && !!session?.user?.email;
  }, [status, session]);

  const isLoading = status === "loading";

  useEffect(() => {
    // Skip if still loading or if no redirect path is desired
    if (isLoading || !redirectTo) return;

    // If the session is invalid (no token or rejected by backend/middleware),
    // and we aren't already at the redirect destination, move the user.
    if (!isAuthenticated && pathname !== redirectTo) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, pathname, router, isLoading]);

  return useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      status,
      isAuthenticated,
      isLoading,
    }),
    [session, status, isAuthenticated, isLoading],
  );
};