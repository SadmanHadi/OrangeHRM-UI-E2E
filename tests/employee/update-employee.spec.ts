import { test, expect } from "@playwright/test";
import { EmployeePage } from "../../src/pages/employee/EmployeePage";
import { uniqueName } from "../../src/utils/timestamp";
import { createEmployee, deleteEmployee } from "../../src/setup/employee.setup";
import { expectVisible, getTableRowByText } from "../../src/utils/common";

test.describe("Employee - Update", () => {
    let firstName: string;
    let lastName: string;
    let updatedLastName: string;

    test.beforeEach(async ({ page }) => {
        firstName = uniqueName("EmpUpdate_First");
        lastName = uniqueName("EmpUpdate_Last");
        updatedLastName = uniqueName("EmpUpdate_NewLast");

        // Setup: Create the employee
        await createEmployee(page, firstName, lastName);
    });

    test.afterEach(async ({ page }) => {
        // Cleanup: Remove the employee
        await deleteEmployee(page, firstName);
    });

    test("should update employee last name successfully and verify change", async ({
        page,
    }) => {
        const employeePage = new EmployeePage(page);

        // Action: Update the last name using robust UI navigation
        await employeePage.update(firstName, updatedLastName);

        // Assertion: Navigate back to the list and re-open to verify
        await employeePage.navigate();
        await employeePage.search(firstName);

        const row = getTableRowByText(page, firstName);
        await row.first().waitFor({ state: "visible", timeout: 30000 });

        // Re-verify by clicking edit again
        // eslint-disable-next-line playwright/no-raw-locators
        const editBtn = row
            .locator("button")
            // eslint-disable-next-line playwright/no-raw-locators
            .filter({ has: page.locator(".bi-pencil-fill") })
            .first();
        await editBtn.click();

        // eslint-disable-next-line playwright/no-raw-locators
        const lastNameInput = page.locator("input[name='lastName']");
        await expectVisible(lastNameInput, { timeout: 20000 });
        await page.waitForLoadState("domcontentloaded");

        // Extended timeout for value verification under load
        await expect(lastNameInput).toHaveValue(updatedLastName, {
            timeout: 20000,
        });
    });
});
