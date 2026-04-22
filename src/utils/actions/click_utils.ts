import { expect, test, type Locator, type Page } from "@playwright/test";
import { logError, logStep, logSuccess } from "src/utils/logging/logger";
import { waitForPageStability } from "./wait_utils";

export type SafeClickOptions = {
    /**
     * Human-readable description for logs.
     * Example: "Login button", "Submit filter form".
     */
    description?: string;

    /**
     * Optional locator to wait for AFTER the click succeeds.
     * Example: a dashboard heading, success toast, next page element, etc.
     */
    afterLocator?: Locator;

    /**
     * Max time (ms) for waits & click. Defaults to 60s.
     */
    timeoutMs?: number;
};

type StepOptions = { box?: boolean };

async function boxedStep<T>(
    title: string,
    fn: () => Promise<T>,
    opts: StepOptions = { box: true },
): Promise<T> {
    try {
        return await test.step(title, fn, { box: opts.box ?? true });
    } catch {
        // If called outside Playwright test context (e.g. globalSetup), run normally.
        return await fn();
    }
}

/**
 * Clicks a locator safely:
 *  - waits until it is visible & enabled
 *  - scrolls it into view
 *  - clicks it (Playwright auto-waits for stable & clickable)
 *  - optionally waits for a post-click locator to become visible
 *
 * Boxed steps show up in the Playwright HTML report.
 */
export async function safeClick(
    target: Locator,
    options: SafeClickOptions = {},
    page: Page,
): Promise<void> {
    const { description, afterLocator, timeoutMs = 60_000 } = options;
    const label = description ?? "target element";

    await boxedStep(`safeClick: ${label}`, async () => {
        try {
            await boxedStep("Wait for page stability", async () => {
                await waitForPageStability(page);
            });

            await boxedStep("Wait for element visible", async () => {
                logStep(
                    `safeClick: ${label} - waiting for element to be visible`,
                );
                await expect(target).toBeVisible({ timeout: timeoutMs });
            });

            await boxedStep("Wait for element enabled", async () => {
                logStep(
                    `safeClick: ${label} - waiting for element to be enabled`,
                );
                await expect(target).toBeEnabled({ timeout: timeoutMs });
            });

            await boxedStep("Scroll into view", async () => {
                logStep(`safeClick: ${label} - scrolling into view`);
                await target.scrollIntoViewIfNeeded();
            });

            await boxedStep("Click", async () => {
                logStep(`safeClick: ${label} - clicking`);
                await target.click({ timeout: timeoutMs });
            });

            logSuccess(`safeClick: ${label} - click succeeded`);

            if (afterLocator) {
                await boxedStep("Wait for post-click element", async () => {
                    logStep(
                        `safeClick: ${label} - waiting for post-click element to be visible`,
                    );
                    await expect(afterLocator).toBeVisible({
                        timeout: timeoutMs,
                    });
                    logSuccess(
                        `safeClick: post-click element for "${label}" is visible`,
                    );
                });
            }
        } catch (error) {
            logError(`safeClick: failed for "${label}"`, error);
            throw error;
        }
    });
}

/**
 * OPTIONAL (recommended): variant that doesn't require passing `page`
 * because it derives from the locator.
 *
 * Usage:
 *   await safeClick2(page.locator("..."), { description: "Save" });
 */
export async function safeClick2(
    target: Locator,
    options: SafeClickOptions = {},
): Promise<void> {
    // Locator has `.page()` in Playwright
    const page = (target as any).page?.() as Page | undefined;
    if (!page) {
        throw new Error("safeClick2: could not derive Page from Locator");
    }
    return safeClick(target, options, page);
}
