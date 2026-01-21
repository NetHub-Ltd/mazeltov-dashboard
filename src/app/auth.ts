import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { signIn, signOut, handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        console.log("Admin Email", process.env.ADMIN_EMAIL_ACCOUNT);
        const res = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: process.env.ADMIN_EMAIL_ACCOUNT }),
        });

        if (!res.ok) {
          const errorBody = await res.text();
          console.error(
            "Failed to authenticate with backend:",
            res.status,
            errorBody
          );
          throw new Error("Failed to authenticate with backend.");
        }

        const data = await res.json();

        token.accessToken = data.access_token;
        token.id = data.user?.id;
        token.user = data.user;
        token.picture = user.image;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
});
