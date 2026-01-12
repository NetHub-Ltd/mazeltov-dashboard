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
    /* CHANGE: Fixed height (h-screen) and hidden overflow on the parent 
       prevents the browser's main scrollbar from appearing.
    */
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* DESKTOP SIDEBAR: 
          Added h-full and flex-col. Internal AppSidebar should handle 
          its own overflow-y-auto.
      */}
      <aside className="hidden md:flex w-64 flex-col border-r border-sidebar-border bg-sidebar shrink-0 h-full">
        <AppSidebar />
      </aside>

      <MobileSidebarDrawer open={isMobileOpen} onOpenChange={setIsMobileOpen} />

      {/* MAIN CONTENT AREA: h-full and min-w-0 for flex stability */}
      <div className="flex flex-1 flex-col min-w-0 h-full">
        {/* HEADER: Added shrink-0 so it doesn't compress when content is tall */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>

            <h2 className="text-sm font-medium hidden sm:block">
              Dashboard Overview
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </header>

        {/* MAIN SCROLL BODY: 
            This is now the ONLY part of the main area that scrolls.
        */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
