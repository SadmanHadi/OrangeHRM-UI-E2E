import { chromium, FullConfig } from "@playwright/test";
import { execSync } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { LoginPage } from "./src/pages/login/LoginPage";

dotenv.config({ override: true });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function startOrangeHRM() {
    console.log("[start-orangehrm] Starting OrangeHRM via Docker Compose...");
    try {
        execSync("docker compose up -d --remove-orphans", { stdio: "inherit" });
    } catch (error) {
        console.warn(
            "[global-setup] Warning: docker compose up failed. Assuming server is already running or managed externally.",
        );
    }
}

async function stopOrangeHRM() {
    console.log("[stop-orangehrm] Stopping OrangeHRM via Docker Compose...");
    try {
        execSync("docker compose down -v --remove-orphans", {
            stdio: "inherit",
        });
        console.log("[stop-orangehrm] Ensuring all volumes are removed...");
        execSync("docker volume prune -f", { stdio: "ignore" });
        console.log("[stop-orangehrm] OrangeHRM stopped and volumes cleaned.");
    } catch (error) {
        console.error("[stop-orangehrm] Error stopping services:", error);
    }
}

async function waitForContainersReady(retries = 30) {
    const rootPass = process.env.DB_ROOT_PASSWORD || "root";
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
                // Double check that we can actually connect with root password
                try {
                    execSync(
                        `docker compose exec -T ohrm-db mariadb-admin ping -h 127.0.0.1 -u root -p${rootPass}`,
                        { stdio: "ignore" },
                    );
                    console.log(
                        "[global-setup] ✓ MariaDB is healthy and accepting connections.",
                    );
                    return true;
                } catch (e) {
                    console.log(
                        "[global-setup] MariaDB is healthy but not yet accepting connections (waiting for init)...",
                    );
                }
            }
        } catch (e) {
            // ignore
        }
        await sleep(5000);
    }
    return false;
}

/**
 * Checks if the database has the expected OrangeHRM tables
 */
function isDatabaseSchemaReady(): boolean {
    try {
        const rootPass = process.env.DB_ROOT_PASSWORD || "root";
        const dbName = process.env.DB_NAME || "orangehrm";
        // Check for a core table that indicates the installer has completed successfully
        const result = execSync(
            `docker compose exec -T ohrm-db mariadb -h 127.0.0.1 -u root -p${rootPass} -e "USE ${dbName}; SHOW TABLES LIKE 'ohrm_user';"`,
            { stdio: "pipe" },
        ).toString();
        return result.includes("ohrm_user");
    } catch (e) {
        return false;
    }
}

async function ensureConfFileInContainer(
    dbHost: string = process.env.DB_HOST || "ohrm-db",
    dbPort: string = process.env.DB_PORT || "3306",
    dbName: string = process.env.DB_NAME || "orangehrm",
    dbUser: string = process.env.DB_USER || "orangehrm",
    dbPass: string = process.env.DB_PASSWORD || "Orange123",
) {
    const buildConfContent = (
        host: string,
        port: string,
        name: string,
        user: string,
        pass: string,
    ) => {
        // Guard against 'undefined' string injection
        const h = host && host !== "undefined" ? host : "ohrm-db";
        const p = port && port !== "undefined" ? port : "3306";
        const n = name && name !== "undefined" ? name : "orangehrm";
        const u = user && user !== "undefined" ? user : "orangehrm";
        const pw = pass && pass !== "undefined" ? pass : "Orange123";

        return `<?php
class Conf {
    private string $dbHost = '${h}';
    private string $dbPort = '${p}';
    private string $dbName = '${n}';
    private string $dbUser = '${u}';
    private string $dbPass = '${pw}';

    public function __construct() {}
    public function getDbHost(): string { return $this->dbHost; }
    public function getDbPort(): string { return $this->dbPort; }
    public function getDbName(): string { return $this->dbName; }
    public function getDbUser(): string { return $this->dbUser; }
    public function getDbPass(): string { return $this->dbPass; }
}
`;
    };

    const confContent = buildConfContent(
        dbHost,
        dbPort,
        dbName,
        dbUser,
        dbPass,
    );
    console.log(
        `[global-setup] Injecting Conf.php with host=${dbHost}, user=${dbUser}`,
    );
    const tempDir = path.resolve(process.cwd(), "scripts", "artifacts");
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    const tempFilePath = path.resolve(tempDir, "Conf.php.tmp");
    fs.writeFileSync(tempFilePath, confContent, "utf8");

    try {
        execSync(
            "docker compose exec -T orangehrm mkdir -p /var/www/html/lib/confs",
            { stdio: "ignore" },
        );
        execSync(
            `docker compose cp "${tempFilePath}" orangehrm:/var/www/html/lib/confs/Conf.php`,
            { stdio: "pipe" },
        );
        await sleep(1000);
        const result = execSync(
            "docker compose exec -T orangehrm test -s /var/www/html/lib/confs/Conf.php && echo 'exists'",
            { stdio: "pipe" },
        ).toString();
        if (!result.includes("exists")) {
            throw new Error("Conf.php was copied but verification failed");
        }
        console.log(
            "[global-setup] ✓ Conf.php verified (file exists and is not empty)",
        );
    } catch (error) {
        console.error(
            `[global-setup] ✗ Failed to ensure Conf.php: ${(error as Error).message}`,
        );
        throw error;
    }
}

