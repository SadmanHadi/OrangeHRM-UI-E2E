import { test, expect } from "@playwright/test";
import { ClaimPage } from "../../src/pages/claim/ClaimPage";
import { uniqueName } from "../../src/utils/timestamp";
import {
    createClaimWithEvent,
    deleteClaimAndEvent,
} from "../../src/setup/claim.setup";
import { expectTableRowHidden } from "../../src/utils/dashboard/table_assertions";

test.describe("Claim (Self) - Delete", () => {
    test.setTimeout(120000);

    let eventName: string;
    let remarks: string;

    test.beforeEach(async ({ page }) => {
        eventName = uniqueName("ClaimEvt_Delete");
        remarks = uniqueName("ClaimRem_Delete");

        // Setup: Create event and claim
        await createClaimWithEvent(page, eventName, remarks);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove both dependencies from DB where possible
        await deleteClaimAndEvent(page, eventName, remarks);
    });

    test("should delete claim successfully", async ({ page }) => {
        const claimPage = new ClaimPage(page);
        // Pass eventName for UI navigation and remarks for DB deletion fallback
        await claimPage.delete(eventName, remarks);

        const exists = await claimPage.read(eventName);
        await expectTableRowHidden(page, eventName);
        expect(exists).toBe(false);
    });
});
