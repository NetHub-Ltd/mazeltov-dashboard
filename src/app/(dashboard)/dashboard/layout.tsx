"use client";

import { AppSidebar, MobileSidebarDrawer } from "@/components/sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* DESKTOP SIDEBAR: 
         Pinned to the left. Using 'sidebar' tokens from your theme. 
      */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0">
        <AppSidebar />
      </aside>

      {/* MOBILE DRAWER: 
         Only triggers when the menu button is clicked on small screens.
      */}
      <MobileSidebarDrawer open={isMobileOpen} onOpenChange={setIsMobileOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {/* Menu Trigger - Only visible on mobile */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>

            {/* Optional Breadcrumb or Page Title */}
            <h2 className="text-sm font-medium hidden sm:block">
              Dashboard Overview
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {/* User Profile placeholder */}
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </header>

        {/* SCROLLABLE BODY:
           Uses 'overflow-y-auto' so the header stays sticky.
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
