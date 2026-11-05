import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;
// Puerto distinto del de `pnpm dev` (3000) para poder correr los e2e con el dev server abierto.
const port = 3100;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"] } }],
  // Siempre contra el build de producción, nunca contra `next dev`.
  webServer: {
    command: `pnpm build && pnpm start --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    // El puerto del e2e no es el de `pnpm dev`: la URL base de auth tiene que coincidir con él.
    env: { BETTER_AUTH_URL: baseURL },
    timeout: 180_000,
  },
});
