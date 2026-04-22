import { Page } from "@playwright/test";
import { EmployeePage } from "../pages/dashboard/EmployeePage";

/**
 * Project-specific setup helper to create an employee.
 * Uses the EmployeePage POM.
 */
export async function createEmployee(
    page: Page,
    firstName: string,
    lastName: string,
): Promise<void> {
    const employeePage = new EmployeePage(page);
    await employeePage.create(firstName, lastName);
}

/**
 * Project-specific cleanup helper to delete an employee.
 * Uses the EmployeePage POM.
 */
export async function deleteEmployee(
    page: Page,
    firstName: string,
): Promise<void> {
    const employeePage = new EmployeePage(page);
    await employeePage.delete(firstName);
}
