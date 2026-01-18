import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, lastLoginMethod } from "better-auth/plugins";
import { db } from "@/db/index.";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    "https://educacao-coreau.vercel.app",
    "https://*.vercel.app",
  ],
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      banned: {
        type: "boolean",
        required: false,
      },
      description: {
        type: "string",
        required: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.id, session.userId),
          });
          return {
            data: {
              ...session,
              role: user?.role, // Pegar a role diretamente do user
            },
          };
        },
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [admin(), lastLoginMethod(), nextCookies()],
});
