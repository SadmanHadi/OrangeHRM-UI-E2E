import { type Locator, type Page } from "@playwright/test";
import { expectPollToBe, expectVisible } from "./expect_utils";

type WaitForRowOptions = {
    timeout?: number;
};

export async function waitForTableRowVisible(
    page: Page,
    text: string,
    options: WaitForRowOptions = {},
): Promise<void> {
    const timeout = options.timeout ?? 15000;
    const row = page.locator(".oxd-table-card", { hasText: text });
    await expectVisible(row, { timeout });
}

export async function waitForLocatorEnabled(
    locator: Locator,
    timeout = 15000,
): Promise<void> {
    await expectPollToBe(
        async () => await locator.isEnabled().catch(() => false),
        true,
        { timeout },
    );
}
