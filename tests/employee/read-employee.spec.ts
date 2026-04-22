import { test, expect } from "@playwright/test";
import { EmployeePage } from "../../src/pages/dashboard/EmployeePage";
import { uniqueName } from "../../src/utils/timestamp";
import { createEmployee, deleteEmployee } from "../../src/setup/employee.setup";
import {
    expectTableRowContains,
    expectTableRowVisible,
} from "../../src/utils/dashboard/table_assertions";

test.describe("Employee - Read", () => {
    let firstName: string;

    test.beforeEach(async ({ page }) => {
        firstName = uniqueName("EmpRead_First");
        const lastName = uniqueName("EmpRead_Last");

        // Setup: Create the employee using the setup helper
        await createEmployee(page, firstName, lastName);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove the employee
        await deleteEmployee(page, firstName);
    });

    test("should find the newly created employee in the list with correct details", async ({
        page,
    }) => {
        const employeePage = new EmployeePage(page);

        // Ensure the employee is searchable (relying on POM stability)
        const exists = await employeePage.read(firstName);
        expect(exists).toBe(true);

        // Strong assertion: verify the table row is visible and contains expected name
        await expectTableRowVisible(page, firstName);
        await expectTableRowContains(page, firstName, firstName);
    });
});
