import { expect, type Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";

export class EventPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private async searchByName(name: string): Promise<void> {
        const searchInput = this.getInputByLabel("Event Name");
        await searchInput.fill(name);
        await this.clickButtonByName("Search");
        await this.page.waitForLoadState("domcontentloaded");
    }

    async navigate() {
        // Navigate to the main Claim section first (which loads the topbar with Configuration menu)
        await this.gotoAndWait(
            `${process.env.BASE_URL}/web/index.php/claim/viewAssignClaim`,
        );

        // Open the Configuration dropdown in the topbar
        const configureTab = this.page.locator(".oxd-topbar-body-nav-tab", {
            hasText: "Configuration",
        });
        await configureTab.waitFor({ state: "visible", timeout: 15000 });
        await configureTab.click();

        // Click the Events option in the dropdown
        const eventsLink = this.page.locator(".oxd-dropdown-menu a", {
            hasText: "Events",
        });
        await eventsLink.waitFor({ state: "visible", timeout: 5000 });
        await eventsLink.click();

        // Wait for the Events list layout to load
        await this.waitForLayout();
        // Wait for the table or Add button to be ready
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

        // Target the Event Name input inside the form, click then fill (Vue binding)
        const formInput = this.getInputByLabel("Event Name");
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.fill(name);
        // Guard: verify Vue bound the value before submitting
        await expect(formInput).toHaveValue(name);

        await this.clickButtonByName("Save");
        await this.waitForToastSuccess();
    }

    async read(name: string): Promise<boolean> {
        await this.navigate();

        // Actively search for the item to bypass pagination issues
        await this.searchByName(name);

        try {
            console.log(`[EventPage.read] Waiting for event row: ${name}`);
            await this.waitForTableRowVisible(name, 5000);
            return true;
        } catch {
            console.log(
                `[EventPage.read] Timeout waiting for event row: ${name}`,
            );
            return false;
        }
    }

    async update(oldName: string, newName: string): Promise<void> {
        await this.navigate();

        // Search to isolate the specific record
        await this.searchByName(oldName);

        const row = this.getTableRowByText(oldName);
        await row.waitFor({ state: "visible", timeout: 10000 });
        // Click the Edit button
        await row
            .locator("button")
            .filter({ has: this.page.locator(".bi-pencil-fill") })
            .click();

        // Wait for edit form to mount
        await this.waitForForm(10000);

        const formInput = this.getInputByLabel("Event Name");
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.clear();
        await formInput.fill(newName);
        await expect(formInput).toHaveValue(newName);

        await this.clickButtonByName("Save");
        await this.waitForToastSuccess(10000);
    }

    async delete(name: string): Promise<void> {
        await this.navigate();

        // Search to isolate the target record
        await this.searchByName(name);

        const row = this.getTableRowByText(name);

        // Skip cleanup if event not found
        try {
            await row.waitFor({ state: "visible", timeout: 5000 });
        } catch {
            console.log(`[cleanup] Event not found, skipping delete: ${name}`);
            return;
        }

        // Click the Delete button
        await row
            .locator("button")
            .filter({ has: this.page.locator(".bi-trash") })
            .click();
        await this.page
            .locator(".oxd-button--label-danger", { hasText: "Yes, Delete" })
            .click();
        await this.waitForToastSuccess(10000);
    }
}
