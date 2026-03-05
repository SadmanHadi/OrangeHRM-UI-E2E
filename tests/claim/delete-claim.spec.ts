import { test } from '@playwright/test';
import { ClaimPage } from '../../src/pages/ClaimPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createClaimWithEvent, deleteClaimAndEvent } from '../../src/setup/claim.setup';

test.describe('Claim (Self) - Delete', () => {
  test.setTimeout(120000);

  let eventName: string;
  let remarks: string;

  test.beforeEach(async ({ page }) => {
    eventName = uniqueName('ClaimEvt_Delete');
    remarks = uniqueName('ClaimRem_Delete');

    // Setup: Create event and claim
    await createClaimWithEvent(page, eventName, remarks);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Remove both dependencies from DB where possible
    await deleteClaimAndEvent(page, eventName);
  });

  test('should delete claim successfully', async ({ page }) => {
    const claimPage = new ClaimPage(page);
    await claimPage.delete(eventName);
  });
});
