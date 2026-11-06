export type AuthEnv = {
  VERCEL_ENV?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  BETTER_AUTH_URL?: string;
};

export function authOrigins(env: AuthEnv): {
  baseURL: string;
  trustedOrigins: string[];
} {
  if (!env.VERCEL_ENV) {
    const baseURL = env.BETTER_AUTH_URL!;
    return { baseURL, trustedOrigins: [baseURL] };
  }
  if (env.VERCEL_ENV === "preview") {
    const baseURL = `https://${env.VERCEL_URL}`;
    return {
      baseURL,
      trustedOrigins: [baseURL, `https://${env.VERCEL_BRANCH_URL}`],
    };
  }
  const baseURL = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return { baseURL, trustedOrigins: [baseURL] };
}
