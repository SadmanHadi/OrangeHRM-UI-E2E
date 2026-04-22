import { EmployeeActions } from "./actions/EmployeeActions";

/**
 * EmployeePage keeps page-object import stable while action logic stays modular.
 */
export class EmployeePage extends EmployeeActions {}
export { EmployeeLocators } from "./locators/EmployeeLocators";
