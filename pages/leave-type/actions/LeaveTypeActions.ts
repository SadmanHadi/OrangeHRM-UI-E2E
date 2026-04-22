import { expect, type Page } from "@playwright/test";
import { LeaveTypeLocators } from "../locators/LeaveTypeLocators";
import { getInputByLabel } from "../../../utils/common";
import { BasePage } from "../../login/base";

/**
 * Action methods for the Leave Type module.
 * Requirement: Inherits from BasePage.
 */
export class LeaveTypeActions extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${LeaveTypeLocators.leaveTypeListUrl}`,
            { waitUntil: "domcontentloaded" },
        );
        await this.page
            .getByRole("button", { name: LeaveTypeLocators.addButton })
            .waitFor({ state: "visible", timeout: 30000 });
    }

    async create(name: string): Promise<void> {
        await this.navigate();
        await this.page
            .getByRole("button", { name: LeaveTypeLocators.addButton })
            .click();
        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 10000 });

        const formInput = getInputByLabel(this.page, { labelText: LeaveTypeLocators.leaveTypeNameLabel });
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.fill(name);
        await expect(formInput).toHaveValue(name, { timeout: 10000 });

        await this.page
            .getByRole("button", { name: LeaveTypeLocators.saveButton })
            .click();
        const toast = this.page.locator(LeaveTypeLocators.successToast);
        await expect(toast).toBeVisible({ timeout: 15000 });
    }

    async read(name: string): Promise<boolean> {
        await this.navigate();
        const row = this.page.locator(LeaveTypeLocators.tableCard, {
            hasText: name,
        });
        try {
            await expect
                .poll(async () => row.isVisible().catch(() => false), {
                    timeout: 5000,
                })
                .toBe(true);
            return true;
        } catch {
            return false;
        }
    }

    async update(oldName: string, newName: string): Promise<void> {
        await this.navigate();
        const row = this.page.locator(LeaveTypeLocators.tableCard, {
            hasText: oldName,
        });
        await row.waitFor({ state: "visible", timeout: 10000 });

        await row
            .locator("button")
            .filter({ has: this.page.locator(LeaveTypeLocators.editIcon) })
            .click();

        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 10000 });

        const formInput = getInputByLabel(this.page, { labelText: LeaveTypeLocators.leaveTypeNameLabel });
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.press("Control+a");
        await formInput.press("Backspace");
        await formInput.fill(newName);
        await expect(formInput).toHaveValue(newName, { timeout: 10000 });

        await this.page
            .getByRole("button", { name: LeaveTypeLocators.saveButton })
            .click();
        const toast = this.page.locator(LeaveTypeLocators.successToast);
        await expect(toast).toBeVisible({ timeout: 15000 });
    }

    async delete(name: string): Promise<void> {
        await this.navigate();
        const row = this.page.locator(LeaveTypeLocators.tableCard, {
            hasText: name,
        });
        try {
            await row.waitFor({ state: "visible", timeout: 5000 });
        } catch {
            console.log(
                `[cleanup] Leave type not found, skipping delete: ${name}`,
            );
            return;
        }

        await row
            .locator("button")
            .filter({ has: this.page.locator(LeaveTypeLocators.trashIcon) })
            .click();

        await this.page
            .locator(LeaveTypeLocators.confirmDeleteButton, {
                hasText: LeaveTypeLocators.confirmDeleteText,
            })
            .click();

        const toast = this.page.locator(LeaveTypeLocators.successToast);
        await expect(toast).toBeVisible({ timeout: 15000 });
    }
}
