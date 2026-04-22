# Roadmap: OrangeHRM Infrastructure Stabilization

## Milestone 1: Reliable Environment Bootstrapping

Objective: Ensure the test environment starts and configures itself with zero manual intervention.

### Phase 1: Robust UI Installation

Goal: Complete and stabilize the `ui-installer.ts` script to handle the full OrangeHRM installation flow.

**Acceptance Criteria:**

- [ ] Installer handles 'Database Already Exist' by switching modes.
- [ ] Installer completes 'Instance Creation' form (Organization, Country).
- [ ] Installer completes 'Admin User Creation' form.
- [ ] Installer waits for 'Installation Complete' message.
- [ ] Full run takes < 5 minutes in headless mode.
- [ ] Script uses values from `.env`.

**Canonical refs:**

- `scripts/ui-installer.ts`
- `configs/.env`
- `configs/global-setup.ts`

---

## Milestone 2: Test Suite Readiness (Future)

Objective: Ensure all CRUD tests run reliably in parallel.

### Phase 2: Parallel CRUD Verification

(Deferred)

---

_Last updated: 2026-04-22_
