import { test, expect } from '@playwright/test';
import { ClaimPage } from '../../src/pages/ClaimPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createClaimWithEvent } from '../../src/setup/claim.setup';

test.describe('Claim (Self) - Read', () => {
  test.setTimeout(120000);

  let eventName: string;
  let remarks: string;

  test.beforeEach(async ({ page }) => {
    eventName = uniqueName('ClaimEvt_Read');
    remarks = uniqueName('ClaimRem_Read');

    // Setup: Create both event and claim
    await createClaimWithEvent(page, eventName, remarks);
  });

  // test.afterEach(async ({ page }) => {
  //   // Cleanup disabled per user request
  //   // await deleteClaimAndEvent(page, eventName);
  // });

  test('should find the newly created claim in the My Claims list and view details', async ({
    page,
  }) => {
    const claimPage = new ClaimPage(page);

    const found = await claimPage.read(eventName);
    expect(found).toBe(true);

    // Strong assertion: check specific row contents
    const row = page.locator('.oxd-table-card', { hasText: eventName });
    await expect(row).toBeVisible();
    await expect(row).toContainText(eventName);

    // View the details
    await row.locator('button').first().click();

    // Assure the details form successfully opens
    await expect(page.locator('.oxd-form')).toBeVisible({ timeout: 15000 });
  });
});
