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

Before setting up the project, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher (LTS recommended)
- **pnpm**: v9.0.0 or higher
- **Docker & Docker Compose**: Latest version (required for local containerized environment and CI)

---

## ⚙️ Install Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd OrangeHRM-UI-E2E
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Install Playwright Browsers**:
   ```bash
   pnpm exec playwright install --with-deps
   ```

---

## 🏠 Run Locally

The project is fully autonomous. Docker management (start/stop) and application installation are handled automatically via Playwright's global lifecycle hooks.

1. **Configure Environment Variables**:
   Copy the example environment file and fill in your details:

   ```bash
   cp .env.example .env
   ```

   _Required local values:_
   - `BASE_URL=http://localhost`
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=Admin@1234`

2. **Run Tests**:
   Simply run the test command. Playwright will start the Docker containers, perform any necessary installation, and shut them down after the run.
   - **All Tests**: `pnpm test`
   - **UI Mode**: `pnpm test:ui` (interactive)
   - **Single Project**: `pnpm exec playwright test --project=chromium`

---

## � Run via XAMPP (Alternative)

If you prefer not to use Docker, you can run the suite against an OrangeHRM instance hosted on **XAMPP**.

1. **Host OrangeHRM on XAMPP**:
   - Download the OrangeHRM source and place it in your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\orangehrm`).
   - Start Apache and MySQL from the XAMPP Control Panel.
   - Complete the manual installation in your browser (e.g., `http://localhost/orangehrm`).

2. **Configure `.env`**:
   Update your `BASE_URL` to match your XAMPP path:

   ```bash
   BASE_URL=http://localhost/orangehrm
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_password
   ```

3. **Run Tests**:
   ```bash
   pnpm test
   ```
   _Note: You can safely ignore the `docker compose up` logs; the suite will automatically fall back to health-checking your XAMPP instance._

---

## �🚀 Run in CI

The project uses **GitHub Actions** for continuous integration.

### 🔐 Configuration (Secrets)

To run tests in CI, you MUST configure the following secrets in your GitHub repository (**Settings > Secrets and variables > Actions**):

| Secret Name      | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| `BASE_URL`       | The URL of the OrangeHRM instance (e.g., `http://localhost`). |
| `ADMIN_USERNAME` | Admin username for the application.                           |
| `ADMIN_PASSWORD` | Admin password for the application.                           |

### 🛠️ Workflow

The workflow is defined in `.github/workflows/playwright.yml`. It is streamlined for performance:

1. **Environment Setup**: Installs Node.js, pnpm, and Playwright browsers.
2. **Autonomous Execution**: Runs `pnpm exec playwright test`, which triggers:
   - **Global Setup**: Starts Docker, waits for readiness, and runs `scripts/install-orangehrm.js` if needed.
   - **Matrix Testing**: Executes tests across multiple browsers in parallel.
   - **Global Teardown**: Automatically stops and removes Docker containers after all tests finish.

---

## 📊 Reports

After running tests, reports are generated and can be viewed as follows:

- **Playwright HTML Report**:
  - Location: `playwright-report/html/index.html`
  - Command: `pnpm exec playwright show-report`
- **Monocart HTML Report**:
  - Location: `playwright-report/monocart/index.html` (A single-file portable HTML report)
- **CI Artifacts**:
  - In GitHub Actions, reports are uploaded as artifacts for each matrix job. Download them from the workflow summary page.

---

## ⚠️ Known Limitations & Assumptions

1. **Initialization Delay**: The Bitnami OrangeHRM container takes **2–3 minutes** to initialize its database on the very first boot. Tests include a health-check loop to wait for readiness.
2. **Session Handling**: To ensure stability, the suite uses a one-time `globalSetup` to perform an admin login and save the session state (`storageState.json`).
3. **Hardware Constraints**: Local execution of 16+ simultaneous workers may bottleneck on lower-spec machines. Default local workers are limited to 4.
4. **Data Isolation**: Every test is designed to be atomic; they create their own unique data and clean it up where possible using `uniqueName()` utilities to avoid collisions.
5. **No Negative Path Coverage**: Current coverage focuses on happy-path CRUD operations across Employee, Claim, Leave, and Event modules.
