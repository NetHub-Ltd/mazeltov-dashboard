// // components/app-sidebar.tsx
// import { Home, Users, Activity, Settings, BarChart } from "lucide-react";
// import Link from "next/link";

// const sidebarlinks = [
//   {
//     name: "Home",
//     href: "/dashboard",
//     icon: Home,
//   },
//   {
//     name: "Bingwa Offers",
//     href: "/dashboard/bingwa-offers",
//     icon: Users,
//   },
//   {
//     name: "Loyalty Program",
//     href: "/activity",
//     icon: Activity,
//   },
//   {
//     name: "Contacts",
//     href: "/settings",
//     icon: Settings,
//   },
//   {
//     name: "Charts",
//     href: "/charts",
//     icon: BarChart,
//   },
// ]

// export function AppSidebar() {
//   return (
//     <div className="flex h-full flex-col overflow-hidden w-64 px-4 bg-white shadow-xl">
//       {/* <div className="">Mazeltov</div> */}
//       <div className="flex-1 overflow-y-auto overflow-x-hidden">
//         <div className="mb-6 p-4 border-b border-gray-200 flex items-center justify-center">
//           <p className="text-xl font-bold">Mazeltov</p>
//         </div>
//         <nav className="space-y-1">
//           {sidebarlinks.map((item) => (
//             <Link
//               key={item.name}
//               href={item.href}
//               className="group flex items-center rounded-md px-3 py-2 text-sm font-medium leading-6 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//             >
//               <item.icon className="mr-4 h-6 w-6 flex-none text-blue-500 group-hover:text-blue-600" />
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }

// components/app-sidebar.tsx
import { Home, Users, Activity, Settings, BarChart } from "lucide-react";
import Link from "next/link";

const sidebarlinks = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Bingwa Offers", href: "/dashboard/bingwa-offers", icon: Users },
  { name: "Loyalty Program", href: "/activity", icon: Activity },
  { name: "Contacts", href: "/settings", icon: Settings },
  { name: "Charts", href: "/charts", icon: BarChart },
];

export function AppSidebar() {
  return (
    <div className="flex h-full w-64 flex-col overflow-hidden bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4">
        <div className="mb-6 p-4 border-b border-gray-200 flex items-center justify-center">
          <p className="text-xl font-bold">Mazeltov</p>
        </div>

        <nav className="space-y-1">
          {sidebarlinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="mr-4 h-6 w-6 text-blue-500 group-hover:text-blue-600" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

// components/mobile-sidebar-drawer.tsx
import { Drawer, DrawerContent } from "@/components/ui/drawer";
// import { AppSidebar } from "@/components/app-sidebar";

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
