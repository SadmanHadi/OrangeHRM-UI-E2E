import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const BASE_URL = process.env.BASE_URL || 'http://localhost';
const DB_HOST = 'ohrm-db';
const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD || 'Root123';
const DB_NAME = process.env.DB_NAME || 'orangehrm';
const DB_USER = process.env.DB_USER || 'ohrm_admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'Orange123';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin123!';

async function runUIInstaller() {
    console.log('[ui-installer] Launching browser to run OrangeHRM Web Installer...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(`${BASE_URL}/installer/index.php`, { timeout: 120000 });
        
        // Step 1: Welcome page
        console.log('[ui-installer] Step 1: Welcome page');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step1-welcome.png' });
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 2: License Acceptance
        console.log('[ui-installer] Step 2: License Acceptance');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step2-license.png' });
        await page.getByLabel('I accept the terms in the').check({ force: true });
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 3: Database config
        console.log('[ui-installer] Step 3: Database Configuration');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step3-db.png' });
        
        // Select "Existing Empty Database"
        await page.locator('input').nth(1).check({ force: true });
        
        await page.locator('input').nth(2).fill(DB_HOST); 
        await page.locator('input').nth(3).fill('3306');
        await page.locator('input').nth(4).fill(DB_NAME);
        await page.locator('input').nth(5).fill('root'); 
        await page.locator('input').nth(6).fill(DB_ROOT_PASSWORD); 
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 4: System Check
        console.log('[ui-installer] Step 4: System Check');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step4-system.png' });
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 5: Instance Creation
        console.log('[ui-installer] Step 5: Instance Creation');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step5-instance.png' });
        await page.locator('input').nth(0).fill('OrangeHRM QA Automation');
        await page.locator('.oxd-select-text-input').first().click();
        await page.getByRole('option', { name: 'United States', exact: true }).click();
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 6: Admin User Creation
        console.log('[ui-installer] Step 6: Admin User Creation');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step6-admin.png' });
        await page.getByPlaceholder('First Name').fill('Admin'); 
        await page.getByPlaceholder('Last Name').fill('User'); 
        await page.locator('div:has-text("Email") + div input').first().fill('admin@example.com');
        await page.locator('div:has-text("Admin Username") + div input').first().fill(ADMIN_USERNAME);
        await page.locator('div:has-text("Password") + div input').first().fill(ADMIN_PASSWORD);
        await page.locator('div:has-text("Confirm Password") + div input').first().fill(ADMIN_PASSWORD);
        await page.getByRole('button', { name: 'Next' }).click();

        // Step 7: Confirmation Page
        console.log('[ui-installer] Step 7: Confirmation');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: 'artifacts/step7-confirmation.png' });
        // In some versions it's "Install", in others it might be "Finish"
        const installButton = page.getByRole('button').filter({ hasText: /Install|Finish/i });
        await installButton.first().click();

        // Step 8: Installing page - wait for completion
        console.log('[ui-installer] Step 8: Installing (this may take a few minutes)...');
        // Wait for the "Installation Complete" to appear as VISIBLE text
        const completeSelector = 'h5:has-text("Installation Complete"), .oxd-text--h5:has-text("Installation Complete")';
        await page.waitForSelector(completeSelector, { state: 'visible', timeout: 1200000 }); 
        await page.screenshot({ path: 'artifacts/step8-complete.png' });

        console.log('[ui-installer] === Installation Complete ===');
    } catch (e) {
        console.error('[ui-installer] Error:', e);
        await page.screenshot({ path: 'artifacts/installer-error.png' });
        throw e;
    } finally {
        await browser.close();
    }
}

runUIInstaller();
