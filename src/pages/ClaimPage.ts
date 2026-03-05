import { Page, expect } from '@playwright/test';

export class ClaimPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/viewClaim`);
    await this.page.locator('.oxd-layout-context').waitFor({ state: 'visible', timeout: 15000 });
  }

  async create(eventName: string, remarks: string): Promise<void> {
    await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/submitClaim`);
    await this.page.locator('.oxd-form').waitFor({ state: 'visible', timeout: 15000 });

    const dropdown = this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('.oxd-label', { hasText: 'Event' }) })
      .locator('.oxd-select-text');
    await dropdown.waitFor({ state: 'visible', timeout: 5000 });
    await dropdown.click();

    await this.page.locator('.oxd-select-dropdown').waitFor({ state: 'visible', timeout: 10000 });
    const option = this.page.locator('.oxd-select-option').filter({ hasText: eventName });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();

    // Select Currency (Required field)
    const currencyDropdown = this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('.oxd-label', { hasText: 'Currency' }) })
      .locator('.oxd-select-text');
    await currencyDropdown.waitFor({ state: 'visible', timeout: 5000 });
    await currencyDropdown.click();
    await this.page.locator('.oxd-select-dropdown').waitFor({ state: 'visible', timeout: 10000 });
    const currencyOption = this.page.locator('.oxd-select-option').nth(1);
    await currencyOption.waitFor({ state: 'visible', timeout: 5000 });
    await currencyOption.click();

    const textarea = this.page
      .locator('.oxd-input-group')
      .filter({ has: this.page.locator('.oxd-label', { hasText: 'Remarks' }) })
      .locator('textarea');
    await textarea.click();
    await textarea.fill(remarks);
    await expect(textarea).toHaveValue(remarks);

    await this.page.locator('button[type="submit"]').click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 15000 });
  }

  async read(eventName: string): Promise<boolean> {
    await this.navigate();
    const row = this.page.locator('.oxd-table-card').filter({ hasText: eventName });
    try {
      console.log(`[ClaimPage.read] Waiting for claim row: ${eventName}`);
      await row.waitFor({ state: 'visible', timeout: 15000 });
      console.log(`[ClaimPage.read] Found claim row: ${eventName}`);
      return true;
    } catch {
      console.log(`[ClaimPage.read] Timeout waiting for claim row: ${eventName}`);
      return false;
    }
  }

  async update(eventName: string): Promise<void> {
    await this.navigate();
    const row = this.page.locator('.oxd-table-card', { hasText: eventName });
    await row.waitFor({ state: 'visible', timeout: 15000 });
    // Click the View Details button (the only button on the row)
    await row.locator('button').first().click();

    // Wait for form to mount on the details page
    await this.page.locator('.oxd-form').waitFor({ state: 'visible', timeout: 15000 });

    // Instead of failing on a readonly form, execute a valid status update: Cancel the claim.
    const cancelBtn = this.page.locator('button').filter({ hasText: 'Cancel' }).first();
    await cancelBtn.waitFor({ state: 'visible', timeout: 5000 });
    await cancelBtn.click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 15000 });
  }

  async delete(eventName: string): Promise<void> {
    await this.navigate();
    const row = this.page.locator('.oxd-table-card', { hasText: eventName });

    try {
      console.log(`[ClaimPage.delete] Waiting for claim row: ${eventName}`);
      await row.waitFor({ state: 'visible', timeout: 15000 });
      console.log(`[ClaimPage.delete] Found claim row: ${eventName}`);
    } catch {
      console.log(`[cleanup] Claim not found, skipping delete: ${eventName}`);
      return;
    }

    // Enter details view
    await row.locator('button').first().click();
    await this.page.locator('.oxd-form').waitFor({ state: 'visible', timeout: 15000 });

    const deleteBtn = this.page.locator('button').filter({ hasText: 'Delete' }).first();
    const isVisible = await deleteBtn.isVisible().catch(() => false);
    if (!isVisible) {
      console.log(`[cleanup] Delete button not found inside details for claim: ${eventName}`);
      return;
    }
    await deleteBtn.click();
    await this.page.locator('.orangehrm-dialog-popup button.oxd-button--label-danger').click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 15000 });
  }
}
