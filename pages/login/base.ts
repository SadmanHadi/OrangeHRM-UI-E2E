import { expect, type Locator, type Page } from "@playwright/test";
import { getInputByLabel, getTextareaByLabel } from "../../utils/common";

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async gotoAndWait(url: string): Promise<void> {
        await this.page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
        });
        await this.waitForLayout();
    }

    protected async waitForLayout(timeout = 30000): Promise<void> {
        await this.page
            .locator(".oxd-layout-context")
            .waitFor({ state: "visible", timeout });
    }

    protected async waitForForm(timeout = 15000): Promise<void> {
        await this.page.locator(".oxd-form").waitFor({
            state: "visible",
            timeout,
        });
    }

    protected async waitForToastSuccess(timeout = 15000): Promise<void> {
        const toast = this.page.locator(".oxd-toast--success");
        await expect(toast).toBeVisible({ timeout });
        await toast.waitFor({ state: "hidden", timeout }).catch(() => {});
    }

    protected getTableRowByText(text: string): Locator {
        return this.page.locator(".oxd-table-card", { hasText: text });
    }

    protected async waitForTableRowVisible(
        text: string,
        timeout = 15000,
    ): Promise<void> {
        await expect
            .poll(
                async () =>
                    await this.getTableRowByText(text)
                        .isVisible()
                        .catch(() => false),
                { timeout },
            )
            .toBe(true);
    }

    protected getInputByLabel(labelText: string | RegExp): Locator {
        return getInputByLabel(this.page, { labelText });
    }

    protected getTextareaByLabel(labelText: string | RegExp): Locator {
        return getTextareaByLabel(this.page, { labelText });
    }

    protected async clickButtonByName(name: string | RegExp): Promise<void> {
        await this.page.getByRole("button", { name }).click();
    }

    protected async selectDropdownByLabel(
        labelText: string | RegExp,
        option: string | RegExp | number,
    ): Promise<void> {
        const dropdown = this.page
            .locator(".oxd-input-group")
            .filter({
                has: this.page.locator(".oxd-label", { hasText: labelText }),
            })
            .locator(".oxd-select-text");
        await dropdown.waitFor({ state: "visible", timeout: 5000 });
        await dropdown.click();

        await this.page
            .locator(".oxd-select-dropdown")
            .waitFor({ state: "visible", timeout: 10000 });

        const options = this.page.locator(".oxd-select-option");
        const choice =
            typeof option === "number"
                ? options.nth(option)
                : options.filter({ hasText: option });
        await choice.first().waitFor({ state: "visible", timeout: 5000 });
        await choice.first().click();
    }
}
