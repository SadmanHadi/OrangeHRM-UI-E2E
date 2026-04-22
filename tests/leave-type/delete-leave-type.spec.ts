import { test, expect } from "@playwright/test";
import { LeaveTypePage } from "../../src/pages/dashboard/LeaveTypePage";
import { uniqueName } from "../../src/utils/timestamp";
import { createLeaveType } from "../../src/setup/leave-type.setup";
import { expectTableRowHidden } from "../../src/utils/dashboard/table_assertions";

test.describe("Leave Type - Delete", () => {
    let name: string;

    test.beforeEach(async ({ page }) => {
        name = uniqueName("LT_Delete");
        // Setup: Create record
        await createLeaveType(page, name);
    });

    test("should delete leave type successfully and verify its removal", async ({
        page,
    }) => {
        const leaveTypePage = new LeaveTypePage(page);

        // Action: Delete
        await leaveTypePage.delete(name);

        // Assertion: Verify removal
        const found = await leaveTypePage.read(name);
        expect(found).toBe(false);
        await expectTableRowHidden(page, name);
    });
});
