import { test } from "@playwright/test";
import { ClaimPage } from "../../src/pages/dashboard/ClaimPage";
import { uniqueName } from "../../src/utils/timestamp";
import {
    createClaimWithEvent,
    deleteClaimAndEvent,
} from "../../src/setup/claim.setup";
import {
    expectTableRowContains,
    expectTableRowVisible,
} from "../../src/utils/dashboard/table_assertions";

test.describe("Claim (Self) - Update", () => {
    test.setTimeout(120000);
    let eventName: string;
    let remarks: string;

    test.beforeEach(async ({ page }) => {
        eventName = uniqueName("ClaimEvt_Update");
        remarks = uniqueName("ClaimRem_UpdateOrig");

        // Setup: Create both event and claim
        await createClaimWithEvent(page, eventName, remarks);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove both dependencies
        await deleteClaimAndEvent(page, eventName);
    });

    test("should update claim status to Cancelled successfully", async ({
        page,
    }) => {
        const claimPage = new ClaimPage(page);
        await claimPage.update(eventName);

        // Navigate back to the claim list to verify the state change
        await claimPage.navigate();

        // Verify the status column for this specific claim row now says "Cancelled"
        await expectTableRowVisible(page, eventName, { timeout: 15000 });
        await expectTableRowContains(page, eventName, "Cancelled", {
            timeout: 10000,
        });
    });
});
