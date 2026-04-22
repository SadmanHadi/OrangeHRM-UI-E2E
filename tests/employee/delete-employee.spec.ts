import { test, expect } from "@playwright/test";
import { EmployeePage } from "../../pages/employee/EmployeePage";
import { uniqueName } from "../../utils/timestamp";
import { createEmployee } from "../../setups/employee.setup";
import { expectTableRowHidden } from "../../utils/dashboard/table_assertions";

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
