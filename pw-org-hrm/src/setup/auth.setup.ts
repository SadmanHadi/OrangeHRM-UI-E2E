import { Page } from '@playwright/test';

/**
 * src/setup/auth.setup.ts
 * Project-specific login helper.
 * Navigates to the OrangeHRM login page and signs in using env vars.
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  const baseURL = process.env.BASE_URL as string;
  const username = process.env.ADMIN_USERNAME as string;
  const password = process.env.ADMIN_PASSWORD as string;

  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL(/dashboard/i, { timeout: 60_000 });
}
