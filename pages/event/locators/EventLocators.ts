/**
 * Locators for the Event module (Claim > Configuration > Events)
 */
export const EventLocators = {
    // Navigation
    eventListUrl: "/web/index.php/claim/viewAssignClaim",
    configurationTab: "Configuration",
    eventsLink: "Events",

    // Form
    eventNameLabel: "Event Name",
    statusLabel: "Status",
    addButton: "Add",
    saveButton: "Save",
    searchButton: "Search",

    // List
    tableCard: ".oxd-table-card",
    tableBody: ".oxd-table-body",
    editIcon: ".bi-pencil-fill",
    trashIcon: ".bi-trash",
    dropdownMenu: ".oxd-dropdown-menu",
    topbarNavTab: ".oxd-topbar-body-nav-tab",
    secondaryButton: ".oxd-button--secondary",

    // Toasts & Dialogs
    successToast: ".oxd-toast--success",
    confirmDeleteButton: ".oxd-button--label-danger",
    confirmDeleteText: "Yes, Delete",
} as const;
