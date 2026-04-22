# Context: Phase 1 — Robust UI Installation

## Domain

Stabilizing the OrangeHRM 5.8.1 web-based installation script (`ui-installer.ts`) to ensure it reliably configures the environment using `.env` values and handles UI-specific roadblocks like existing database warnings.

## Canonical Refs

- `scripts/ui-installer.ts`
- `configs/.env`
- `configs/global-setup.ts`

## Decisions

### 1. Navigation Strategy

- **Decision:** State-aware reactive navigation.
- **Rationale:** The installer can land on different pages depending on whether the database volume is fresh or persistent. A linear script is too brittle.
- **Outcome:** Use a loop that checks for visible markers (License, Database, System Check, etc.) and acts accordingly.

### 2. Database Warning Handling

- **Decision:** Automatic mode switch to 'Existing Empty Database'.
- **Rationale:** If the database already exists from a previous run, the "Fresh Install" flow will fail at the database step.
- **Outcome:** If "Database Already Exist" warning appears, click 'Existing Empty Database' radio and re-submit.

### 3. Instance & Admin Metadata

- **Decision:** Use standard defaults for required fields not in `.env`.
- **Rationale:** Minimizes configuration overhead while satisfying form requirements.
- **Outcome:**
    - Organization: "OrangeHRM Inc"
    - Country: "United States"
    - Admin First/Last Name: "Admin User"

### 4. Robustness Mechanisms

- **Decision:** Locator-based waits with 120s timeouts for slow Docker environments.
- **Rationale:** Docker containers can be slow to respond initially; generic timeouts lead to flaky failures.
- **Outcome:** Use `page.waitForSelector('text=...')` and custom `fillInput` helpers.

## Deferred Ideas

- **SQL-based Installer:** Replacing the UI-based script with a direct SQL dump injection for CI speed. (Noted for Milestone 2)

---

_Last updated: 2026-04-22_
