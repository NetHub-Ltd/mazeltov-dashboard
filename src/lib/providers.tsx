"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// Use this to wrap your entire app (e.g., in layout.tsx)
export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
