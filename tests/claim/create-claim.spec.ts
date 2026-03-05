import { test, expect } from '@playwright/test';
import { ClaimPage } from '../../src/pages/ClaimPage';
import { EventPage } from '../../src/pages/EventPage';
import { uniqueName } from '../../src/utils/timestamp';
import { deleteClaimAndEvent } from '../../src/setup/claim.setup';

test.describe('Claim (Self) - Create', () => {
  test.setTimeout(120000);

  let eventName: string;
  let remarks: string;

  test.beforeEach(async ({ page }) => {
    eventName = uniqueName('ClaimEvt_Create');
    remarks = uniqueName('ClaimRem_Create');

    // Manual setup for Event to keep Claim atomic
    const eventPage = new EventPage(page);
    await eventPage.create(eventName);
  });
 
  test.afterEach(async ({ page }) => {
    // Cleanup: Remove both claim and event
    await deleteClaimAndEvent(page, eventName);
  });

  test('should successfully create a self-claim with mandatory event', async ({ page }) => {
    const claimPage = new ClaimPage(page);
    await claimPage.create(eventName, remarks);

    // Finalize the claim immediately by clicking the second submit button on the details page
    const finalSubmitBtn = page.locator('button').filter({ hasText: 'Submit' }).first();
    await finalSubmitBtn.waitFor({ state: 'visible', timeout: 15000 });
    await finalSubmitBtn.click();
    await page.locator('.oxd-toast--success').waitFor({ timeout: 15000 });
    // Strong assertion: Verify record exists
    const found = await claimPage.read(eventName);
    expect(found).toBe(true);

    // Verify specifically in the table card
    await expect(page.locator('.oxd-table-card', { hasText: eventName })).toBeVisible();
  });
});
