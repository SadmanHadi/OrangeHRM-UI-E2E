import { test, expect } from "@playwright/test";
import { ClaimPage } from "../../src/pages/claim/ClaimPage";
import { uniqueName } from "../../src/utils/timestamp";
import {
    createClaimWithEvent,
    deleteClaimAndEvent,
} from "../../src/setup/claim.setup";
import { expectTableRowVisible } from "../../src/utils/dashboard/table_assertions";

test.describe("Claim (Self) - Create", () => {
    test.setTimeout(120000);

    let eventName: string;
    let remarks: string;

    test.beforeEach(async () => {
        eventName = uniqueName("ClaimEvt_Create");
        remarks = uniqueName("ClaimRem_Create");
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove both claim and event using hybrid delete
        await deleteClaimAndEvent(page, eventName, remarks);
    });

    test("should successfully create a self-claim with mandatory event", async ({
        page,
    }) => {
        const claimPage = new ClaimPage(page);
        await createClaimWithEvent(page, eventName, remarks);

        // Finalize the claim immediately by clicking the second submit button on the details page
        const finalSubmitBtn = page
            .getByRole("button", { name: "Submit" })
            .first();
        await finalSubmitBtn.waitFor({ state: "visible", timeout: 15000 });
        await finalSubmitBtn.click();
        // eslint-disable-next-line playwright/no-raw-locators
        await page.locator(".oxd-toast--success").waitFor({ timeout: 15000 });
        // Strong assertion: Verify record exists
        const found = await claimPage.read(eventName);
        expect(found).toBe(true);

        // Verify specifically in the table card
        await expectTableRowVisible(page, eventName);
    });
});
