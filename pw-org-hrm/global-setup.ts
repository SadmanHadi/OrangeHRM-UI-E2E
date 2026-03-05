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
  await page.goto(baseURL, { waitUntil: 'load', timeout: 60_000 });
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL(/dashboard/i, { timeout: 60_000 });

  await context.storageState({ path: AUTH_FILE });
  console.log(`[global-setup] Auth saved to ${AUTH_FILE}`);

  await browser.close();
}

export default globalSetup;
