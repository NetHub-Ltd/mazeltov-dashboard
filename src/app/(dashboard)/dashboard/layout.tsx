"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {/* Full viewport container */}
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar (independent scroll) */}
        <AppSidebar />

        {/* Main area */}
        <SidebarInset className="flex flex-col">
          {/* Header */}
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="font-semibold">Mazeltov Dashboard</span>
          </header>

          {/* Main scrollable content */}
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
