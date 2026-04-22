import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

// Check for critical variables to prevent instant worker failure
if (!process.env.BASE_URL && !process.env.CI) {
    console.warn(
        "[Playwright Config] Warning: BASE_URL is not set. Environment injection may have failed.",
    );
}

const AUTH_FILE = path.resolve(
    __dirname,
    "artifacts",
    "auth",
    "storageState.json",
);

const is_headless = /^(1|true|yes|on)$/i.test(
    String(process.env.HEADLESS ?? "true"),
);

export default defineConfig({
    testDir: "./tests",

    /* One-time login + server health-check before all tests */
    globalSetup: "./global-setup.ts",
    globalTeardown: "./global-teardown.ts",

    /* Run all tests in parallel */
    fullyParallel: true,

    /* Fail CI if test.only was left in source */
    forbidOnly: !!process.env.CI,

    /* Retry locally and on CI to handle heavy parallel Docker lag */
    retries: 2,

    /* Parallel workers — 4 locally for stress testing, 1 on CI for absolute stability in Matrix */
    workers: process.env.CI ? 1 : 4,

    /* Reporters: Monocart HTML + Playwright built-in HTML */
    reporter: [
        [
            "monocart-reporter",
            {
                name: "OrangeHRM E2E Bootcamp",
                outputFile: "./playwright-report/monocart/index.html",
                metadata: {
                    Project: "OrangeHRM UI E2E",
                    Environment: process.env.BASE_URL || "Local Docker",
                    Author: "Antigravity",
                    Type: "Capstone Bootcamp",
                },
            },
        ],
        ["html", { outputFolder: "playwright-report/html", open: "never" }],
        ["json", { outputFile: "playwright-report/results.json" }],
        ["list"],
    ],

    expect: {
        timeout: 15_000,
    },
    timeout: 120_000,

    use: {
        baseURL: process.env.BASE_URL,
        /* Reuse auth session state saved by global-setup */
        storageState: AUTH_FILE,
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 60_000,
        /* Maximum time navigation can take. */
        navigationTimeout: 60_000,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        /* Always run headless (overridable via HEADLESS=false) */
        headless: is_headless,
    },

    /* 4 browsers as per spec */
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "firefox",
            use: { ...devices["Desktop Firefox"] },
        },
        {
            name: "webkit",
            use: { ...devices["Desktop Safari"] },
        },
        {
            name: "edge",
            use: { ...devices["Desktop Edge"], channel: "msedge" },
        },
    ],
});
