import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // The app now persists to a real SQLite file shared by every test, instead
  // of in-memory mock data reset per page load — run serially so booking and
  // admin-mutation tests can't race each other over the same rows.
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4175",
    trace: "off",
    screenshot: "off",
    launchOptions: {
      executablePath: "/opt/pw-browsers/chromium",
    },
  },
  webServer: {
    // Start from a freshly seeded database on every test run.
    command: "rm -rf data && npm run start -- -p 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
