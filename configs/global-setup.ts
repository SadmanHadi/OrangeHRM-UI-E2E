/* eslint-disable playwright/no-raw-locators, playwright/no-wait-for-selector */
import { chromium, FullConfig, Page } from "@playwright/test";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { startOrangeHRM } from "../scripts/start-orangehrm";
import { loadProjectEnv, requireEnv } from "../utils/env";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getDbRootPassword(): string {
    return requireEnv("DB_ROOT_PASSWORD");
}

function getDbName(): string {
    return requireEnv("DB_NAME");
}

async function waitForContainersReady(retries = 30): Promise<boolean> {
    const rootPass = getDbRootPassword();

    for (let i = 0; i < retries; i++) {
        try {
            const status = execSync(
                "docker compose ps --format {{.Service}}:{{.Status}}",
            ).toString();
            console.log(
                `[global-setup] Waiting for Docker services... ${status.trim().replace(/\n/g, ", ")}`,
            );

            const lowerStatus = status.toLowerCase();
            if (
                lowerStatus.includes("ohrm-db") &&
                lowerStatus.includes("healthy")
            ) {
                try {
                    execSync(
                        `docker compose exec -T ohrm-db mariadb-admin ping -h 127.0.0.1 -u root -p${rootPass}`,
                        { stdio: "ignore" },
                    );
                    console.log(
                        "[global-setup] ✓ MariaDB is healthy and accepting connections.",
                    );
                    return true;
                } catch {
                    console.log(
                        "[global-setup] MariaDB healthy but not accepting connections yet.",
                    );
                }
            }
        } catch {
            // ignore transient docker compose output failures
        }

        await sleep(5000);
    }

    return false;
}

function isDatabaseSchemaReady(): boolean {
    try {
        const rootPass = getDbRootPassword();
        const dbName = getDbName();
        const result = execSync(
            `docker compose exec -T ohrm-db mariadb -h 127.0.0.1 -u root -p${rootPass} -e "USE ${dbName}; SHOW TABLES LIKE 'ohrm_user';"`,
            { stdio: "pipe" },
        ).toString();
        return result.includes("ohrm_user");
    } catch {
        return false;
    }
}

function isAppConfigured(): boolean {
    try {
        execSync(
            "docker compose exec -T orangehrm ls /var/www/html/lib/confs/Conf.php",
            { stdio: "ignore" },
        );
        return true;
    } catch {
        return false;
    }
}

async function waitForHttpReady(
    baseURL: string,
    retries = 36,
    isReady: (status: number) => boolean = (status) =>
        status >= 200 && status < 600,
): Promise<void> {
    const loginUrl = new URL("/web/index.php/auth/login", baseURL).toString();

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(loginUrl, {
                method: "GET",
                redirect: "manual",
            });

            if (isReady(response.status)) {
                console.log(
                    `[global-setup] ✓ OrangeHRM web app responding at ${loginUrl} (${response.status}).`,
                );
                return;
            }

            console.log(
                `[global-setup] Waiting for web app... attempt ${i + 1}/${retries} (status: ${response.status})`,
            );
        } catch (error) {
            console.log(
                `[global-setup] Waiting for web app... attempt ${i + 1}/${retries} (error: ${(error as Error).message})`,
            );
        }

        await sleep(5000);
    }

    throw new Error(
        `[global-setup] OrangeHRM web app did not become reachable at ${loginUrl}.`,
    );
}

async function gotoLoginAndWaitForForm(
    page: Page,
    baseURL: string,
): Promise<void> {
    await page.goto(`${baseURL}/web/index.php/auth/login`, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
    });
    await page.waitForSelector('input[name="username"]', {
        timeout: 30000,
    });
}

