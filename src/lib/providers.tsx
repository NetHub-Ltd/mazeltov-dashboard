"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes"; // You'll need to: npm install next-themes
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
