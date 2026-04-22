import { expect, type Page } from "@playwright/test";
import { EmployeeLocators } from "../locators/EmployeeLocators";
import { getInputByLabel } from "../../../utils/common";
import { BasePage } from "../../login/base";

/**
 * Action methods for the Employee module.
 * Requirement: Inherits from BasePage.
 */
export class EmployeeActions extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${EmployeeLocators.employeeListUrl}`,
            { waitUntil: "domcontentloaded" },
        );
        await this.waitForSpinner();
    }

    private async waitForSpinner(): Promise<void> {
        const spinner = this.page.locator(EmployeeLocators.loadingSpinner);
        try {
            await spinner.waitFor({ state: "visible", timeout: 2000 });
            await spinner.waitFor({ state: "hidden", timeout: 30000 });
        } catch {
            // Spinner didn't appear or already hidden
        }
    }

    async search(name: string): Promise<void> {
        const searchInput = this.page
            .locator(EmployeeLocators.searchNameInput)
            .first();
        await searchInput.waitFor({ state: "visible", timeout: 15000 });
        await searchInput.click();
        await searchInput.fill(name);

        try {
            const option = this.page
                .locator(EmployeeLocators.autocompleteOption)
                .first();
            await option.waitFor({ state: "visible", timeout: 5000 });
            await option.click();
        } catch {
            // No hint dropdown
        }

        await this.page.locator(EmployeeLocators.searchButton).first().click();
        await this.waitForSpinner();
        await this.page
            .locator(".oxd-table-body")
            .waitFor({ state: "attached", timeout: 20000 });
    }

    async create(firstName: string, lastName: string): Promise<string> {
        await this.page.goto(
            `${process.env.BASE_URL}${EmployeeLocators.addEmployeeUrl}`,
        );
        const firstNameInput = this.page.locator(
            EmployeeLocators.firstNameInput,
        );
        await firstNameInput.waitFor({ state: "visible", timeout: 30000 });
        await firstNameInput.click();
        await firstNameInput.fill(firstName);

        const lastNameInput = this.page.locator(EmployeeLocators.lastNameInput);
        await lastNameInput.waitFor({ state: "visible", timeout: 30000 });
        await lastNameInput.click();
        await lastNameInput.fill(lastName);

        const idInput = getInputByLabel(this.page, {
            labelText: EmployeeLocators.employeeIdLabel,
        });
        const rnd = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0");
        const uniqueId = `E${Date.now().toString().slice(-6)}${rnd}`;
        await idInput.click();
        await idInput.clear();
        await idInput.fill(uniqueId);

        await expect(firstNameInput).toHaveValue(firstName, { timeout: 15000 });
        await expect(lastNameInput).toHaveValue(lastName, { timeout: 15000 });
        await expect(idInput).toHaveValue(uniqueId, { timeout: 15000 });

        const saveBtn = this.page
            .locator(EmployeeLocators.submitButton)
            .filter({ hasText: /Save/i })
            .first();
        await saveBtn.click();

        await this.page.waitForURL(/personalDetails|viewPersonalDetails/, {
            timeout: 60000,
        });

        try {
            const resolvedId = getInputByLabel(this.page, {
                labelText: EmployeeLocators.employeeIdLabel,
            });
            await resolvedId.waitFor({ state: "attached", timeout: 10000 });
            return await resolvedId.inputValue();
        } catch {
            return "";
        }
    }

    async read(firstName: string): Promise<boolean> {
        await this.page.goto(
            `${process.env.BASE_URL}${EmployeeLocators.employeeListUrl}`,
        );
        await this.waitForSpinner();
        await this.search(firstName);

        const row = this.page.locator(EmployeeLocators.tableCard, {
            hasText: firstName,
        });
        try {
            await expect
                .poll(async () => row.isVisible().catch(() => false), {
                    timeout: 20000,
                })
                .toBe(true);
            return true;
        } catch {
            return false;
        }
    }

    async update(firstName: string, newLastName: string): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${EmployeeLocators.employeeListUrl}`,
        );
        await this.waitForSpinner();
        await this.search(firstName);

        const row = this.page
            .locator(EmployeeLocators.tableCard, { hasText: firstName })
            .first();
        await row.waitFor({ state: "visible", timeout: 15000 });

        const editBtn = row
            .locator("button")
            .filter({ has: this.page.locator(EmployeeLocators.editIcon) })
            .first();
        await editBtn.click();

        const lastNameInput = this.page.locator(EmployeeLocators.lastNameInput);
        await lastNameInput.waitFor({ state: "visible", timeout: 15000 });
        await lastNameInput.click();
        await lastNameInput.clear();
        await lastNameInput.fill(newLastName);
        await expect(lastNameInput).toHaveValue(newLastName, {
            timeout: 15000,
        });

        const saveBtn = this.page
            .locator(EmployeeLocators.submitButton)
            .filter({ hasText: /Save/i })
            .first();
        await saveBtn.click();
        await this.page
            .locator(EmployeeLocators.successToast)
            .waitFor({ timeout: 25000 });
    }

    async delete(firstName: string): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}${EmployeeLocators.employeeListUrl}`,
        );
        await this.waitForSpinner();
        await this.search(firstName);

        const row = this.page
            .locator(EmployeeLocators.tableCard, { hasText: firstName })
            .first();
        try {
            await row.waitFor({ state: "visible", timeout: 20000 });
        } catch {
            return;
        }

        const deleteBtn = row
            .locator("button")
            .filter({ has: this.page.locator(EmployeeLocators.trashIcon) })
            .first();
        await deleteBtn.click();

        const confirmBtn = this.page.locator(
            EmployeeLocators.confirmDeleteButton,
            { hasText: EmployeeLocators.confirmDeleteText },
        );
        await confirmBtn.waitFor({ state: "visible", timeout: 10000 });
        await confirmBtn.click();
        await this.page
            .locator(EmployeeLocators.successToast)
            .waitFor({ timeout: 25000 });
        await this.waitForSpinner();
    }
}
