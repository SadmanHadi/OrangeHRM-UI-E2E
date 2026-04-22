import { test, expect } from "@playwright/test";
import { LeaveTypePage } from "../../src/pages/leave-type/LeaveTypePage";
import { uniqueName } from "../../src/utils/timestamp";
import {
    createLeaveType,
    deleteLeaveType,
} from "../../src/setup/leave-type.setup";
import { expectTableRowVisible } from "../../src/utils/dashboard/table_assertions";

test.describe("Leave Type - Create", () => {
    let name: string;

    test.beforeEach(async () => {
        name = uniqueName("LT_Create");
    });

    test.afterEach(async ({ page }) => {
        // Safe cleanup
        await deleteLeaveType(page, name);
    });

    test("should create a leave type successfully and verify it in the list", async ({
        page,
    }) => {
        const leaveTypePage = new LeaveTypePage(page);

        await createLeaveType(page, name);

        // Strong assertion: verify it exists via the read method
        const found = await leaveTypePage.read(name);
        expect(found).toBe(true);

        // Verify visibility in table
        await expectTableRowVisible(page, name);
    });
});
