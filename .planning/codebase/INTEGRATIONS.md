# Integrations

- **Docker Compose**: Orchestrates `orangehrm_app` and `orangehrm_db` containers. Managed via `scripts/start-orangehrm.ts` and `scripts/stop-orangehrm.ts`.
- **GitHub Actions**: Pipeline defined in `.github/workflows/`. Handles lint, server boot, parallel tests, and artifact upload.
- **OrangeHRM Installer**: Custom `scripts/ui-installer.ts` automates the web-based installation process in fresh environments.
- **Global Setup/Teardown**: Playwright hooks (`global-setup.ts`, `global-teardown.ts`) handle container lifecycle and authentication state.
