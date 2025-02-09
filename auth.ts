import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { Pool } from "@neondatabase/serverless";
import { routing } from "./i18n/routing";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const { name, email, image } = user;
      await pool.query(
        `INSERT INTO users (username, email, image_url, created_at, preference_currency) VALUES ($1, $2, $3, NOW(), $4) ON CONFLICT (email) DO UPDATE SET username = $1, email = $2, image_url = $3, preference_currency = $4;`,
        [name, email, image, "usd"]
      );
      return true;
    },
    async jwt({ token, trigger, session }) {
      if (trigger === "update") return { ...token, ...session };

      if (token.email) {
        const { rows } = await pool.query(
          `SELECT user_id::text, preference_currency::text FROM users WHERE email = $1`,
          [token.email]
        );
        if (rows.length > 0) {
          token.userId = rows[0].user_id as string;
          token.preferenceCurrency = rows[0].preference_currency as string;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (token.userId) {
        session.user = {
          ...session.user,
          id: token.userId as string,
          preferenceCurrency: token.preferenceCurrency as string,
        };
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const locale = url.split("/")[3];
      const isValidLocale = routing.locales.includes(locale);
      return isValidLocale ? url : `${baseUrl}/${routing.defaultLocale}`;
    },
  },
});
