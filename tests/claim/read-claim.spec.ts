import { test, expect } from "@playwright/test";
import { ClaimPage } from "../../src/pages/claim/ClaimPage";
import { uniqueName } from "../../src/utils/timestamp";
import {
    createClaimWithEvent,
    deleteClaimAndEvent,
} from "../../src/setup/claim.setup";
import {
    expectTableRowContains,
    expectTableRowVisible,
} from "../../src/utils/dashboard/table_assertions";
import { expectVisible, getTableRowByText } from "../../src/utils/common";

test.describe("Claim (Self) - Read", () => {
    test.setTimeout(120000);

    let eventName: string;
    let remarks: string;

    test.beforeEach(async ({ page }) => {
        eventName = uniqueName("ClaimEvt_Read");
        remarks = uniqueName("ClaimRem_Read");

        // Setup: Create both event and claim
        await createClaimWithEvent(page, eventName, remarks);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove both claim and event dependencies using hybrid delete
        await deleteClaimAndEvent(page, eventName, remarks);
    });

    test("should find the newly created claim in the My Claims list and view details", async ({
        page,
    }) => {
        const claimPage = new ClaimPage(page);

        const found = await claimPage.read(eventName);
        expect(found).toBe(true);

        // Strong assertion: check specific row contents
        const row = getTableRowByText(page, eventName);
        await expectTableRowVisible(page, eventName);
        await expectTableRowContains(page, eventName, eventName);

        // View the details
        await row.getByRole("button").first().click();

        // Assure the details form successfully opens
        // eslint-disable-next-line playwright/no-raw-locators
        await expectVisible(page.locator(".oxd-form"), { timeout: 15000 });
    });
});
