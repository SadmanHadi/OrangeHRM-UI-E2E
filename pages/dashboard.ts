import { type Page } from "@playwright/test";
import { BasePage } from "./login/base";

/**
 * DashboardPage: Repesents the main landing page after login.
 * Requirement: "where there will be dashboard.ts"
 */
export class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isVisible(): Promise<boolean> {
        return /dashboard/i.test(this.page.url());
    }

    async navigate(): Promise<void> {
        await this.page.goto(
            `${process.env.BASE_URL}/web/index.php/dashboard/index`,
        );
    }
}
