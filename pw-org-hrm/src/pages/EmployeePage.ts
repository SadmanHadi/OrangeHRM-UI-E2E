import { Page, expect } from '@playwright/test';

export class EmployeePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto(`${process.env.BASE_URL}/web/index.php/pim/viewEmployeeList`);
    await this.page.waitForLoadState('domcontentloaded');
    await this.waitForSpinner();
  }

  private async waitForSpinner() {
    // OrangeHRM loading spinner
    const spinner = this.page.locator('.oxd-loading-spinner');
    try {
      // Wait up to 2s for it to appear (handles server lag)
      await spinner.waitFor({ state: 'visible', timeout: 2000 });
      // Wait up to 30s for it to disappear
      await spinner.waitFor({ state: 'hidden', timeout: 30000 });
    } catch {
      // Spinner didn't appear in time or already hidden
    }
  }

  async search(name: string) {
    const searchNameInput = this.page.locator('input[placeholder="Type for hints..."]').first();
    await searchNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await searchNameInput.click();
    await searchNameInput.fill(name);

    // Give the hints results a moment to potentially appear and then click Search
    await this.page.waitForTimeout(500);
    await this.page.locator('button[type="submit"]').first().click();

    // Wait a beat for the server to start the search/show spinner
    await this.page.waitForTimeout(1000);
    await this.waitForSpinner();

    // Ensure the table group is ready (relaxed visibility)
    await this.page.locator('.oxd-table-body').waitFor({ state: 'attached', timeout: 20000 });
    // Final settlement wait
    await this.page.waitForTimeout(2000);
  }

  async create(firstName: string, lastName: string): Promise<string> {
    await this.page.goto(`${process.env.BASE_URL}/web/index.php/pim/addEmployee`);
    // Wait for Vue form to mount, then click before fill to fire Vue focus events
    const firstNameInput = this.page.locator('input[name="firstName"]');
    await firstNameInput.waitFor({ state: 'visible', timeout: 30000 });

    console.log(`[EmployeePage.create] Filling form for ${firstName} ${lastName}`);
    await firstNameInput.click();
    await firstNameInput.fill(firstName);

    const lastNameInput = this.page.locator('input[name="lastName"]');
    await lastNameInput.waitFor({ state: 'visible', timeout: 30000 });
    await lastNameInput.click();
    await lastNameInput.fill(lastName);

    // Manually fill a unique Employee ID to avoid server-side collision under parallel load
    const idInput = this.page
      .locator('.oxd-input-group', {
        has: this.page.locator('.oxd-label').filter({ hasText: /Employee Id/i }),
      })
      .locator('input');
    const rnd = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const uniqueId = `E${Date.now().toString().slice(-6)}${rnd}`;
    console.log(
      `[EmployeePage.create] Manually setting unique ID: ${uniqueId} (Length: ${uniqueId.length})`
    );
    await idInput.click();
    await idInput.clear();
    await idInput.fill(uniqueId);

    // Verify Vue actually bound the values (with extra patience for high load)
    console.log(`[EmployeePage.create] Verifying Vue binding...`);
    await expect(firstNameInput).toHaveValue(firstName, { timeout: 15000 });
    await expect(lastNameInput).toHaveValue(lastName, { timeout: 15000 });
    await expect(idInput).toHaveValue(uniqueId, { timeout: 15000 });

    console.log(`[EmployeePage.create] Submitting Add Employee form...`);
    // Use a more specific button for the Add Employee form
    const saveBtn = this.page.locator('button[type="submit"]').filter({ hasText: /Save/i }).first();
    await saveBtn.click();

    // Relaxed URL check with diagnostic error check
    try {
      await this.page.waitForURL(/personalDetails|viewPersonalDetails/, { timeout: 60000 });
    } catch (e) {
      console.error(`[EmployeePage.create] Error: Navigation to personalDetails timed out.`);
      // Check for validation errors on the page
      const errorMsg = await this.page
        .locator('.oxd-input-field-error-message, .oxd-toast--error')
        .first()
        .innerText()
        .catch(() => 'No specific error found');
      console.error(`[EmployeePage.create] Diagnostic Error Check: ${errorMsg}`);
      throw e;
    }

    // Optional ID extraction: Wait for the network to settle and try a bit harder
    try {
      const idInput = this.page
        .locator('.oxd-input-group', {
          has: this.page.locator('.oxd-label').filter({ hasText: /Employee Id/i }),
        })
        .locator('input');
      // Wait for the input to have a non-empty value (Vue binding delay)
      // We avoid 'expect' here because it fails the test on timeout even if caught
      await idInput.waitFor({ state: 'attached', timeout: 10000 });
      await this.page
        .waitForFunction(
          (el) => (el as HTMLInputElement).value !== '',
          await idInput.elementHandle(),
          { timeout: 15000 }
        )
        .catch(() => {});

      return await idInput.inputValue();
    } catch {
      console.log('[EmployeePage.create] Warning: Could not extract ID, returning empty string.');
      return '';
    }
  }

  async read(firstName: string): Promise<boolean> {
    await this.navigate();
    await this.search(firstName);

    const row = this.page.locator('.oxd-table-card').filter({ hasText: firstName });
    try {
      console.log(`[EmployeePage.read] Waiting for employee row: ${firstName}`);
      await row.first().waitFor({ state: 'visible', timeout: 20000 });
      return true;
    } catch {
      console.log(`[EmployeePage.read] Timeout/Not found: ${firstName}`);
      return false;
    }
  }

  async update(firstName: string, newLastName: string): Promise<void> {
    await this.navigate();
    await this.search(firstName);

    const row = this.page.locator('.oxd-table-card').filter({ hasText: firstName });
    await row.first().waitFor({ state: 'visible', timeout: 15000 });

    // Click the Edit button (pencil icon)
    const editBtn = row
      .locator('button')
      .filter({ has: this.page.locator('.bi-pencil-fill') })
      .first();
    await editBtn.click();

    const lastNameInput = this.page.locator('input[name="lastName"]');
    await lastNameInput.waitFor({ state: 'visible', timeout: 15000 });
    await lastNameInput.click();
    await lastNameInput.clear();
    await lastNameInput.fill(newLastName);

    // Verify Vue bound the change
    console.log(`[EmployeePage.update] Verifying update binding...`);
    await expect(lastNameInput).toHaveValue(newLastName, { timeout: 15000 });

    // Target the specific "Personal Details" save button
    const saveBtn = this.page.locator('button[type="submit"]').filter({ hasText: /Save/i }).first();
    console.log(`[EmployeePage.update] Clicking Save...`);
    await saveBtn.click();

    // Wait for success toast and allow a beat for DB persistence
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 25000 });
    await this.page.waitForTimeout(2000);
  }

  async delete(firstName: string): Promise<void> {
    await this.navigate();
    await this.search(firstName);

    const row = this.page.locator('.oxd-table-card').filter({ hasText: firstName });

    try {
      await row.first().waitFor({ state: 'visible', timeout: 20000 });
    } catch {
      console.log(
        `[EmployeePage.delete] Employee not found in list, skipping delete: ${firstName}`
      );
      return;
    }

    const deleteBtn = row
      .locator('button')
      .filter({ has: this.page.locator('.bi-trash') })
      .first();
    await deleteBtn.click();

    // Explicit wait for confirmation dialog
    const confirmBtn = this.page.locator('.oxd-button--label-danger', { hasText: 'Yes, Delete' });
    await confirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await confirmBtn.click();

    // Wait for success toast and spinner to clear
    await this.page.locator('.oxd-toast--success').waitFor({ timeout: 25000 });
    await this.waitForSpinner();
  }
}
