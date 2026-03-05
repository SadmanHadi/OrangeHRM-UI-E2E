import { test, expect } from '@playwright/test';
import { ClaimPage } from '../../src/pages/ClaimPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createClaimWithEvent } from '../../src/setup/claim.setup';

test.describe('Claim (Self) - Update', () => {
  let eventName: string;
  let remarks: string;

  test.beforeEach(async ({ page }) => {
    eventName = uniqueName('ClaimEvt_Update');
    remarks = uniqueName('ClaimRem_UpdateOrig');

    // Setup: Create both event and claim
    await createClaimWithEvent(page, eventName, remarks);
  });

  test('should update claim status to Cancelled successfully', async ({ page }) => {
    const claimPage = new ClaimPage(page);
    await claimPage.update(eventName);

    // Navigate back to the claim list to verify the state change
    await claimPage.navigate();

    // Verify the status column for this specific claim row now says "Cancelled"
    const row = page.locator('.oxd-table-card').filter({ hasText: eventName });
    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText('Cancelled', { timeout: 10000 });
  });
});
