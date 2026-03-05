# Repo-01: OrangeHRM UI E2E

End-to-End UI test automation for **OrangeHRM**, built with **Playwright + TypeScript**.

---

## Test Coverage (16 Atomic CRUD Tests)

| Module          | Create | Read | Update | Delete |
| --------------- | :----: | :--: | :----: | :----: |
| 👤 Employee     |   ✅   |  ✅  |   ✅   |   ✅   |
| 📅 Event        |   ✅   |  ✅  |   ✅   |   ✅   |
| 🏖️ Leave Type   |   ✅   |  ✅  |   ✅   |   ✅   |
| 💰 Claim (Self) |   ✅   |  ✅  |   ✅   |   ✅   |

---

## 🛠️ Tech Stack

- **Testing**: ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=Playwright&logoColor=white)
- **Language**: ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- **Environment**: ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
- **Reporting**: Monocart Reporter

---

## 🏛️ Architecture & Patterns

- **Page Object Model (POM):** `src/pages/` — one class per OrangeHRM module
- **Setup Functions Pattern:**
  - `globalSetup` — server health-check + one-time admin login (saves session via `storageState`)
  - `src/setup/auth.setup.ts` — reusable login helper
  - `src/utils/timestamp.ts` — unique name generator (`uniqueName()`)
- **Atomic Testing:** every test creates and cleans up its own data
- **Parallel-Safe:** all entities use a `Date.now()` timestamp suffix to avoid name collisions
- **Multi-Browser:** tests run on Chromium, Firefox, WebKit, and Edge (4 browsers)
- **Reporting:** Monocart HTML reporter + Playwright trace on failure

---

## 📋 Prerequisites

| Requirement   | Version                         |
| ------------- | ------------------------------- |
| **Node.js**   | v18+                            |
| **Docker**    | Latest (for CI / Docker local)  |
| **XAMPP**     | Optional (for XAMPP local)      |
| **OrangeHRM** | Installed locally or via Docker |

---

## Installation

```bash
git clone <repository-url>
cd orangehrm-playwright
npm install
npx playwright install --with-deps
```

---

## Environment Setup

Copy the example env and fill in your values:

```bash
cp .env.example .env
```

| Variable         | Description                                       | Example                      |
| ---------------- | ------------------------------------------------- | ---------------------------- |
| `BASE_URL`       | OrangeHRM root URL (**without** `/web/index.php`) | `http://localhost/orangehrm` |
| `ADMIN_USERNAME` | Admin login username                              | `admin`                      |
| `ADMIN_PASSWORD` | Admin login password                              | `Admin@1234`                 |

---

## Run Locally

### Option A: With XAMPP (manual server)

1. Start XAMPP → run **Apache** and **MySQL**
2. Ensure OrangeHRM is accessible at your `BASE_URL`
3. Run tests:

```bash
# All browsers (sequential locally)
npx playwright test

# Single browser
npx playwright test --project=chromium

# Interactive UI mode
npx playwright test --ui
```

### Option B: With Docker Compose

```bash
# Start OrangeHRM server
docker compose up -d

# Wait for it to initialize (~2 min on first run), then:
npx playwright test

# Stop server when done
docker compose down
```

---

## Run in CI (GitHub Actions)

The pipeline (`.github/workflows/playwright.yml`) **automatically**:

1. Installs dependencies + Playwright browsers.
2. Starts OrangeHRM via `docker compose up -d`.
3. Waits for the server to be healthy.
4. Executes tests in **Parallel via CI Matrix Strategy** (Chromium, Firefox, WebKit, Edge).
5. Isolates each browser into its own VM for 100% execution stability.
6. Uploads **Monocart reports + Playwright traces** as version-controlled artifacts.

**No manual setup required** — the CI pipeline is fully self-contained and production-ready.

---

## Reports & Artifacts

| Report                        | Location                                                 |
| ----------------------------- | -------------------------------------------------------- |
| **Monocart HTML** (local)     | `monocart-report/index.html`                             |
| **Playwright traces** (local) | `test-results/`                                          |
| **CI artifacts**              | Download from GitHub Actions → run → "Artifacts" section |

To view a trace locally:

```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

---

## 📂 Project Structure

```text
orangehrm-playwright/
├── .github/workflows/
│   └── playwright.yml      ← CI/CD pipeline
├── artifacts/
│   └── auth/               ← Auth session storage
├── src/
│   ├── pages/              ← Page Object Model classes
│   │   ├── ClaimPage.ts
│   │   ├── EmployeePage.ts
│   │   ├── EventPage.ts
│   │   └── LeaveTypePage.ts
│   ├── setup/              ← Setup & Cleanup helpers
│   │   ├── auth.setup.ts
│   │   ├── claim.setup.ts
│   │   ├── employee.setup.ts
│   │   ├── event.setup.ts
│   │   └── leave-type.setup.ts
│   └── utils/              ← Shared utilities
│       └── timestamp.ts
├── tests/                  ← CRUD & Bonus test specs
│   ├── Bonus Test cases/   ← Advanced automation tasks
│   ├── claim/
│   ├── employee/
│   ├── event/
│   └── leave-type/
├── .eslintrc.json          ← Linting configuration
├── .prettierrc             ← Formatting configuration
├── docker-compose.yml      ← Container orchestration
├── global-setup.ts         ← Server health-check + auth
├── global-teardown.ts      ← Post-run cleanup
├── playwright.config.ts    ← Playwright configuration
├── package.json            ← Dependencies & Scripts
└── tsconfig.json           ← TypeScript configuration
```

---

## Available Scripts

| Script        | Command           |
| ------------- | ----------------- |
| Run all tests | `npm test`        |
| Run with UI   | `npm run test:ui` |

---

## Known Limitations & Assumptions

1. **Session Handling** — OrangeHRM (open-source) can occasionally invalidate previous sessions when the same user logs in again. To mitigate this, the suite uses a one-time `globalSetup` to share storage state, and the **CI Matrix Strategy** further isolates browser contexts into separate VMs to ensure sequential stability within parallel runs.
2. **Docker first run** — the Bitnami OrangeHRM container takes **2–3 minutes** to initialize its database on the very first boot.
3. **Concurrency Limits** — While the suite is 100% parallel-safe logically, local execution of 16 simultaneous browser workers may bottleneck on lower-spec hardware; for these cases, running single-project tests or utilizing interactive UI mode is recommended.
4. **No negative tests** — current coverage focuses on happy-path CRUD operations as specified in the requirements.
