import { test, expect } from '@playwright/test';
import { EmployeePage } from '../../src/pages/EmployeePage';
import { uniqueName } from '../../src/utils/timestamp';
import { deleteEmployee } from '../../src/setup/employee.setup';

/**
 * Bonus Test 1: Dynamic ID Test
 * Demonstrates generating unique identifiers for data entities to prevent collisions.
 */
test.describe('Employee - Dynamic ID Identification', () => {
  let dynamicFirstName: string;
  let dynamicLastName: string;

  test.beforeEach(async () => {
    // Generates unique names like: "DynamicFirst_1690000000000_1234"
    dynamicFirstName = uniqueName('DynamicFirst');
    dynamicLastName = uniqueName('DynamicLast');
  });

  test.afterEach(async ({ page }) => {
    // Cleanup the dynamically created user
    await deleteEmployee(page, dynamicFirstName);
  });

  test('should successfully create an employee with unique timestamped credentials', async ({
    page,
  }) => {
    const employeePage = new EmployeePage(page);

    console.log(`Creating Employee with dynamic name: ${dynamicFirstName}`);
    const empId = await employeePage.create(dynamicFirstName, dynamicLastName);

    // Strong assertions on the resulting record
    expect(empId).not.toBe('');
    await expect(page).toHaveURL(/viewPersonalDetails/);

    // Verify the specific dynamic data is present
    await expect(page.locator('input[name="firstName"]')).toHaveValue(dynamicFirstName);
  });
});
