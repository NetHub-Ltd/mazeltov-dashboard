"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
// import { SignInButton } from "@/components/signInButton";
import { SignInButton } from "@/components/googleSignInButton";
import { useAuthenticatedUser } from "@/lib/hooks/useUser";

export default function HomePage() {
  // We pass null to prevent the hook from redirecting us AWAY from the login page
  const { user, isAuthenticated, isLoading } = useAuthenticatedUser(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">
            Initializing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-[400px] space-y-8 rounded-2xl border border-border bg-card p-8 shadow-xl">
        {isAuthenticated ? (
          <div className="flex flex-col items-center space-y-6">
            {user?.image && (
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-border">
                <Image
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="text-center">
              <h1 className="text-xl font-bold text-foreground">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <div className="grid w-full gap-3">
              <Link
                href="/dashboard"
                className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="h-11 rounded-lg border border-border bg-transparent text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-black text-primary-foreground">
              M
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Mazeltov
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The high-performance dashboard for your team.
              </p>
            </div>

            <div className="w-full pt-4">
              <SignInButton />
            </div>

            <p className="text-balance text-center text-[10px] leading-relaxed text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}