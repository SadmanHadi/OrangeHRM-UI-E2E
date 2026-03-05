import { test, expect } from '@playwright/test';
import { EventPage } from '../../src/pages/EventPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createEvent, deleteEvent } from '../../src/setup/event.setup';

test.describe('Event - Read', () => {
  let name: string;

  test.beforeEach(async ({ page }) => {
    name = uniqueName('EVT_Read');
    // Setup: Create record
    await createEvent(page, name);
  });

  test.afterEach(async ({ page }) => {
    // Cleanup: Remove record
    await deleteEvent(page, name);
  });

  test('should find the newly created event in the records table', async ({ page }) => {
    const eventPage = new EventPage(page);

    const found = await eventPage.read(name);
    expect(found).toBe(true);

    // Strong assertion: check specific table result
    await expect(page.locator('.oxd-table-card', { hasText: name })).toBeVisible();
  });
});
