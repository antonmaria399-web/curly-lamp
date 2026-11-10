import { defineConfig, devices } from "@playwright/test";

// Needs: local Supabase (`npx supabase start`) and `.env.local` pointing at it + KWOP_API=http://127.0.0.1:4010.
export default defineConfig({
  testDir: "tests",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  globalSetup: "./tests/global-setup.ts",
  use: { baseURL: process.env.BASE_URL || "http://localhost:3000", trace: "off" },
  projects: [{ name: "phone", use: { ...devices["iPhone 13"], browserName: "chromium", launchOptions: { executablePath: process.env.PW_CHROMIUM || "/opt/pw-browsers/chromium" } } }],
  webServer: [
    { command: "node tests/kwop-mock.mjs", port: 4010, reuseExistingServer: true },
    { command: "npm run start", port: 3000, reuseExistingServer: true, timeout: 120_000 },
  ],
});
