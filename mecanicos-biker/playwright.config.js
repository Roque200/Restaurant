// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4174',
    trace: 'off',
    screenshot: 'off',
    launchOptions: {
      executablePath: '/opt/pw-browsers/chromium',
    },
  },
  webServer: {
    command: 'npx http-server . -p 4174 -s',
    url: 'http://127.0.0.1:4174/index.html',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
