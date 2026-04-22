/**
 * Locators for the Claim (Self) module
 */
export const ClaimLocators = {
    // Navigation
    viewClaimUrl: "/web/index.php/claim/viewClaim",
    submitClaimUrl: "/web/index.php/claim/submitClaim",
    myClaimsUrl: "/web/index.php/claim/viewMyClaims",

    // Form
    eventLabel: "Event",
    currencyLabel: "Currency",
    remarksLabel: "Remarks",
    submitButton: "button[type='submit']",

    // Search (My Claims list)
    eventNameLabel: "Event Name",
    statusLabel: "Status",
    searchButton: "Search",
    resetButton: "Reset",

    // List
    tableCard: ".oxd-table-card",
    viewDetailsButton: "View Details",

    // Detail view actions
    cancelButton: "Cancel",
    deleteButton: /Delete|Discard/i,
    confirmDeleteButton: ".oxd-button--label-danger",

    // Toasts
    successToast: ".oxd-toast--success",
    inputGroup: ".oxd-input-group",
} as const;
