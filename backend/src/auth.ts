import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma.js";

export const auth = betterAuth({
  // When auth is proxied through the frontend, this must be the public frontend URL.
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.FRONTEND_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, autoSignIn: true },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "vendeur",
        input: false,
      },
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL!],
  advanced: {
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
});
