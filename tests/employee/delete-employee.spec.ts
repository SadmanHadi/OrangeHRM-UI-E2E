import { test, expect } from "@playwright/test";
import { EmployeePage } from "../../src/pages/dashboard/EmployeePage";
import { uniqueName } from "../../src/utils/timestamp";
import { createEmployee } from "../../src/setup/employee.setup";
import { expectTableRowHidden } from "../../src/utils/dashboard/table_assertions";

test.describe("Employee - Delete", () => {
    let firstName: string;
    let lastName: string;

    test.beforeEach(async ({ page }) => {
        firstName = uniqueName("EmpDelete_First");
        lastName = uniqueName("EmpDelete_Last");

        // Setup: Create the employee
        await createEmployee(page, firstName, lastName);
    });

    test("should delete employee successfully and verify record absence", async ({
        page,
    }) => {
        const employeePage = new EmployeePage(page);

        // Action: Delete the employee
        await employeePage.delete(firstName);

        // Assertion: Verify the record is no longer found
        const exists = await employeePage.read(firstName);
        expect(exists).toBe(false);

        // Verify row is not visible in the table results
        await expectTableRowHidden(page, firstName);
    });
});
