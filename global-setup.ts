import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const AUTH_FILE = path.join(__dirname, 'artifacts', 'auth', 'storageState.json');

/**
 * Reusable login setup: logs in once and saves storage state.
 * Playwright will reuse the storage state across all test workers.
 */
async function globalSetup(_config: FullConfig) {
  const baseURL = process.env.BASE_URL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!baseURL || !username || !password) {
    throw new Error(
      'Missing required env vars: BASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD. ' +
        'Copy .env.example to .env and fill in the values.'
    );
  }

  // Ensure the output directory exists
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log(`[global-setup] Logging in at ${baseURL}…`);

  // Robust readiness loop: Wait for DB initialization and UI rendering
  let isReady = false;
  for (let i = 0; i < 60; i++) {
    try {
      await page.goto(baseURL, { waitUntil: 'load', timeout: 60_000 });
      await page.getByPlaceholder('Username').waitFor({ state: 'visible', timeout: 10_000 });
      isReady = true;
      break;
    } catch (e) {
      console.log(
        `  [global-setup] OrangeHRM login UI not ready, retrying in 10s (attempt ${i + 1}/60)...`
      );
      await page.waitForTimeout(10_000);
    }
  }

  if (!isReady) {
    throw new Error(
      'OrangeHRM UI failed to render the login page after 10 minutes. Initialization timeout.'
    );
  }

  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL(/dashboard/i, { timeout: 60_000 });

  await context.storageState({ path: AUTH_FILE });
  console.log(`[global-setup] Auth saved to ${AUTH_FILE}`);

  await browser.close();
}

export default globalSetup;
