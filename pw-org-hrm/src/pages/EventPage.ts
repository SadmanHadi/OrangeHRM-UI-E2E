import { Page, expect } from '@playwright/test';

export class EventPage {
  constructor(private page: Page) {}

  async navigate() {
    // Navigate to the main Claim section first (which loads the topbar with Configuration menu)
    await this.page.goto(`${process.env.BASE_URL}/web/index.php/claim/viewAssignClaim`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await this.page.locator('.oxd-layout-context').waitFor({ state: 'visible', timeout: 30000 });

    // Open the Configuration dropdown in the topbar
    const configureTab = this.page.locator('.oxd-topbar-body-nav-tab', {
      hasText: 'Configuration',
    });
    await configureTab.waitFor({ state: 'visible', timeout: 15000 });
    await configureTab.click();

    // Click the Events option in the dropdown
    const eventsLink = this.page.locator('.oxd-dropdown-menu a', {
      hasText: 'Events',
    });
    await eventsLink.waitFor({ state: 'visible', timeout: 5000 });
    await eventsLink.click();

    // Wait for the Events list layout to load
    await this.page.locator('.oxd-layout-context').waitFor({ state: 'visible', timeout: 30000 });
    // Wait for the table or Add button to be ready
    await this.page
      .locator('.oxd-table-body, .oxd-button--secondary')
      .first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }

  async create(name: string): Promise<void> {
    await this.navigate();

    await this.page.getByRole('button', { name: 'Add' }).click();

    // Wait for the Add form panel to mount
    await this.page.locator('.oxd-form').waitFor({ state: 'visible', timeout: 10000 });

    // Target the Event Name input inside the form, click then fill (Vue binding)
    const formInput = this.page
      .locator('label', { hasText: 'Event Name' })
      .locator('..')
      .locator('..')
      .locator('input');
    await formInput.waitFor({ state: 'visible', timeout: 5000 });
    await formInput.click();
    await formInput.fill(name);
    // Guard: verify Vue bound the value before submitting
    await expect(formInput).toHaveValue(name);

    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 15000 });
  }

  async read(name: string): Promise<boolean> {
    await this.navigate();

    // Actively search for the item to bypass pagination issues
    const searchInput = this.page
      .locator('label', { hasText: 'Event Name' })
      .locator('..')
      .locator('..')
      .locator('input');
    await searchInput.fill(name);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('domcontentloaded');

    const row = this.page.locator('.oxd-table-card').filter({ hasText: name });
    try {
      console.log(`[EventPage.read] Waiting for event row: ${name}`);
      await row.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      console.log(`[EventPage.read] Timeout waiting for event row: ${name}`);
      return false;
    }
  }

  async update(oldName: string, newName: string): Promise<void> {
    await this.navigate();

    // Search to isolate the specific record
    const searchInput = this.page
      .locator('label', { hasText: 'Event Name' })
      .locator('..')
      .locator('..')
      .locator('input');
    await searchInput.fill(oldName);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('domcontentloaded');

    const row = this.page.locator('.oxd-table-card').filter({ hasText: oldName });
    await row.waitFor({ state: 'visible', timeout: 10000 });
    // Click the Edit button
    await row
      .locator('button')
      .filter({ has: this.page.locator('.bi-pencil-fill') })
      .click();

    // Wait for edit form to mount
    await this.page.locator('.oxd-form').waitFor({ state: 'visible', timeout: 10000 });

    const formInput = this.page
      .locator('label', { hasText: 'Event Name' })
      .locator('..')
      .locator('..')
      .locator('input');
    await formInput.waitFor({ state: 'visible', timeout: 5000 });
    await formInput.click();
    await formInput.clear();
    await formInput.fill(newName);
    await expect(formInput).toHaveValue(newName);

    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 10000 });
  }

  async delete(name: string): Promise<void> {
    await this.navigate();

    // Search to isolate the target record
    const searchInput = this.page
      .locator('label', { hasText: 'Event Name' })
      .locator('..')
      .locator('..')
      .locator('input');
    await searchInput.fill(name);
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('domcontentloaded');

    const row = this.page.locator('.oxd-table-card').filter({ hasText: name });

    // Skip cleanup if event not found
    try {
      await row.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      console.log(`[cleanup] Event not found, skipping delete: ${name}`);
      return;
    }

    // Click the Delete button
    await row
      .locator('button')
      .filter({ has: this.page.locator('.bi-trash') })
      .click();
    await this.page.locator('.oxd-button--label-danger', { hasText: 'Yes, Delete' }).click();
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 10000 });
  }
}
