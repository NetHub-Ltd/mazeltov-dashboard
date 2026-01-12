"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { SignInButton } from "@/components/signInButton";
import { useAuthenticatedUser } from "@/lib/hooks/useUser";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuthenticatedUser();

  if (isLoading) {
    return (
      /* Uses our muted foreground and themed background */
      <div className="h-screen flex items-center justify-center text-sm text-muted-foreground bg-background">
        Checking authentication…
      </div>
    );
  }

  return (
    /* Removed bg-gray-50, using themed background variable */
    <div className="h-screen flex items-center justify-center bg-background p-4">
      {/* - Used bg-card for the container
          - Used border-border for subtle separation
          - Used shadow-sm which adapts to dark mode better 
      */}
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm space-y-6">
        {isAuthenticated ? (
          <>
            {user?.image && (
              <div className="relative mx-auto w-24 h-24">
                <Image
                  src={user.image}
                  alt={user.name ?? "User avatar"}
                  fill
                  className="rounded-full border-2 border-border object-cover"
                />
              </div>
            )}

            <div className="space-y-1">
              {/* Uses fluid text-xl from theme */}
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Welcome{user?.name && `, ${user.name}`}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Go to dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Welcome to Mazeltov
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to access your dashboard
              </p>
            </div>
            <div className="pt-2">
              <SignInButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