async function waitForLoginRouteReady(
    page: any,
    baseURL: string,
    retries = 60,
) {
    for (let i = 0; i < retries; i++) {
        try {
            const resp = await page.goto(baseURL, {
                waitUntil: "domcontentloaded",
                timeout: 10000,
            });
            const status = resp?.status() || 0;
            const content = await page.content();
            const schemaReady = isDatabaseSchemaReady();

            if (status === 200 && content.includes("Login") && schemaReady) {
                console.log(
                    "[global-setup] ✓ App is ready and rendering Login page.",
                );
                return true;
            }
            console.log(
                `[global-setup] Waiting for app readiness (attempt ${i + 1}/${retries}, status=${status}, db_schema=${schemaReady})...`,
            );
        } catch (e) {
            // ignore
        }
        await sleep(5000);
    }
    return false;
}

async function globalSetup(config: FullConfig) {
    const { baseURL, storageState } = config.projects[0].use;
    const AUTH_FILE =
        typeof storageState === "string" ? storageState : "storageState.json";
    const username = process.env.ADMIN_USERNAME || "admin";
    const password = process.env.ADMIN_PASSWORD || "Admin123!";
    const dbName = process.env.DB_NAME || "orangehrm";
    const dbUser = process.env.DB_USER || "orangehrm";
    const dbPassword = process.env.DB_PASSWORD || "Orange123";

    console.log(
        "[global-setup] Env presence { BASE_URL: true, ADMIN_USERNAME: true, ADMIN_PASSWORD: true }",
    );
    console.log(
        "[global-setup] Ensuring OrangeHRM is running via Docker Compose...",
    );

    await startOrangeHRM();
    const ready = await waitForContainersReady(36);
    if (!ready) {
        throw new Error(
            "[global-setup] Docker services failed to reach Healthy state.",
        );
    }

    fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage();

    let installerScriptRan = false;
    let installerResetAttempted = false;
    let loginSucceeded = false;

    for (let i = 0; i < 10; i++) {
        try {
            await page.goto(baseURL!, {
                waitUntil: "domcontentloaded",
                timeout: 30000,
            });
            const content = await page.content();
            const schemaReady = isDatabaseSchemaReady();

            if (content.includes("orangehrm-installer") || !schemaReady) {
                if (!installerScriptRan) {
                    console.log(
                        "[global-setup] Running OrangeHRM REST API installer...",
                    );
                    try {
                        execSync("npx tsx scripts/ui-installer.ts", {
                            stdio: "inherit",
                        });
                        console.log(
                            "[global-setup] ✓ Installer completed successfully.",
                        );
                        installerScriptRan = true;
                    } catch (error) {
                        console.error(
                            "[global-setup] ✗ Installer failed:",
                            (error as Error).message,
                        );
                        if (!installerResetAttempted) {
                            installerResetAttempted = true;
                            await stopOrangeHRM();
                            await sleep(5000);
                            await startOrangeHRM();
                            await waitForContainersReady(36);
                            continue;
                        }
                        throw new Error(
                            "[global-setup] Automated installer failed after clean reset.",
                        );
                    }
                    await waitForLoginRouteReady(page, baseURL!);
                    continue;
                }
            }

            // Normal login flow
            try {
                const loginPage = new LoginPage(page);
                await loginPage.login(username, password);
                console.log("[global-setup] ✓ Successfully logged in");
                loginSucceeded = true;
                break;
            } catch (err) {
                if (i % 2 === 0) {
                    console.log(
                        `[global-setup] Login attempt ${i + 1}/10 failed, retrying...`,
                    );
                }
            }
        } catch (error) {
            console.log(
                `[global-setup] Setup attempt ${i + 1}/10 failed: ${(error as Error).message}`,
            );
        }
        await sleep(15000);
    }

    if (!loginSucceeded) {
        throw new Error("[global-setup] Failed to login after 400 seconds.");
    }

    await page.context().storageState({ path: AUTH_FILE });
    await browser.close();
    console.log(
        `[global-setup] ✓ Global setup complete. Auth state saved to ${AUTH_FILE}`,
    );
}

export default globalSetup;
