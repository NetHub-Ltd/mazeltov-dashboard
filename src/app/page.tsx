"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { SignInButton } from "@/components/googleSignInButton";
import { useAuthenticatedUser } from "@/lib/hooks/useUser";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, session } =
    useAuthenticatedUser(null);

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[400px] space-y-8 rounded-2xl border bg-card p-8 shadow-xl">
        {isAuthenticated ? (
          <div className="flex flex-col items-center space-y-6">
            {user?.image && (
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-border">
                <Image
                  src={user.image}
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h1 className="text-xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="grid w-full gap-3">
              <Link
                href="/dashboard"
                className="flex h-11 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="h-11 rounded-lg border text-sm font-semibold"
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl font-black text-primary-foreground"></div>
            <div>
              <h1 className="text-2xl font-bold">Mazeltov</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The high-performance dashboard.
              </p>
            </div>
            <SignInButton />
          </div>
        )}
      </div>
    </main>
  );
}

const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);
