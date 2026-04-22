import { LeaveTypeActions } from "./actions/LeaveTypeActions";

/**
 * LeaveTypePage keeps page-object import stable while action logic stays modular.
 */
export class LeaveTypePage extends LeaveTypeActions {}
export { LeaveTypeLocators } from "./locators/LeaveTypeLocators";
