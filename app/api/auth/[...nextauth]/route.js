import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          type: "text",
        },
        password: {
          password: {
            type: "password",
          },
        },
      },
      async authorize(credentials) {
        var user;
        try {
          const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "user/auth",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );
          user = await res.json();
        } catch (err) {
          console.log(err);
        } finally {
          console.log(user);
          if (user.error === true) {
            return null;
          } else if (user.error === false) {
            return {
              error: user.error,
              message: user.message,
              data: user.data,
            };
          }
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile, credentials }) {
      // console.log("user signed in success")
      return true;
    },
    async signOut({ user }) {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.error = user.error;
        token.message = user.message;
        token.data = user.data;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.error = token.error;
        session.message = token.message;
        session.data = token.data;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    // error: "/"
  },
  secret:
    process.env.JWT_SECRET || "3caxjLWm0CQvG4Hs4oQXJ8a25zj7NraH/1ZS7MJo8wg=",
});

export { handler as GET, handler as POST };
