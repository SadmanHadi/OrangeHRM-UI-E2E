import { expect, type Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

export class LeaveTypePage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigate() {
        // Navigate directly to the Leave Types list
        await this.gotoAndWait(
            `${process.env.BASE_URL}/web/index.php/leave/leaveTypeList`,
        );

        // Wait for the table or Add button
        await this.page
            .locator(".oxd-table-body, .oxd-button--secondary")
            .first()
            .waitFor({ state: "visible", timeout: 15000 });
    }

    async create(name: string): Promise<void> {
        await this.navigate();

        await this.clickButtonByName("Add");

        // Wait for the Add form panel to mount
        await this.waitForForm(10000);

        // Target the exact Name input inside the form, click then fill (Vue binding)
        const formInput = this.getInputByLabel(/^Name$/);
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.fill(name);
        // Guard: verify Vue bound the value before submitting
        await expect(formInput).toHaveValue(name, { timeout: 10000 });

        await this.clickButtonByName("Save");
        await this.waitForToastSuccess();
    }

    async read(name: string): Promise<boolean> {
        await this.navigate();

        // The Leave Types list has no search bar. We just look for the row in the table directly.
        try {
            console.log(
                `[LeaveTypePage.read] Waiting for leave type row: ${name}`,
            );
            await this.waitForTableRowVisible(name, 5000);
            return true;
        } catch {
            console.log(
                `[LeaveTypePage.read] Timeout waiting for leave type row: ${name}`,
            );
            return false;
        }
    }

    async update(oldName: string, newName: string): Promise<void> {
        await this.navigate();

        // Find the row containing the old name directly in the table
        const row = this.getTableRowByText(oldName);
        await row.waitFor({ state: "visible", timeout: 10000 });

        // Click the Edit (pencil) button for that row
        await row
            .locator("button")
            .filter({ has: this.page.locator(".bi-pencil-fill") })
            .click();

        // Wait for the Edit form to mount
        await this.waitForForm(10000);

        const formInput = this.getInputByLabel(/^Name$/);
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        // Select all text using keyboard and type over it to trigger Vue updates properly
        await formInput.press("Control+a");
        await formInput.press("Backspace");
        await formInput.fill(newName);

        // Guard: verify Vue bound the value before submitting
        await expect(formInput).toHaveValue(newName, { timeout: 10000 });

        await this.clickButtonByName("Save");
        await this.waitForToastSuccess();
    }

    async delete(name: string): Promise<void> {
        await this.navigate();

        // Find the row containing the name directly in the table
        const row = this.getTableRowByText(name);

        // Skip cleanup if the row is not found
        try {
            await row.waitFor({ state: "visible", timeout: 5000 });
        } catch {
            console.log(
                `[cleanup] Leave type not found, skipping delete: ${name}`,
            );
            return;
        }

        // Click the Delete (trash) button for that row
        await row
            .locator("button")
            .filter({ has: this.page.locator(".bi-trash") })
            .click();

        // Confirm deletion in the dialog
        await this.page
            .locator(".oxd-button--label-danger", { hasText: "Yes, Delete" })
            .click();
        await this.waitForToastSuccess();
    }
}
