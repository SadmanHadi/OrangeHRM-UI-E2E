import { chromium, FullConfig } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

const AUTH_FILE = path.join(__dirname, 'artifacts', 'auth', 'storageState.json');

/**
 * Reusable login setup: logs in once and saves storage state.
 * Playwright will reuse the storage state across all test workers.
 */
async function globalSetup(_config: FullConfig) {
  // 1. Start OrangeHRM local server (Docker)
  console.log('[global-setup] Ensuring OrangeHRM is running via Docker Compose...');
  try {
    execSync('docker compose up -d', { stdio: 'inherit' });
  } catch (error) {
    console.warn('[global-setup] Warning: docker compose up failed. Assuming server is already running or managed externally.');
  }

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
  for (let i = 0; i < 40; i++) {
    try {
      await page.goto(baseURL, { waitUntil: 'load', timeout: 30_000 });
      const content = await page.content();
      
      // If we see the installer, run the installation script
      if (content.includes('oxd-button') && !content.includes('auth-login')) {
        console.log('[global-setup] Installer detected. Running automated installation...');
        execSync('node scripts/install-orangehrm.js', { stdio: 'inherit' });
        // Refresh page after installation
        await page.goto(baseURL, { waitUntil: 'load', timeout: 30_000 });
      }

      await page.getByPlaceholder('Username').waitFor({ state: 'visible', timeout: 10_000 });
      isReady = true;
      break;
    } catch (e) {
      console.log(
        `  [global-setup] OrangeHRM not ready yet, retrying in 10s (attempt ${i + 1}/40)...`
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
