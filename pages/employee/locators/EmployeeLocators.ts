/**
 * Locators for the Employee module (PIM)
 */
export const EmployeeLocators = {
    // Navigation
    employeeListUrl: "/web/index.php/pim/viewEmployeeList",
    addEmployeeUrl: "/web/index.php/pim/addEmployee",

    // Add Employee Form
    firstNameInput: "input[name='firstName']",
    lastNameInput: "input[name='lastName']",
    employeeIdLabel: /Employee Id/i,
    submitButton: "button[type='submit']",

    // Search
    searchNameInput: "input[placeholder='Type for hints...']",
    autocompleteOption: '[role="listbox"] .oxd-autocomplete-option',
    searchButton: "button[type='submit']",

    // List
    tableBody: ".oxd-table-body",
    tableCard: ".oxd-table-card",
    loadingSpinner: ".oxd-loading-spinner",
    editIcon: ".bi-pencil-fill",
    trashIcon: ".bi-trash",

    // Toasts & Dialogs
    successToast: ".oxd-toast--success",
    errorMessage: ".oxd-input-field-error-message, .oxd-toast--error",
    confirmDeleteButton: ".oxd-button--label-danger",
    confirmDeleteText: "Yes, Delete",
} as const;
