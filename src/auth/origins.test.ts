// @vitest-environment node
import { expect, test } from "vitest";
import { authOrigins } from "./origins";

test("en producción solo se permite el origen del dominio de producción", () => {
  const result = authOrigins({
    VERCEL_ENV: "production",
    VERCEL_PROJECT_PRODUCTION_URL: "superlist.example",
    VERCEL_URL: "superlist-abc123.vercel.app",
    VERCEL_BRANCH_URL: "superlist-git-main.vercel.app",
  });

  expect(result).toEqual({
    baseURL: "https://superlist.example",
    trustedOrigins: ["https://superlist.example"],
  });
});
