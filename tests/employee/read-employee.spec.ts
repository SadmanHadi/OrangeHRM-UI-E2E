import { test, expect } from '@playwright/test';
import { EmployeePage } from '../../src/pages/EmployeePage';
import { uniqueName } from '../../src/utils/timestamp';
import { createEmployee } from '../../src/setup/employee.setup';

test.describe('Employee - Read', () => {
  let firstName: string;

  test.beforeEach(async ({ page }) => {
    firstName = uniqueName('EmpRead_First');
    const lastName = uniqueName('EmpRead_Last');

    // Setup: Create the employee using the setup helper
    await createEmployee(page, firstName, lastName);
  });

  test('should find the newly created employee in the list with correct details', async ({
    page,
  }) => {
    const employeePage = new EmployeePage(page);

    // Ensure the employee is searchable (relying on POM stability)
    const exists = await employeePage.read(firstName);
    expect(exists).toBe(true);

    // Strong assertion: verify the table row is visible and contains expected name
    const row = page.locator('.oxd-table-card', { hasText: firstName });
    await expect(row).toBeVisible();
    await expect(row).toContainText(firstName);
  });
});
