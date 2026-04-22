import { type Locator, type Page } from "@playwright/test";

type InputByLabelOptions = {
    labelText: string | RegExp;
};

export function getInputByLabel(
    page: Page,
    options: InputByLabelOptions,
): Locator {
    return page
        .locator("label", { hasText: options.labelText })
        .locator("..")
        .locator("..")
        .locator("input");
}

export function getTextareaByLabel(
    page: Page,
    options: InputByLabelOptions,
): Locator {
    return page
        .locator("label", { hasText: options.labelText })
        .locator("..")
        .locator("..")
        .locator("textarea");
}

export function getTableRowByText(page: Page, text: string): Locator {
    return page.locator(".oxd-table-card", { hasText: text });
}
