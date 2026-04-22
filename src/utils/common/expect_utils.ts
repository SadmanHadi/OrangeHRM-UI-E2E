import { expect, type Locator } from "@playwright/test";

type PollOptions = {
    timeout?: number;
    intervals?: number[];
    message?: string;
};

export async function expectPollToBe(
    fn: () => Promise<boolean> | boolean,
    expected: boolean,
    options: PollOptions = {},
): Promise<void> {
    await expect.poll(fn, options).toBe(expected);
}

export async function expectVisible(
    locator: Locator,
    options: { timeout?: number } = {},
): Promise<void> {
    await expect(locator).toBeVisible(options);
}

export async function expectHidden(
    locator: Locator,
    options: { timeout?: number } = {},
): Promise<void> {
    await expect(locator).toBeHidden(options);
}
