import "next-auth";
import { DefaultJWT } from "next-auth/jwt";

// Extend the built-in Session object
declare module "next-auth" {
  interface Session {
    accessToken: string; // Your custom API token
    user: {
      id: string; // Your internal database ID
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }
}

// Extend the built-in JWT object
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    accessToken: string;
    accessTokenExpires: number;
  }
}
