const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  const screenshotDir = path.join(__dirname, 'artifacts', 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to OrangeHRM Installer...');
    await page.goto('http://127.0.0.1', { waitUntil: 'load', timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, '00_start.png') });

    // 1. Welcome Screen
    console.log('Step 1: Welcome Screen');
    await page.waitForSelector('.oxd-button', { timeout: 30000 });
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 2. License Screen
    console.log('Step 2: License Screen');
    await page.waitForSelector('.oxd-button:has-text("Next")', { timeout: 30000 });

    console.log('Accepting license agreement...');
    // The label text is strictly "I accept the terms in the License Agreement"
    await page
      .locator('label')
      .filter({ hasText: /^I accept the terms in the License Agreement$/ })
      .click();
    await page.screenshot({ path: path.join(screenshotDir, '02_license_checked.png') });
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 3. Database Configuration
    console.log('Step 3: Database Configuration');
    await page.waitForSelector('.oxd-input', { timeout: 60000 });

    // Use clear label or placeholder based locators
    // Based on screenshot 03_database.png, labels are distinct.
    console.log('Filling database details...');

    // Database Host Name
    await page
      .locator('.oxd-input-group', { has: page.locator('label:has-text("Database Host Name")') })
      .locator('input')
      .fill('ohrm-db');

    // Database Name
    await page
      .locator('.oxd-input-group', { has: page.locator('label:has-text("Database Name")') })
      .locator('input')
      .fill('orangehrm');

    // Check "Use the same Database User for OrangeHRM"
    console.log('Checking "Use same user" checkbox...');
    await page
      .locator('label')
      .filter({ hasText: 'Use the same Database User for OrangeHRM' })
      .click();

    // Privileged Database Username
    await page
      .locator('.oxd-input-group', {
        has: page.locator('label:has-text("Privileged Database Username")'),
      })
      .locator('input')
      .fill('root');

    // Privileged Database User Password
    await page
      .locator('.oxd-input-group', {
        has: page.locator('label:has-text("Privileged Database User Password")'),
      })
      .locator('input')
      .fill('root_password');

    await page.screenshot({ path: path.join(screenshotDir, '03_database_filled.png') });
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // Wait for transition to System Check
    console.log('Waiting for Step 4 (System Check)...');
    await page
      .waitForSelector('label:has-text("System Check")', { timeout: 30000 })
      .catch(() => console.log('Label not found, continuing...'));
    await page.screenshot({ path: path.join(screenshotDir, '04_system_check.png') });
    // 4. System Check
    console.log('Step 4: System Check');
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 5. Instance Creation (Intermediate step in 5.8)
    console.log('Step 5: Instance Creation');
    await page.waitForSelector('label:has-text("Organization Name")', { timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, '05_instance_creation_before.png') });

    await page
      .locator('.oxd-input-group', { has: page.locator('label:has-text("Organization Name")') })
      .locator('input')
      .fill('OrangeHRM');

    // Selecting Country
    console.log('Selecting Country...');
    const countryGroup = page.locator('.oxd-input-group', {
      has: page.locator('label:has-text("Country")'),
    });
    await countryGroup.locator('.oxd-select-wrapper').click();
    // Wait for the options to appear and click one
    await page.waitForSelector('.oxd-select-option', { timeout: 10000 });
    await page.locator('.oxd-select-option').filter({ hasText: 'United States' }).first().click();

    await page.screenshot({ path: path.join(screenshotDir, '05_instance_creation_filled.png') });
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 6. Admin User Configuration
    console.log('Step 6: Admin User Configuration');
    await page.waitForSelector('input[placeholder="First Name"]', { timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, '06_admin_user_before.png') });

    // Employee Name
    console.log('Filling Employee Name...');
    await page.locator('input[placeholder="First Name"]').fill('Admin');
    await page.locator('input[placeholder="Last Name"]').fill('User');

    // Admin Username
    console.log('Filling Admin Username...');
    await page
      .locator('.oxd-input-group', { has: page.locator('label:has-text("Admin Username")') })
      .locator('input.oxd-input')
      .fill('admin');

    // Email
    console.log('Filling Email...');
    await page
      .locator('.oxd-input-group', { has: page.locator('label:has-text("Email")') })
      .locator('input.oxd-input')
      .fill('admin@example.com');

    // Password
    console.log('Filling Password...');
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill('Admin@1234');

    // Confirm Password
    console.log('Filling Confirm Password...');
    await passwordInputs.nth(1).fill('Admin@1234');

    await page.screenshot({ path: path.join(screenshotDir, '06_admin_filled.png') });
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 7. Confirmation
    console.log('Step 7: Confirmation');
    await page.waitForSelector('.oxd-button:has-text("Install")', { timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, '07_confirmation.png') });
    await page.locator('.oxd-button:has-text("Install")').first().click();

    // 7. Installing Progress
    console.log('Step 7: Installing... (this may take a few minutes)');
    await page.waitForSelector('.oxd-button:has-text("Next")', { timeout: 300000 });
    console.log('Installation process finished.');
    await page.locator('.oxd-button:has-text("Next")').first().click();

    // 8. Final Screen
    console.log('Step 8: Finalizing');
    await page.waitForSelector('.oxd-button:has-text("Launch OrangeHRM")', { timeout: 30000 });
    await page.screenshot({ path: path.join(screenshotDir, '08_finish.png') });
    await page.locator('.oxd-button:has-text("Launch OrangeHRM")').first().click();

    console.log('Installation Complete! Waiting for login page...');
    await page.waitForURL(/login/, { timeout: 60000 });
    console.log('Login page reached successfully!');
    await page.screenshot({ path: path.join(screenshotDir, '09_login_page.png') });
  } catch (e) {
    console.error('Installation failed:', e.message);
    await page.screenshot({ path: path.join(screenshotDir, 'error.png') });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
