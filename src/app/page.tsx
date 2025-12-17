// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { SignInButton } from "@/components/signInButton";
// import { useAuthenticatedUser } from "@/lib/hooks/useUser";

// const HomePage = () => {
//   const { user, isLoading, isAuthenticated } = useAuthenticatedUser();

//   if (isLoading) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-sm text-gray-500">Checking authentication…</p>
//       </div>
//     );
//   }
//   return (
//     <div className="bg-gray-50 flex justify-center flex-col mx-auto items-center h-screen">
//       <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-6 text-center space-y-4">
//         {isAuthenticated && user ? (
//           <>
//             {/* Avatar */}
//             {user.image && (
//               <div className="flex justify-center">
//                 <Image
//                   src={user.image}
//                   alt={user.name ?? "User avatar"}
//                   width={96}
//                   height={96}
//                   className="rounded-full"
//                 />
//               </div>
//             )}

//             {/* User info */}
//             <div>
//               <h1 className="text-xl font-semibold">
//                 Welcome{user.name ? `, ${user.name}` : ""}
//               </h1>
//               <p className="text-sm text-gray-600">{user.email}</p>
//             </div>

//             {/* CTA */}
//             <Link
//               href="/dashboard"
//               className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
//             >
//               Go to dashboard
//             </Link>
//           </>
//         ) : (
//           <>
//             <h1 className="text-xl font-semibold">Welcome to Mazeltov</h1>
//             <p className="text-sm text-gray-600">
//               Sign in to access your dashboard
//             </p>
//             <SignInButton />
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

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
      <div className="h-screen flex items-center justify-center text-sm text-gray-500">
        Checking authentication…
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm space-y-4">
        {isAuthenticated ? (
          <>
            {user?.image && (
              <Image
                src={user.image}
                alt={user.name ?? "User avatar"}
                width={96}
                height={96}
                className="mx-auto rounded-full"
              />
            )}

            <div>
              <h1 className="text-xl font-semibold">
                Welcome{user?.name && `, ${user.name}`}
              </h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                Go to dashboard
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 transition"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Welcome to Mazeltov</h1>
            <p className="text-sm text-gray-600">
              Sign in to access your dashboard
            </p>
            <SignInButton />
          </>
        )}
      </div>
    </div>
  );
}
