import { test, expect } from '@playwright/test';
import { EventPage } from '../../src/pages/EventPage';
import { uniqueName } from '../../src/utils/timestamp';
import { createEvent } from '../../src/setup/event.setup';

test.describe('Event - Delete', () => {
  let name: string;

  test.beforeEach(async ({ page }) => {
    name = uniqueName('EVT_Delete');
    // Setup: Create record
    await createEvent(page, name);
  });

  test('should delete event successfully and verify its removal', async ({ page }) => {
    const eventPage = new EventPage(page);

    // Action: Delete
    await eventPage.delete(name);

    // Assertion: Verify removal
    const found = await eventPage.read(name);
    expect(found).toBe(false);
    await expect(page.locator('.oxd-table-card', { hasText: name })).toBeHidden();
  });
});
