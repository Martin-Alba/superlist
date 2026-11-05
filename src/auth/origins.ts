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
  const baseURL = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return { baseURL, trustedOrigins: [baseURL] };
}
