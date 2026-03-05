import { test, expect } from '@playwright/test';
import { EmployeePage } from '../../src/pages/EmployeePage';
import { uniqueName } from '../../src/utils/timestamp';
import { deleteEmployee } from '../../src/setup/employee.setup';

/**
 * Bonus Test 2: Loop Test (1 to 10)
 * Demonstrates parameterized testing by iterating over multiple data sets.
 */

const iterations = Array.from({ length: 10 }, (_, i) => i + 1);

test.describe('Employee - Parameterized Loop (1 to 10)', () => {
  for (const number of iterations) {
    test(`Iteration ${number}: should create and cleanup employee successfully`, async ({
      page,
    }) => {
      const firstName = uniqueName(`LoopFirst_${number}`);
      const lastName = uniqueName(`LoopLast_${number}`);

      const employeePage = new EmployeePage(page);

      console.log(`[Loop Test] Starting iteration ${number} for: ${firstName}`);
      const empId = await employeePage.create(firstName, lastName);

      // Verify creation
      expect(empId).not.toBe('');
      await expect(page).toHaveURL(/viewPersonalDetails/);

      // Cleanup immediately to keep the test environment clean for the next iteration
      await deleteEmployee(page, firstName);

      // Verify deletion
      const exists = await employeePage.read(firstName);
      expect(exists).toBe(false);
    });
  }
});
