/**
 * Locators for the Leave Type module (Admin > Leave > Leave Types)
 */
export const LeaveTypeLocators = {
    // Navigation
    leaveTypeListUrl: "/web/index.php/leave/leaveTypeList",
    addLeaveTypeUrl: "/web/index.php/leave/saveLeaveType",

    // Form
    leaveTypeNameLabel: /^Name$/,
    addButton: "Add",
    saveButton: "Save",
    searchButton: "Search",
    resetButton: "Reset",

    // List
    tableCard: ".oxd-table-card",
    editIcon: ".bi-pencil-fill",
    trashIcon: ".bi-trash",

    // Toasts & Dialogs
    successToast: ".oxd-toast--success",
    confirmDeleteButton: ".oxd-button--label-danger",
    confirmDeleteText: "Yes, Delete",
} as const;
