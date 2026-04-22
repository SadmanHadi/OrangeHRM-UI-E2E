import { type Page, type Response } from "@playwright/test";

type WaitForResponseOptions = {
    status?: number;
    timeout?: number;
};

export async function waitForResponseContaining(
    page: Page,
    urlPart: string | RegExp,
    options: WaitForResponseOptions = {},
): Promise<Response> {
    const status = options.status ?? 200;
    return await page.waitForResponse(
        (response) => {
            const url = response.url();
            const urlMatches =
                typeof urlPart === "string"
                    ? url.includes(urlPart)
                    : urlPart.test(url);
            return urlMatches && response.status() === status;
        },
        { timeout: options.timeout ?? 15000 },
    );
}
