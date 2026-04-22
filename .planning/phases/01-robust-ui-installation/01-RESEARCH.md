# Research: Phase 1 — Robust UI Installation

## Objective

Identify reliable locators and state-aware logic for the OrangeHRM 5.8.1 installation flow.

## Findings

### 1. Installation Page Flow

1. Welcome Screen (requires 'Fresh Installation' check)
2. License Acceptance (requires 'I accept' checkbox)
3. Database Configuration (conditional roadblocks)
4. System Check (read-only verification)
5. Instance Creation (requires Organization/Country metadata)
6. Admin User Creation (requires Admin credentials)
7. Confirmation (final check)
8. Installation Progress (background processing)
9. Success Page

### 2. Critical Locators (OrangeHRM 5.8.1)

- **Input Group Container:** `.oxd-input-group` (contains label and input)
- **Select Dropdown:** `.oxd-select-wrapper`
- **Dropdown Option:** `.oxd-select-option`
- **Button:** `button.oxd-button--secondary:has-text("Next")`
- **Checkbox/Radio:** Use `label:has-text(...)` to target the label which then clicks the input.

### 3. State-Aware Roadblocks

- **Database Already Exist:** This happens when the Docker volume is reused.
- **Handling:** Locate `label:has-text("Existing Empty Database")`. Clicking this bypasses the DB creation step and moves to schema injection.

### 4. Implementation Pattern

- Use a `while` loop that continues as long as a "Next" button is visible and the page URL or content changes.
- Wrap specific step logic in `try/catch` with descriptive logging to identify exactly where the "beast" is stuck.

## Success Criteria

- Script navigates from Welcome to Success without intervention.
- All forms are filled with `.env` values or specified defaults.
- Timeouts are high enough (120s) to handle slow container warm-ups.
