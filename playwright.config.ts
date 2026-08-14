import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run db:seed && NEXT_PUBLIC_APP_URL=http://localhost:3217 next start --hostname 127.0.0.1 --port 3217",
    url: "http://localhost:3217/login",
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: "http://localhost:3217",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
