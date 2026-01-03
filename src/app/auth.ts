import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
export const { signIn, signOut, handlers, auth } = NextAuth({
  // debug: true,
  providers: [Google],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google") {
        const res = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        });

        if (!res.ok) {
          const errorBody = await res.text();
          console.error("Failed to authenticate with backend:", res.status, errorBody);
          throw new Error("Failed to authenticate with backend.");
        }

        const data = await res.json();
        const { access_token } = data;

        token.accessToken = access_token;
        token.id = user.id;
        token.user = data.user;
        token.picture = user.image;
      }
      return token;
    },

    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
