"use client";

import { signIn } from "next-auth/react";

export function SignInButton() {
  //   const { status } = useSession();

  // If the session status is loading or authenticated, we don't show the button.
  //   if (status !== "unauthenticated") {
  //     return null;
  //   }

  // Use a simple button that calls the client-side signIn() function.
  // We specify 'google' to launch the Google flow directly.
  return (
    <button
      onClick={() => signIn("google")}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Sign in with Google
    </button>
  );
}
