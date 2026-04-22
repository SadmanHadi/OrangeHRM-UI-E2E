import { expect, type Page } from "@playwright/test";
import { ClaimLocators } from "../locators/ClaimLocators";
import { BasePage } from "../../login/base";
import { getTextareaByLabel } from "../../../utils/common";

/**
 * Action methods for the Claim (Self) module.
 * Includes: create, read, cancel, delete, viewDetails
 */
export class ClaimActions extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${ClaimLocators.viewClaimUrl}`,
            { waitUntil: "load" },
        );
        await this.page
            .locator(".oxd-layout-context")
            .waitFor({ state: "visible", timeout: 30000 });
    }

    async create(eventName: string, remarks: string): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${ClaimLocators.submitClaimUrl}`,
            { waitUntil: "domcontentloaded" },
        );
        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 15000 });

        const eventGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", {
                hasText: ClaimLocators.eventLabel,
            }),
        });
        const eventDropdown = eventGroup.locator(".oxd-select-text");
        await eventDropdown.click();
        await this.page
            .locator(".oxd-select-dropdown")
            .getByText(eventName)
            .click();

        const currencyGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", {
                hasText: ClaimLocators.currencyLabel,
            }),
        });
        const currencyDropdown = currencyGroup.locator(".oxd-select-text");
        await currencyDropdown.click();
        await this.page.locator(".oxd-select-option").nth(1).click();

        const textarea = getTextareaByLabel(this.page, {
            labelText: ClaimLocators.remarksLabel,
        });
        await textarea.click();
        await textarea.fill(remarks);
        await expect(textarea).toHaveValue(remarks);

        await this.page.locator(ClaimLocators.submitButton).click();
        await expect(this.page.locator(ClaimLocators.successToast)).toBeVisible(
            {
                timeout: 15000,
            },
        );
    }

    async read(eventName: string): Promise<boolean> {
        await this.navigate();
        const row = this.page.locator(ClaimLocators.tableCard, {
            hasText: eventName,
        });
        try {
            await expect
                .poll(async () => row.isVisible().catch(() => false), {
                    timeout: 15000,
                })
                .toBe(true);
            return true;
        } catch {
            return false;
        }
    }

    private async openClaimDetails(eventName: string): Promise<void> {
        await this.navigate();
        const row = this.page.locator(ClaimLocators.tableCard, {
            hasText: eventName,
        });
        await row.waitFor({ state: "visible", timeout: 15000 });
        await row.locator("button").first().click();
        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 15000 });
    }

    async cancel(eventName: string): Promise<void> {
        await this.openClaimDetails(eventName);

        const cancelBtn = this.page
            .locator("button")
            .filter({ hasText: ClaimLocators.cancelButton })
            .first();
        await cancelBtn.waitFor({ state: "visible", timeout: 5000 });
        await cancelBtn.click();
        await expect(this.page.locator(ClaimLocators.successToast)).toBeVisible(
            {
                timeout: 15000,
            },
        );
    }

    async update(eventName: string): Promise<void> {
        // In Claim (Self) context, "update" is often synonymous with status change (Cancellation)
        return this.cancel(eventName);
    }

    async viewDetails(eventName: string): Promise<string> {
        await this.openClaimDetails(eventName);
        return this.page.url();
    }

    async delete(eventName: string, remarks?: string): Promise<void> {
        await this.navigate();

        const eventGroup = this.page.locator(ClaimLocators.inputGroup, {
            has: this.page.locator("label", {
                hasText: ClaimLocators.eventNameLabel,
            }),
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
        await this.page
            .locator(".oxd-table-body")
            .waitFor({ state: "attached", timeout: 15000 });

        const row = this.page.locator(ClaimLocators.tableCard, {
            hasText: eventName,
        });
        try {
            await row.waitFor({ state: "visible", timeout: 15000 });
        } catch {
            console.log(
                `[cleanup] Claim not found, skipping delete: ${eventName}`,
            );
            return;
        }

        await row.locator("button").first().click();
        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 15000 });

        const deleteBtn = this.page
            .locator("button")
            .filter({ hasText: ClaimLocators.deleteButton })
            .first();

        if (await deleteBtn.isVisible().catch(() => false)) {
            await deleteBtn.click();
            const confirmBtn = this.page.locator(
                ClaimLocators.confirmDeleteButton,
                {
                    hasText: /Yes/i,
                },
            );
            if (
                await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)
            ) {
                await confirmBtn.click();
            }
            try {
                await expect(
                    this.page.locator(ClaimLocators.successToast),
                ).toBeVisible({ timeout: 15000 });
            } catch {
                // Ignore toast timeout
            }
        } else {
            console.warn(
                `[ClaimActions.delete] UI Delete button missing in 5.8.1. Falling back to database deletion for: ${remarks || eventName}`,
            );
            const {
                DatabaseUtils,
            } = require("../../../utils/common/database_utils");
            await DatabaseUtils.deleteClaimByName(remarks || eventName);

            await this.navigate();
        }
    }
}