async function globalSetup(config: FullConfig): Promise<void> {
    loadProjectEnv();

    const baseURL = process.env.BASE_URL || config.projects[0].use.baseURL;
    if (typeof baseURL !== "string" || !baseURL.trim()) {
        throw new Error(
            "[global-setup] BASE_URL is required. Copy .env.example and provide a real value.",
        );
    }

    const username = requireEnv("ADMIN_USERNAME");
    const password = requireEnv("ADMIN_PASSWORD");
    requireEnv("DB_ROOT_PASSWORD");
    requireEnv("DB_NAME");
    requireEnv("DB_USER");
    requireEnv("DB_PASSWORD");
    requireEnv("DB_HOST");
    requireEnv("DB_PORT");

    const { storageState } = config.projects[0].use;
    const authFile =
        typeof storageState === "string" ? storageState : "storageState.json";

    console.log(
        `[global-setup] Env { BASE_URL: ${baseURL}, ADMIN_USERNAME: ${username ? "set" : "missing"} }`,
    );
    console.log(
        "[global-setup] Ensuring OrangeHRM is running via Docker Compose...",
    );

    let needsStart = true;
    try {
        const psOutput = execSync("docker compose ps --format json", {
            stdio: "pipe",
        }).toString();
        if (
            psOutput.includes("orangehrm_app") &&
            psOutput.toLowerCase().includes("running")
        ) {
            const ready = await waitForContainersReady(5);
            if (ready) {
                needsStart = false;
                console.log(
                    "[global-setup] OrangeHRM containers already healthy.",
                );
            }
        }
    } catch {
        // proceed with fresh start
    }

    if (needsStart) {
        startOrangeHRM();
        const ready = await waitForContainersReady(36);
        if (!ready) {
            throw new Error(
                "[global-setup] Docker services failed to reach healthy state.",
            );
        }
    }

    const schemaReady = isDatabaseSchemaReady();
    const appConfigured = isAppConfigured();
    const fullyReady = schemaReady && appConfigured;

    if (fullyReady) {
        await waitForHttpReady(
            baseURL,
            60,
            (status) => status >= 200 && status < 400,
        );
    } else {
        // If not configured, we expect 500 or redirect to installer
        await waitForHttpReady(baseURL);
    }

    fs.mkdirSync(path.dirname(authFile), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
        if (!fullyReady) {
            console.log(
                `[global-setup] Running OrangeHRM installer (schemaReady: ${schemaReady}, appConfigured: ${appConfigured})...`,
            );
            execSync("pnpm exec tsx scripts/ui-installer.ts", {
                stdio: "inherit",
            });
            await waitForHttpReady(
                baseURL,
                60,
                (status) => status >= 200 && status < 400,
            );
        }

        console.log("[global-setup] Logging in...");
        try {
            await gotoLoginAndWaitForForm(page, baseURL);
        } catch {
            console.log(
                "[global-setup] Login form unavailable. Re-running installer once and retrying...",
            );
            execSync("pnpm exec tsx scripts/ui-installer.ts", {
                stdio: "inherit",
            });
            await waitForHttpReady(baseURL, 60);
            await gotoLoginAndWaitForForm(page, baseURL);
        }

        await page.locator('input[name="username"]').fill(username);
        await page.locator('input[name="password"]').fill(password);
        await page.locator('button[type="submit"]').click();

        await Promise.race([
            page.waitForURL(/dashboard/, { timeout: 15000 }),
            page.waitForSelector(".oxd-alert-content-text", { timeout: 15000 }),
        ]);

        if (!page.url().includes("dashboard")) {
            const errorText = await page
                .locator(".oxd-alert-content-text")
                .innerText()
                .catch(() => "Unknown error");
            throw new Error(`Login failed with error: ${errorText}`);
        }

        await page.context().storageState({ path: authFile });
        console.log("[global-setup] ✓ Admin login verified.");
    } catch (error) {
        await page.screenshot({
            path: path.resolve(
                __dirname,
                "..",
                "artifacts",
                "login-failed.png",
            ),
        });
        throw error;
    } finally {
        await browser.close();
    }

    console.log(
        `[global-setup] ✓ Global setup complete. Auth state saved to ${authFile}`,
    );
}

export default globalSetup;
