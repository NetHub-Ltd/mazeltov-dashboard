import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { signIn, signOut, handlers, auth } = NextAuth({
  debug: true,
  providers: [Google],

  callbacks: {
    // signIn: async ({ user }) => {
    //   // if (!user?.email) return false;

    //   console.log("user:". user)

    //   // console.log("queried user: ", user.email);

    //   try {
    //     const res = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ email: user.email }),
    //     });

    //     const data = await res.json();

    //     console.log("server response: ", data);

    //     const { access_token } = data;

    //     // if (!access_token) return false;

    //     console.log("User signed in: ", user.email);
    //     return true;
    //   } catch {
    //     return false;
    //   }
    // },

    jwt: async ({ token, user, account }) => {
      if (account && user?.email) {
        try {
          const authRes = await fetch(
            `${process.env.API_BASE_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: user.email }),
            }
          );

          if (!authRes.ok) return token;

          const { access_token } = await authRes.json();
          token.accessToken = access_token;

          const meRes = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (meRes.ok) {
            const me = await meRes.json();
            token.userId = me.id;
          }

          token.picture = user.image;
        } catch (err) {
          console.error(err);
        }
      }

      return token;
    },

    session: async ({ session, token }) => {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
});
