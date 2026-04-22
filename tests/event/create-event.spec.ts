import { test, expect } from "@playwright/test";
import { EventPage } from "../../pages/event/EventPage";
import { uniqueName } from "../../utils/timestamp";
import { createEvent, deleteEvent } from "../../setups/event.setup";
import { expectTableRowVisible } from "../../utils/dashboard/table_assertions";

test.describe("Event - Create", () => {
    let name: string;

    test.beforeEach(async () => {
        name = uniqueName("EVT_Create");
    });

    test.afterEach(async ({ page }) => {
        // Safe cleanup
        await deleteEvent(page, name);
    });

    test("should create an event successfully and verify it is readable", async ({
        page,
    }) => {
        const eventPage = new EventPage(page);

        await createEvent(page, name);

        // Strong assertion: verify it exists via the read method
        const found = await eventPage.read(name);
        expect(found).toBe(true);

        // Verify visibility in table
        await expectTableRowVisible(page, name);
    });
});
