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
  - `src/setup/*.setup.ts` — reusable state preparation (Employee, Claim, etc.)
  - `src/utils/timestamp.ts` — unique name generator (`uniqueName()`)
- **Atomic Testing:** every test creates and cleans up its own data
- **Parallel-Safe:** all entities use a custom timestamp + random hash suffix to avoid collisions
- **Multi-Browser:** tests run on Chromium, Firefox, WebKit, and Edge (4 browsers)
- **Modern Standards:** ESLint Flat Config (v10) + Prettier + Strict TypeScript

---

## 📋 Prerequisites

| Requirement   | Version                         |
| ------------- | ------------------------------- |
| **Node.js**   | v18+                            |
| **Docker**    | Latest (for CI / Docker local)  |
| **OrangeHRM** | Installed locally or via Docker |

---

## 🔐 Secret Management (Local vs CI)

The project uses a secure, dual-layer environment management system:

### 🏠 Local Development

1. **File**: `.env` (Ignored by Git for security)
2. **Setup**: Copy `.env.example` to `.env`.
3. **Usage**: `dotenv` automatically loads these into `process.env`.

### 🚀 CI (GitHub Actions)

1. **Mechanism**: GitHub Actions **Secrets**.
2. **Setup**: Go to `Settings > Secrets and variables > Actions` and add:
   - `BASE_URL`: Root URL of your instance.
   - `ADMIN_USERNAME`: Admin User.
   - `ADMIN_PASSWORD`: Admin Password.
3. **Internal Logic**: The `playwright.yml` workflow dynamically creates an ephemeral `.env` from these secrets during the run.

---

## 📂 Project Structure

```text
orangehrm-playwright/
├── .github/workflows/
│   └── playwright.yml      ← CI/CD pipeline (Matrix Strategy)
├── artifacts/
│   └── auth/               ← Auth session storage (storageState.json)
├── src/
│   ├── pages/              ← Page Object Model classes
│   ├── setup/              ← Preparation helpers (Employee, Claim, etc.)
│   └── utils/              ← Shared utilities (timestamps, unique IDs)
├── tests/
│   ├── advanced/           ← Advanced tasks (Loop, Dynamic ID)
│   ├── claim/              ← Claim module CRUD
│   ├── employee/           ← Employee module CRUD (Production Hardened)
│   ├── event/              ← Event module CRUD
│   └── leave-type/         ← Leave Type module CRUD
├── eslint.config.mjs       ← Modern ESLint Flat Config
├── .prettierrc             ← Formatting configuration
├── docker-compose.yml      ← Container orchestration
├── global-setup.ts         ← Server health-check + Auth preparation
├── playwright.config.ts    ← Playwright engine configuration
├── package.json            ← Scripts & dependencies
└── tsconfig.json           ← TypeScript strict mode config
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
