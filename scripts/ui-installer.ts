/* eslint-disable playwright/no-raw-locators, playwright/no-wait-for-timeout, playwright/no-wait-for-selector, playwright/require-hook */
import { chromium } from "@playwright/test";
import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

async function install() {
    dotenv.config({ path: path.resolve(__dirname, "..", "configs", ".env") });

    const baseURL = process.env.BASE_URL || "http://localhost";
    const dbHost = process.env.DB_HOST || "ohrm-db";
    const dbName = process.env.DB_NAME || "orangehrm";
    // const dbUser = "root"; // Unused in this script
    const dbPass = process.env.DB_ROOT_PASSWORD || "Root123";
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "Admin@123456#";

    console.log(`[ui-installer] Starting installation at ${baseURL}...`);

    const wipeDatabase = () => {
        try {
            console.log(
                `[ui-installer] Dropping database ${dbName} for clean install...`,
            );
            const rootPass = process.env.DB_ROOT_PASSWORD || "Root123";
            execSync(
                `docker compose exec -T ohrm-db mariadb -h 127.0.0.1 -u root -p${rootPass} -e "DROP DATABASE IF EXISTS ${dbName};"`,
                { stdio: "inherit" },
            );
            console.log(`[ui-installer] ✓ Database ${dbName} dropped.`);
        } catch (error: any) {
            console.warn(
                `[ui-installer] Warning: Failed to wipe database: ${error.message}`,
            );
        }
    };

    // Wipe DB before starting browser to ensure we always get a fresh install UI
    wipeDatabase();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // 1. Load the installer
        const fillInput = async (label: string, value: string) => {
            const field = page.locator(".oxd-input-group", {
                has: page.locator("label", { hasText: label }),
            });
            // Only fill if it's a text-based input, not a checkbox
            await field
                .locator('input:not([type="checkbox"]), textarea')
                .first()
                .fill(value);
        };

        // Loop to handle steps with "Next" button until we hit Database or Admin steps
        const clickNextIfVisible = async (maxTries = 5) => {
            const oldContent = await page.content();
            for (let i = 0; i < maxTries; i++) {
                // Check for Fresh Installation radio if on welcome page
                const freshInstall = page.locator(
                    'label:has-text("Fresh Installation")',
                );
                if (await freshInstall.isVisible()) {
                    await freshInstall.click();
                    await page.waitForTimeout(500);
                }

                // Check for license acceptance checkbox
                const checkbox = page.locator(
                    'label:has-text("I accept the terms in the License Agreement")',
                );
                if (await checkbox.isVisible()) {
                    await checkbox.click();
                    await page.waitForTimeout(500);
                }

                const nextBtn = page
                    .locator("button.oxd-button--secondary")
                    .filter({ hasText: /Next|Install/i })
                    .first();
                if (
                    (await nextBtn.isVisible()) &&
                    (await nextBtn.isEnabled())
                ) {
                    await nextBtn.click();
                    await page.waitForTimeout(2000);
                    const newContent = await page.content();
                    if (newContent !== oldContent) {
                        // Increase timeout for long-running steps like "Install"
                        await page.waitForTimeout(10000); // Replacing networkidle with a safe wait
                        return true;
                    }
                }
                await page.waitForTimeout(1000);
            }
            return false;
        };

        await page.goto(`${baseURL}/installer/index.php/welcome`, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
        });

        // Step 2: Welcome -> License
        await clickNextIfVisible();

        // Step 3: License -> Database Configuration
        await clickNextIfVisible();

        // Step 4: Database Configuration
        console.log("[ui-installer] Configuring Database...");
        await page.waitForSelector(
            '.oxd-input-group:has-text("Database Host Name")',
            { timeout: 60000 },
        );

        await fillInput("Database Host Name", dbHost);
        await fillInput("Database Name", dbName);

        const useSameUserLabel = page.locator(
            'label:has-text("Use the same Database User for OrangeHRM")',
        );
        if (await useSameUserLabel.isVisible()) {
            await useSameUserLabel
                .locator('input[type="checkbox"], span')
                .first()
                .click();
        }

        await fillInput("Privileged Database Username", "root");
        await fillInput("Privileged Database User Password", dbPass);

        // Click Next and handle warnings
        const submitDatabaseStep = async () => {
            const nextBtn = page
                .locator("button.oxd-button--secondary")
                .filter({ hasText: /Next|Install/i })
                .first();

            for (let i = 0; i < 5; i++) {
                console.log(
                    `[ui-installer] Submitting Database step (attempt ${i + 1})...`,
                );
                await nextBtn.click();

                // Wait for either the next page or a warning
                const result = await Promise.race([
                    page
                        .waitForSelector(
                            'h5.orangehrm-installer-page-title:has-text("System Check")',
                            { timeout: 15000 },
                        )
                        .then(() => "success"),
                    page
                        .waitForSelector("text=Database Already Exist", {
                            timeout: 15000,
                        })
                        .then(() => "warning"),
                    page.waitForTimeout(16000).then(() => "timeout"),
                ]);

                if (result === "success") {
                    console.log(
                        "[ui-installer] ✓ Database step submitted successfully. Verifying DB creation...",
                    );
                    try {
                        const dbCheck = execSync(
                            `docker compose exec -T ohrm-db mariadb -h 127.0.0.1 -u root -p${dbPass} -e "SHOW DATABASES LIKE '${dbName}';"`,
                            { stdio: "pipe" },
                        ).toString();
                        if (!dbCheck.includes(dbName)) {
                            console.warn(
                                `[ui-installer] Warning: DB ${dbName} not found after submission! Maybe it takes time...`,
                            );
                        } else {
                            console.log(
                                `[ui-installer] ✓ DB ${dbName} verified.`,
                            );
                        }
                    } catch {
                        console.warn(
                            "[ui-installer] Warning: Failed to verify DB via CLI, but UI moved forward.",
                        );
                    }
                    return;
                }

                if (result === "warning") {
                    console.log(
                        "[ui-installer] Warning: Database already exists, switching to 'Existing Empty Database' mode...",
                    );
                    // Target the radio button label specifically
                    await page
                        .locator("label")
                        .filter({ hasText: "Existing Empty Database" })
                        .click();
                    await page.waitForTimeout(1000);
                    // Re-fill passwords as they might be cleared
                    await fillInput(
                        "Privileged Database User Password",
                        dbPass,
                    );
                    await fillInput("OrangeHRM Database User Password", dbPass);
                    continue;
                }

                console.log(
                    `[ui-installer] Database step attempt ${i + 1} inconclusive (result: ${result}), retrying...`,
                );
            }
            throw new Error(
                "Failed to move past Database Configuration step after multiple attempts",
            );
        };
        await submitDatabaseStep();

        // Step 5: System Check
        console.log("[ui-installer] System Check...");
        await clickNextIfVisible();

        // Step 6: Instance Creation
        console.log("[ui-installer] Instance Creation...");
        try {
            await page.waitForSelector(
                'h5.orangehrm-installer-page-title:has-text("Instance Creation")',
                { timeout: 120000 },
            );
            await fillInput("Organization Name", "OrangeHRM Inc");

            // Fix: Be more specific with the country dropdown
            const countryGroup = page.locator(".oxd-input-group", {
                hasText: "Country",
            });
            const countryDropdown = countryGroup.locator(".oxd-select-wrapper");
            await countryDropdown.click();
            await page
                .locator(".oxd-select-option", { hasText: "United States" })
                .first()
                .click();
            await clickNextIfVisible();
        } catch (e) {
            console.log(
                "[ui-installer] Instance Creation step failed to appear, current URL: " +
                    page.url(),
            );
            throw e;
        }

        // Step 7: Admin User Creation
        console.log("[ui-installer] Admin User Creation...");
        try {
            await page.waitForSelector(
                'h5.orangehrm-installer-page-title:has-text("Admin User Creation")',
                { timeout: 120000 },
            );
            const firstName = page.locator(
                'input[name="firstName"], input[placeholder="First Name"]',
            );
            if (await firstName.isVisible()) {
                await firstName.fill("Admin");
                await page
                    .locator(
                        'input[name="lastName"], input[placeholder="Last Name"]',
                    )
                    .fill("User");
            }
            await fillInput("Email", "admin@orangehrm.com");
            await fillInput("Admin Username", adminUser);
            await fillInput("Password", adminPass);
            await fillInput("Confirm Password", adminPass);
            await clickNextIfVisible();

            // Check for immediate error message
            const errorMsg = page.locator(".oxd-input-group__message");
            if (await errorMsg.isVisible()) {
                const text = await errorMsg.innerText();
                console.error(
                    `[ui-installer] ✗ Admin User Creation failed: ${text}`,
                );
                throw new Error(`Admin Creation failed: ${text}`);
            }
        } catch (e: any) {
            console.error(
                "[ui-installer] ✗ Admin User Creation step failed: " +
                    e.message,
            );
            throw e;
        }

        // Step 8: Confirmation
        console.log("[ui-installer] Final Confirmation...");
        await clickNextIfVisible();

        // Step 9: Installation Progress
        console.log(
            "[ui-installer] Installation in progress, waiting for 100%...",
        );
        try {
            const progress100 = page.getByText("100%");
            await progress100.waitFor({ state: "visible", timeout: 900000 });
            console.log("[ui-installer] ✓ Progress 100%. Clicking Next...");
            await clickNextIfVisible();

            const successHeader = page.locator(
                'h5.orangehrm-installer-page-title:has-text("Installation Complete")',
            );
            await successHeader.waitFor({ state: "visible", timeout: 60000 });

            const screenshotDir = path.join(
                __dirname,
                "artifacts",
                "screenshots",
            );
            if (!fs.existsSync(screenshotDir)) {
                fs.mkdirSync(screenshotDir, { recursive: true });
            }
            await page.screenshot({
                path: path.join(screenshotDir, "installer-success.png"),
                fullPage: true,
            });

            await clickNextIfVisible();
            console.log("[ui-installer] ✓ Installation successful.");
        } catch (e) {
            console.error(
                "[ui-installer] ✗ Failed to detect Installation Complete header. Checking for errors...",
            );
            const errorMsg = page
                .locator(".oxd-input-group__message, .oxd-text--error")
                .first();
            if (await errorMsg.isVisible()) {
                console.error(
                    `[ui-installer] Error on page: ${await errorMsg.innerText()}`,
                );
            }
            throw e;
        }

        console.log("[ui-installer] ✓ Installation completed successfully.");
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error(`[ui-installer] ✗ Installation failed: ${errorMessage}`);
        // ... (rest of catch)
        const screenshotDir = path.join(__dirname, "artifacts", "screenshots");
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        await page.screenshot({
            path: path.join(screenshotDir, "installer-failed.png"),
            fullPage: true,
        });
        process.exit(1);
    } finally {
        await browser.close();
    }
}

install().catch((e) => {
    console.error("Installer script failed:", e);
    process.exit(1);
});
