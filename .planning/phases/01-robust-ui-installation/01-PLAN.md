# Plan: Robust UI Installation

**Phase:** 1
**Wave:** 1
**Files modified:**

- `scripts/ui-installer.ts`
- `configs/global-setup.ts`

## Objective

Finalize and stabilize the `ui-installer.ts` script to reliably automate the OrangeHRM 5.8.1 installation process in headless mode.

## Tasks

### 1. Refine Locator Helpers (scripts/ui-installer.ts)

- **Action:** Update `fillInput` and `clickNextIfVisible` to use more resilient selectors and verification loops.
- **Read First:** `scripts/ui-installer.ts`
- **Acceptance Criteria:**
    - `fillInput` uses `.oxd-input-group` parent targeting.
    - `clickNextIfVisible` verifies page content change after click.

### 2. Implement Database Warning Logic (scripts/ui-installer.ts)

- **Action:** Add `submitDatabaseStep` function that detects "Database Already Exist" warning and switches to 'Existing Empty Database' mode.
- **Read First:** `scripts/ui-installer.ts`
- **Acceptance Criteria:**
    - Logic handles both Fresh and Existing Database scenarios.
    - Script logs when switching modes.

### 3. Automate Instance & Admin Creation (scripts/ui-installer.ts)

- **Action:** Add logic for Step 6 (Instance Creation) and Step 7 (Admin User Creation) using `.env` values and defaults.
- **Read First:** `scripts/ui-installer.ts`, `configs/.env`
- **Acceptance Criteria:**
    - Organization name and Country are filled.
    - Admin credentials match `ADMIN_USERNAME` and `ADMIN_PASSWORD` from `.env`.

### 4. Finalize Wait and Success Logic (scripts/ui-installer.ts)

- **Action:** Add wait for 'Installation Complete' message and a final click to finish.
- **Read First:** `scripts/ui-installer.ts`
- **Acceptance Criteria:**
    - Script waits up to 600s for final installation progress.
    - Script logs "Installation successful" on completion.

### 5. Update Global Setup Integration (configs/global-setup.ts)

- **Action:** Ensure `global-setup.ts` correctly invokes the installer with appropriate timeouts and retries.
- **Read First:** `configs/global-setup.ts`
- **Acceptance Criteria:**
    - `pnpm exec tsx scripts/ui-installer.ts` is called when installation is needed.

## Verification

- Run `pnpm exec tsx scripts/ui-installer.ts` manually and verify it reaches the success page.
- Run `pnpm test` and verify that the global setup successfully initializes the environment.

## Must Haves

- [ ] No hardcoded waits (except short polling delays).
- [ ] Reliable handling of "Database already exists".
- [ ] Successful navigation to the final installation completion page.
