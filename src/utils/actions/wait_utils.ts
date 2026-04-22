import { test, type Page } from "@playwright/test";
import { logStep } from "src/utils/logging/logger";

type WaitForStabilityOptions = {
    /** How long the DOM must remain unchanged to be considered "stable" */
    domQuietMs?: number;

    /** Texts that must NOT be visible */
    busyTextPatterns?: RegExp[];

    /** CSS selectors (spinners/overlays) that must be hidden */
    busySelectors?: string[];

    /** Skip networkidle if the app has polling/websockets that never go idle */
    skipNetworkIdle?: boolean;
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

export async function waitForPageStability(
    page: Page,
    options: WaitForStabilityOptions = {},
): Promise<void> {
    const domQuietMs = options.domQuietMs ?? 500;

    const busyTextPatterns = options.busyTextPatterns ?? [
        /loading/i,
        /please\s*wait/i,
        /processing/i,
        /saving/i,
        /creating/i,
        /updating/i,
    ];

    const busySelectors = options.busySelectors ?? [
        // Common "busy" markers / overlays (edit for the app)
        "[aria-busy='true']",
        ".loading",
        ".loader",
        ".spinner",
        ".busy",
        ".overlay",
        "[data-testid*='loading']",
        "[data-test*='loading']",
    ];

    await boxedStep("Wait: domcontentloaded", async () => {
        logStep("Wait: domcontentloaded");
        await page.waitForLoadState("domcontentloaded");
    });

    if (!options.skipNetworkIdle) {
        await boxedStep("Wait: network idle", async () => {
            logStep("Wait: network idle");
            // eslint-disable-next-line playwright/no-networkidle
            await page.waitForLoadState("networkidle");
        });
    }

    await boxedStep("Wait: busy selectors hidden", async () => {
        for (const selector of busySelectors) {
            await page.locator(selector).first().waitFor({ state: "hidden" });
        }
    });

    await boxedStep("Wait: busy texts hidden", async () => {
        for (const re of busyTextPatterns) {
            await page.getByText(re).first().waitFor({ state: "hidden" });
        }
    });

    await boxedStep(`Wait: DOM stable (quiet ${domQuietMs}ms)`, async () => {
        logStep(`Wait: DOM stable (quiet ${domQuietMs}ms)`);
        await page.evaluate((quietMs) => {
            return new Promise<void>((resolve) => {
                let timer: number | undefined;

                const done = (observer: MutationObserver) => {
                    if (timer) {
                        window.clearTimeout(timer);
                    }
                    observer.disconnect();
                    resolve();
                };

                const observer = new MutationObserver(() => {
                    if (timer) {
                        window.clearTimeout(timer);
                    }
                    timer = window.setTimeout(() => done(observer), quietMs);
                });

                observer.observe(document.documentElement, {
                    subtree: true,
                    childList: true,
                    attributes: true,
                    characterData: true,
                });

                // If nothing changes at all, resolve after quietMs
                timer = window.setTimeout(() => done(observer), quietMs);
            });
        }, domQuietMs);
    });
}
