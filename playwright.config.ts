import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "next dev --hostname 127.0.0.1 --port 3217",
    url: "http://127.0.0.1:3217/login",
    reuseExistingServer: true,
    timeout: 120000,
  },
  use: {
    baseURL: "http://127.0.0.1:3217",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
