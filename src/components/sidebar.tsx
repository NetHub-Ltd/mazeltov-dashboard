// import { Home, Users, Activity, Settings, BarChart } from "lucide-react";
// import Link from "next/link";

// const sidebarlinks = [
//   { name: "Home", href: "/dashboard", icon: Home },
//   { name: "Bingwa Offers", href: "/dashboard/bingwa-offers", icon: Users },
//   { name: "Loyalty Program", href: "/activity", icon: Activity },
//   { name: "Contacts", href: "/settings", icon: Settings },
//   { name: "Charts", href: "/charts", icon: BarChart },
// ];

// export function AppSidebar() {
//   return (
//     <div className="flex h-full w-64 flex-col overflow-hidden bg-white shadow-xl">
//       <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
//         <div className="mb-6 p-4 border-b border-gray-200 flex items-center justify-center">
//           <p className="text-xl font-bold">Mazeltov</p>
//         </div>

//         <nav className="space-y-1">
//           {sidebarlinks.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//             >
//               <item.icon className="mr-4 h-6 w-6 text-blue-500 group-hover:text-blue-600" />
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }

"use client";

// // components/mobile-sidebar-drawer.tsx
import { Drawer, DrawerContent } from "@/components/ui/drawer";
// // import { AppSidebar } from "@/components/app-sidebar";

export function MobileSidebarDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-64 p-0">
        <AppSidebar />
      </DrawerContent>
    </Drawer>
  );
}

import { Home, Users, Activity, Settings, BarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarlinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Bingwa Offers", href: "/dashboard/bingwa-offers", icon: Users },
  { name: "Loyalty Program", href: "/activity", icon: Activity },
  { name: "Contacts", href: "/settings", icon: Settings },
  { name: "Charts", href: "/charts", icon: BarChart },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <p className="text-lg font-bold tracking-tight text-sidebar-foreground">
          Mazeltov
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {sidebarlinks.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }
              `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 transition-colors ${
                  isActive
                    ? "text-sidebar-primary"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Optional Footer (e.g., User/Settings) */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary text-xs font-bold">
            MZ
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-xs font-medium text-sidebar-foreground">
              Admin User
            </p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">
              admin@mazeltov.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
