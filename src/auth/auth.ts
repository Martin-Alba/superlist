import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "@/db/schema";

type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

export function createAuth(
  db: Db,
  config: { secret: string; baseURL: string },
) {
  return betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    secret: config.secret,
    baseURL: config.baseURL,
    emailAndPassword: { enabled: true },
    hooks: {
      // Normaliza el email antes de que Better Auth lo valide, entre por donde entre
      // (registerUser o el endpoint público /api/auth/sign-up/email).
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== "/sign-up/email") return;
        const email = ctx.body?.email;
        if (typeof email !== "string") return;
        return {
          context: { body: { ...ctx.body, email: email.trim().toLowerCase() } },
        };
      }),
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
