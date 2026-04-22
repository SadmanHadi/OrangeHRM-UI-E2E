import { expect, type Page } from "@playwright/test";
import { getTableRowByText } from "../common";

type RowOptions = {
    timeout?: number;
};

export async function expectTableRowVisible(
    page: Page,
    text: string,
    options: RowOptions = {},
): Promise<void> {
    await expect(getTableRowByText(page, text)).toBeVisible(options);
}

export async function expectTableRowHidden(
    page: Page,
    text: string,
    options: RowOptions = {},
): Promise<void> {
    await expect(getTableRowByText(page, text)).toBeHidden(options);
}

export async function expectTableRowContains(
    page: Page,
    text: string,
    expected: string,
    options: RowOptions = {},
): Promise<void> {
    await expect(getTableRowByText(page, text)).toContainText(
        expected,
        options,
    );
}
