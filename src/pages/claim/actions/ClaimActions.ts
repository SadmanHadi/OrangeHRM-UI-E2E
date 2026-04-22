import { expect, type Page } from "@playwright/test";
import { ClaimLocators } from "../locators/ClaimLocators";
import { getInputByLabel, getTextareaByLabel } from "../../../utils/common";

/**
 * Action methods for the Claim (Self) module.
 * Includes: create, read, update, delete, cancel, viewDetails
 */
export class ClaimActions {
    constructor(private readonly page: Page) {}

    private async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${ClaimLocators.viewClaimUrl}`,
            { waitUntil: "domcontentloaded" },
        );
        await this.page.locator(".oxd-layout-context").waitFor({ state: "visible", timeout: 30000 });
    }

    async create(eventName: string, remarks: string): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${ClaimLocators.submitClaimUrl}`,
            { waitUntil: "domcontentloaded" },
        );
        await this.page.locator(".oxd-form").waitFor({ state: "visible", timeout: 15000 });

        // Select Event from dropdown
        const eventGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", { hasText: ClaimLocators.eventLabel }),
        });
        const eventDropdown = eventGroup.locator(".oxd-select-text");
        await eventDropdown.click();
        await this.page.locator(".oxd-select-dropdown").getByText(eventName).click();

        // Select Currency (first available)
        const currencyGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", { hasText: ClaimLocators.currencyLabel }),
        });
        const currencyDropdown = currencyGroup.locator(".oxd-select-text");
        await currencyDropdown.click();
        await this.page.locator(".oxd-select-option").nth(1).click();

        // Fill Remarks
        const textarea = getTextareaByLabel(this.page, { labelText: ClaimLocators.remarksLabel });
        await textarea.click();
        await textarea.fill(remarks);
        await expect(textarea).toHaveValue(remarks);

        await this.page.locator(ClaimLocators.submitButton).click();
        await expect(this.page.locator(ClaimLocators.successToast)).toBeVisible({ timeout: 15000 });
    }

    async read(eventName: string): Promise<boolean> {
        await this.navigate();
        const row = this.page.locator(ClaimLocators.tableCard, { hasText: eventName });
        try {
            await expect
                .poll(async () => row.isVisible().catch(() => false), { timeout: 15000 })
                .toBe(true);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Update: Cancels an Initiated claim (the only allowed state change by employee).
     */
    async update(eventName: string): Promise<void> {
        await this.navigate();
        const row = this.page.locator(ClaimLocators.tableCard, { hasText: eventName });
        await row.waitFor({ state: "visible", timeout: 15000 });
        await row.locator("button").first().click();

        await this.page.locator(".oxd-form").waitFor({ state: "visible", timeout: 15000 });

        const cancelBtn = this.page
            .locator("button")
            .filter({ hasText: ClaimLocators.cancelButton })
            .first();
        await cancelBtn.waitFor({ state: "visible", timeout: 5000 });
        await cancelBtn.click();
        await expect(this.page.locator(ClaimLocators.successToast)).toBeVisible({ timeout: 15000 });
    }

    /**
     * Cancel: Explicitly cancel an Initiated claim from the details view.
     */
    async cancel(eventName: string): Promise<void> {
        await this.update(eventName);
    }

    /**
     * View Details: Navigate into a claim's detail page and return the page URL.
     */
    async viewDetails(eventName: string): Promise<string> {
        await this.navigate();
        const row = this.page.locator(ClaimLocators.tableCard, { hasText: eventName });
        await row.waitFor({ state: "visible", timeout: 15000 });
        await row.locator("button").filter({ hasText: ClaimLocators.viewDetailsButton }).click();
        await this.page.locator(".oxd-form").waitFor({ state: "visible", timeout: 15000 });
        return this.page.url();
    }

    /**
     * Delete: Multi-strategy deletion for OrangeHRM 5.8.1.
     * Tries details-view Delete/Discard button first, then logs if unavailable.
     */
    async delete(eventName: string): Promise<void> {
        await this.navigate();

        // Search to isolate the record
        const eventGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", { hasText: ClaimLocators.eventNameLabel }),
        });
        const input = eventGroup.locator(".oxd-select-text, input").first();
        await input.click();

        const dropdown = this.page.locator(".oxd-select-dropdown");
        if (await dropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
            await dropdown.getByText(eventName).click();
        } else {
            await input.fill(eventName);
        }
        await this.page.getByRole("button", { name: "Search" }).click();
        await this.page.waitForLoadState("networkidle");

        const row = this.page.locator(ClaimLocators.tableCard, { hasText: eventName });
        try {
            await row.waitFor({ state: "visible", timeout: 15000 });
        } catch {
            console.log(`[cleanup] Claim not found, skipping delete: ${eventName}`);
            return;
        }

        // Enter details view
        await row.locator("button").first().click();
        await this.page.locator(".oxd-form").waitFor({ state: "visible", timeout: 15000 });

        const deleteBtn = this.page
            .locator("button")
            .filter({ hasText: ClaimLocators.deleteButton })
            .first();

        if (await deleteBtn.isVisible().catch(() => false)) {
            await deleteBtn.click();
            const confirmBtn = this.page.locator(ClaimLocators.confirmDeleteButton, {
                hasText: /Yes/i,
            });
            if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmBtn.click();
            }
            await expect(this.page.locator(ClaimLocators.successToast))
                .toBeVisible({ timeout: 15000 })
                .catch(() => {});
        } else {
            console.warn(
                `[ClaimActions.delete] No Delete/Discard button available for: ${eventName}. Status may not allow deletion.`,
            );
        }
    }
}
