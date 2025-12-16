"use client";

import { AppSidebar, MobileSidebarDrawer } from "@/components/sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Mobile sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col">
        <AppSidebar />
      </div>
      {/* Mobile drawer */}
      <MobileSidebarDrawer
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />

      <main className="flex-1 bg-slate-100 ">
        <header className="bg-slate-50 h-16 flex items-center justify-between">
          <div>
            <Button
              variant={"ghost"}
              size={"icon-lg"}
              className="font-bold transition-all duration-300"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu />
            </Button>
          </div>
        </header>
        <div className="overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
}



