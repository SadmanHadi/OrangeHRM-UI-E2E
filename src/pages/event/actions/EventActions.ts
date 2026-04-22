import { expect, type Page } from "@playwright/test";
import { EventLocators } from "../locators/EventLocators";
import { getInputByLabel } from "../../../utils/common";
import { BasePage } from "../../login/base";

/**
 * Action methods for the Event module.
 * Requirement: Inherits from BasePage.
 */
export class EventActions extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    public async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}/web/index.php/claim/viewAssignClaim`,
            { waitUntil: "domcontentloaded" },
        );
        await this.page
            .locator(".oxd-layout-context")
            .waitFor({ state: "visible", timeout: 30000 });

        const configureTab = this.page.locator(EventLocators.topbarNavTab, {
            hasText: EventLocators.configurationTab,
        });
        await configureTab.waitFor({ state: "visible", timeout: 15000 });
        await configureTab.click();

        const eventsLink = this.page.locator(`.oxd-dropdown-menu a`, {
            hasText: EventLocators.eventsLink,
        });
        await eventsLink.waitFor({ state: "visible", timeout: 5000 });
        await eventsLink.click();

        await this.page
            .locator(".oxd-layout-context")
            .waitFor({ state: "visible", timeout: 30000 });
        await this.page
            .locator(
                `${EventLocators.tableBody}, ${EventLocators.secondaryButton}`,
            )
            .first()
            .waitFor({ state: "visible", timeout: 15000 });
    }

    private async searchByName(name: string): Promise<void> {
        const searchInput = getInputByLabel(this.page, {
            labelText: EventLocators.eventNameLabel,
        });
        await searchInput.fill(name);
        await this.page
            .getByRole("button", { name: EventLocators.searchButton })
            .click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async create(name: string): Promise<void> {
        await this.navigate();
        await this.page
            .getByRole("button", { name: EventLocators.addButton })
            .click();
        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 10000 });

        const formInput = getInputByLabel(this.page, {
            labelText: EventLocators.eventNameLabel,
        });
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.fill(name);
        await expect(formInput).toHaveValue(name);

        await this.page
            .getByRole("button", { name: EventLocators.saveButton })
            .click();
        await expect(this.page.locator(EventLocators.successToast)).toBeVisible(
            { timeout: 15000 },
        );
    }

    async read(name: string): Promise<boolean> {
        await this.navigate();
        await this.searchByName(name);
        const row = this.page.locator(EventLocators.tableCard, {
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
        await this.searchByName(oldName);

        const row = this.page.locator(EventLocators.tableCard, {
            hasText: oldName,
        });
        await row.waitFor({ state: "visible", timeout: 10000 });

        await row
            .locator("button")
            .filter({ has: this.page.locator(EventLocators.editIcon) })
            .click();

        await this.page
            .locator(".oxd-form")
            .waitFor({ state: "visible", timeout: 10000 });

        const formInput = getInputByLabel(this.page, {
            labelText: EventLocators.eventNameLabel,
        });
        await formInput.waitFor({ state: "visible", timeout: 5000 });
        await formInput.click();
        await formInput.clear();
        await formInput.fill(newName);
        await expect(formInput).toHaveValue(newName);

        await this.page
            .getByRole("button", { name: EventLocators.saveButton })
            .click();
        await expect(this.page.locator(EventLocators.successToast)).toBeVisible(
            { timeout: 15000 },
        );
    }

    async delete(name: string): Promise<void> {
        await this.navigate();
        await this.searchByName(name);

        const row = this.page.locator(EventLocators.tableCard, {
            hasText: name,
        });
        try {
            await row.waitFor({ state: "visible", timeout: 5000 });
        } catch {
            console.log(`[cleanup] Event not found, skipping delete: ${name}`);
            return;
        }

        await row
            .locator("button")
            .filter({ has: this.page.locator(EventLocators.trashIcon) })
            .click();

        await this.page
            .locator(EventLocators.confirmDeleteButton, {
                hasText: EventLocators.confirmDeleteText,
            })
            .click();
        await expect(this.page.locator(EventLocators.successToast)).toBeVisible(
            { timeout: 15000 },
        );
    }
}
