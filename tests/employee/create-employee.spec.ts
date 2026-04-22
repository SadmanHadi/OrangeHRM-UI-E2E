import { test, expect } from "@playwright/test";
import { EmployeePage } from "../../src/pages/employee/EmployeePage";
import { uniqueName } from "../../src/utils/timestamp";
import { createEmployee, deleteEmployee } from "../../src/setup/employee.setup";

test.describe("Employee - Create", () => {
    test.setTimeout(120000); // 2 minutes for slow environment
    let firstName: string;
    let lastName: string;

    test.beforeEach(async () => {
        firstName = uniqueName("EmpCreate_First");
        lastName = uniqueName("EmpCreate_Last");
    });

    test.afterEach(async ({ page }) => {
        // Safe cleanup: delete the employee regardless of test success
        await deleteEmployee(page, firstName);
    });

    test("should create a new employee and redirect to personal details", async ({
        page,
    }) => {
        const employeePage = new EmployeePage(page);

        await createEmployee(page, firstName, lastName);

        // Strong assertions on the profile page immediately after creation
        await expect(page).toHaveURL(/personalDetails|viewPersonalDetails/);
        // eslint-disable-next-line playwright/no-raw-locators
        await expect(page.locator("input[name='firstName']")).toHaveValue(
            firstName,
            {
                timeout: 15000,
            },
        );
        // eslint-disable-next-line playwright/no-raw-locators
        await expect(page.locator("input[name='lastName']")).toHaveValue(
            lastName,
            { timeout: 15000 },
        );

        // Verify it appears in the employee list
        const found = await employeePage.read(firstName);
        expect(found).toBe(true);
    });
});
