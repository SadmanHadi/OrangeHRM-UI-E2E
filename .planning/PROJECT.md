# Project: OrangeHRM UI E2E Framework Stabilization

## Vision

Complete and stabilize the OrangeHRM UI E2E automation framework, specifically focusing on the automated installation and environment setup to ensure a reliable "push-button" test execution environment.

## Context

The project uses Playwright with TypeScript and Docker Compose. We have an existing `ui-installer.ts` script that handles the OrangeHRM web-based installation process. The script needs to be made robust enough to finish automatically using values from the `.env` file, handling all UI hurdles and environmental flakiness.

## Principles

- **Reliability over Speed:** The installer must be deterministic, even if it takes a few more seconds.
- **Zero Hardcoded Secrets:** Always use `.env` or system environment variables.
- **Self-Healing:** Handle common issues (like "Database already exists") automatically.

## Requirements

### Validated

- ✓ Docker Compose environment for OrangeHRM and MariaDB — existing
- ✓ Basic Playwright test structure — existing
- ✓ UI Installer script (prototype) — existing

### Active

- [ ] Stabilize `ui-installer.ts` to handle OrangeHRM 5.8.1 installation steps automatically
- [ ] Handle "Database Already Exist" warning by switching to 'Existing Empty Database' mode
- [ ] Complete 'Instance Creation' step with required Organization/Country details
- [ ] Complete 'Admin User Creation' step with correct field names
- [ ] Ensure installer uses `.env` values correctly
- [ ] Integrate installer into `global-setup.ts` with retry logic

### Out of Scope

- [ ] Building new test cases (focus is on infrastructure stability)
- [ ] Production-level security hardening (internal test environment only)

## Evolution

This document evolves at phase transitions and milestone boundaries.

---

_Last updated: 2026-04-22 after initialization_
