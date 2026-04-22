import { test, expect } from "@playwright/test";
import { LeaveTypePage } from "../../pages/leave-type/LeaveTypePage";
import { uniqueName } from "../../utils/timestamp";
import {
    createLeaveType,
    deleteLeaveType,
} from "../../setups/leave-type.setup";
import { expectTableRowVisible } from "../../utils/dashboard/table_assertions";

test.describe("Leave Type - Read", () => {
    let name: string;

    test.beforeEach(async ({ page }) => {
        name = uniqueName("LT_Read");
        // Setup: Create record
        await createLeaveType(page, name);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove record
        await deleteLeaveType(page, name);
    });

    test("should find the newly created leave type in the records table", async ({
        page,
    }) => {
        const leaveTypePage = new LeaveTypePage(page);

        const found = await leaveTypePage.read(name);
        expect(found).toBe(true);

        // Strong assertion: check specific table result
        await expectTableRowVisible(page, name);
    });
});
