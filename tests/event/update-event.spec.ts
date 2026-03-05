import { test, expect } from '@playwright/test';
import { EventPage } from '../../src/pages/EventPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createEvent, deleteEvent } from '../../src/setup/event.setup';

test.describe('Event - Update', () => {
  let name: string;
  let updatedName: string;

  test.beforeEach(async ({ page }) => {
    name = uniqueName('EVT_UpdateOrig');
    updatedName = uniqueName('EVT_UpdateNew');
    // Setup: Create record
    await createEvent(page, name);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Remove record (using the updated name)
    await deleteEvent(page, updatedName);
  });

  test('should update event name successfully and verify the change', async ({ page }) => {
    const eventPage = new EventPage(page);

    // Action: Update
    await eventPage.update(name, updatedName);

    // Assertion: Verify new name exists
    const found = await eventPage.read(updatedName);
    expect(found).toBe(true);
    await expect(page.locator('.oxd-table-card', { hasText: updatedName })).toBeVisible();

    // Verify old name is gone
    const oldFound = await eventPage.read(name);
    expect(oldFound).toBe(false);
  });
});
