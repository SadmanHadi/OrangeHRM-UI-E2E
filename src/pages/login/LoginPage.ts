import { type Page } from "@playwright/test";
import { BasePage } from "../base/BasePage";
import { loginSelectors } from "../../utils/login/login_selectors";

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<void> {
        const baseUrl = process.env.BASE_URL ?? "";
        const loginUrl = new URL(
            "/web/index.php/auth/login",
            baseUrl,
        ).toString();

        await this.page.goto(loginUrl, {
            waitUntil: "domcontentloaded",
            timeout: 30000,
        });

        const usernameField = this.page.getByPlaceholder(
            loginSelectors.usernamePlaceholder,
        );

        try {
            await usernameField.waitFor({ state: "visible", timeout: 15000 });
        } catch {
            if (/dashboard/i.test(this.page.url())) {
                return;
            }
            throw new Error(
                `Login page did not load at ${loginUrl}; current URL is ${this.page.url()}`,
            );
        }
    }

    async login(username: string, password: string): Promise<void> {
        await this.goto();

        if (/dashboard/i.test(this.page.url())) {
            return;
        }

        const usernameField = this.page.getByPlaceholder(
            loginSelectors.usernamePlaceholder,
        );
        const passwordField = this.page.getByPlaceholder(
            loginSelectors.passwordPlaceholder,
        );
        const loginButton = this.page.getByRole("button", {
            name: loginSelectors.loginButtonName,
        });

        await usernameField.fill(username);
        await passwordField.fill(password);

        await Promise.all([
            this.page.waitForURL(/dashboard/i, { timeout: 60000 }),
            loginButton.click(),
        ]).catch(async () => {
            await this.page
                .waitForLoadState("domcontentloaded", {
                    timeout: 15000,
                })
                .catch(() => {});
        });

        if (!/dashboard/i.test(this.page.url())) {
            throw new Error(
                `Login did not reach the dashboard. Current URL: ${this.page.url()}`,
            );
        }
    }
}
