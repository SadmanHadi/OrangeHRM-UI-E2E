# OrangeHRM UI E2E Automation

End-to-end UI test automation for OrangeHRM using Playwright, TypeScript, Docker, and GitHub Actions.

## Test Coverage (16 Atomic CRUD Tests)

| Module       | Create | Read | Update | Delete |
| ------------ | :----: | :--: | :----: | :----: |
| Employee     |   ✅   |  ✅  |   ✅   |   ✅   |
| Event        |   ✅   |  ✅  |   ✅   |   ✅   |
| Leave Type   |   ✅   |  ✅  |   ✅   |   ✅   |
| Claim (Self) |   ✅   |  ✅  |   ✅   |   ✅   |

Test case documentation lives in [orangehrm-testcases.csv](orangehrm-testcases.csv).

## Architecture & Patterns

- Page Object Model: [src/pages](src/pages)
- Setup Functions Pattern: [src/setup](src/setup) and [global-setup.ts](global-setup.ts)
- Unique data strategy: `uniqueName()` uses ${Date.now()} and ${Math.random()} for parallel safety
- Strict TypeScript + ESLint + Prettier

## Prerequisites

- Node.js LTS (18+)
- pnpm (10+)
- Docker + Docker Compose

## Install

```bash
pnpm install
pnpm exec playwright install --with-deps
```

## Run Locally

1. Create your local env file:

```bash
cp .env.example .env
```

2. Set required values in `.env` (no secrets in repo).

3. Run tests:

```bash
pnpm test
```

Optional:

```bash
pnpm test:ui
```

## Run with Docker

Run the application and test runner via Docker Compose:

```bash
docker compose up -d
docker compose run --rm test-runner
```

## Run in CI (GitHub Actions)

Add these secrets in your GitHub repo:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DB_ROOT_PASSWORD`
- `DB_PASSWORD`

The workflow will build a local `.env`, start the server, run lint/format checks, execute tests across 4 browsers, and upload artifacts.

## Report Locations

- Monocart report: [playwright-report/monocart/index.html](playwright-report/monocart/index.html)
- Playwright HTML report: [playwright-report/html/index.html](playwright-report/html/index.html)
- Raw results and traces: [test-results](test-results)

## Known Limitations

- First boot may take several minutes while OrangeHRM initializes the database.
- Coverage is focused on happy-path CRUD flows only.
- Local execution is capped at 4 workers by default to reduce resource contention.
