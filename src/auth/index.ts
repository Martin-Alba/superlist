import { db } from "@/db";
import { createAuth } from "./auth";
import { authOrigins } from "./origins";

// Instancia de la app: Neon como base y la URL base y orígenes según el entorno.
export const auth = createAuth(db, {
  secret: process.env.BETTER_AUTH_SECRET!,
  ...authOrigins({
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  }),
});
