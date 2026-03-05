import { test, expect } from '@playwright/test';
import { EventPage } from '../../src/pages/EventPage';
import { uniqueName } from '../../src/utils/timestamp';
import { deleteEvent } from '../../src/setup/event.setup';

test.describe('Event - Create', () => {
  let name: string;

  test.beforeEach(async () => {
    name = uniqueName('EVT_Create');
  });

  test.afterEach(async ({ page }) => {
    // Safe cleanup
    await deleteEvent(page, name);
  });

  test('should create an event successfully and verify it is readable', async ({ page }) => {
    const eventPage = new EventPage(page);

    await eventPage.create(name);

    // Strong assertion: verify it exists via the read method
    const found = await eventPage.read(name);
    expect(found).toBe(true);

    // Verify visibility in table
    await expect(page.locator('.oxd-table-card', { hasText: name })).toBeVisible();
  });
});
