import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma.js";

export const auth = betterAuth({
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
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
