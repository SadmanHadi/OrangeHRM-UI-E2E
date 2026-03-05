import { test, expect } from '@playwright/test';
import { LeaveTypePage } from '../../src/pages/LeaveTypePage';
import { uniqueName } from '../../src/utils/timestamp';
import { createLeaveType, deleteLeaveType } from '../../src/setup/leave-type.setup';

test.describe('Leave Type - Update', () => {
  let name: string;
  let updatedName: string;

  test.beforeEach(async ({ page }) => {
    name = uniqueName('LT_UpdateOrig');
    updatedName = uniqueName('LT_UpdateNew');
    // Setup: Create record
    await createLeaveType(page, name);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Remove record (using the updated name)
    await deleteLeaveType(page, updatedName);
  });

  test('should update leave type name successfully and verify the change', async ({ page }) => {
    const leaveTypePage = new LeaveTypePage(page);

    // Action: Update
    await leaveTypePage.update(name, updatedName);

    // Assertion: Verify new name exists
    const found = await leaveTypePage.read(updatedName);
    expect(found).toBe(true);
    await expect(page.locator('.oxd-table-card', { hasText: updatedName })).toBeVisible();

    // Verify old name is gone
    const oldFound = await leaveTypePage.read(name);
    expect(oldFound).toBe(false);
  });
});
