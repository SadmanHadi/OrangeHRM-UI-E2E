import { chromium } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

/**
 * Automated OrangeHRM UI Installer
 * This script automates the multi-step web installer of OrangeHRM 5.x
 * to ensure a ready-to-test environment in CI/CD or fresh local setups.
 */
async function runInstaller() {
    dotenv.config();

    const baseURL = process.env.BASE_URL || "http://localhost";
    const dbHost = process.env.DB_HOST || "ohrm-db";
    const dbName = process.env.DB_NAME || "orangehrm";
    const dbUser = process.env.DB_USER || "orangehrm";
    const dbPass = process.env.DB_PASSWORD || "Orange123";
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "Admin123!";

    console.log(`[ui-installer] Starting installation at ${baseURL}...`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Load the installer
        await page.goto(`${baseURL}/web/index.php/orangehrm-installer`, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        // 2. Welcome / License Agreement
        const nextBtn = page.getByRole("button", { name: /Next|I Accept/i });
        await nextBtn.waitFor({ state: "visible", timeout: 15000 });
        await nextBtn.click();

        // 3. Database Configuration
        const dbHostInput = page.locator('input[name="dbHost"]');
        await dbHostInput.waitFor({ state: "visible", timeout: 15000 });
        await dbHostInput.fill(dbHost);
        await page.locator('input[name="dbName"]').fill(dbName);
        await page.locator('input[name="dbUser"]').fill(dbUser);
        await page.locator('input[name="dbPassword"]').fill(dbPass);

        await page.getByRole("button", { name: /Next/i }).click();

        // 4. Admin User Creation
        const adminUserInput = page.locator('input[name="adminUsername"]');
        await adminUserInput.waitFor({ state: "visible", timeout: 20000 });
        await adminUserInput.fill(adminUser);
        await page.locator('input[name="adminPassword"]').fill(adminPass);
        await page
            .locator('input[name="adminConfirmPassword"]')
            .fill(adminPass);

        await page.getByRole("button", { name: /Install/i }).click();

        // 5. Installation Progress
        console.log(
            "[ui-installer] Installation in progress (may take several minutes)...",
        );
        const finishBtn = page.getByRole("button", {
            name: /Finish|Login|Launch/i,
        });
        await finishBtn.waitFor({ state: "visible", timeout: 600000 });

        console.log("[ui-installer] ✓ Installation completed successfully.");

        // Optional: Take a screenshot
        const screenshotDir = path.resolve(
            process.cwd(),
            "scripts",
            "artifacts",
            "screenshots",
        );
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        await page.screenshot({
            path: path.join(screenshotDir, "installer-finished.png"),
        });
    } catch (error: any) {
        console.error("[ui-installer] ✗ Installation failed:", error.message);
        const screenshotDir = path.resolve(
            process.cwd(),
            "scripts",
            "artifacts",
            "screenshots",
        );
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        await page
            .screenshot({
                path: path.join(screenshotDir, "installer-failed.png"),
            })
            .catch(() => {});
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Ensure the promise is handled
void runInstaller();
