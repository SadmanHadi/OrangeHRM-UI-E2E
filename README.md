# OrangeHRM UI E2E Automation Framework

A production-grade, enterprise-level E2E automation framework for **OrangeHRM 5.8.1**, built with **Playwright**, **TypeScript**, and **Docker**. This framework follows the **Setup Function Pattern**, uses a modular **Page Object Model (POM)** structure, and is fully integrated with **GitHub Actions**.

---

## 🚀 Quick Start (Production Setup)

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js LTS** (v18 or higher)
- **pnpm** (v10 or higher)
- **Docker Desktop** (with Docker Compose)
- **Git**

### 2. Installation

Clone the repository and install all dependencies:

```bash
# Install node dependencies
pnpm install

# Install Playwright browsers and system dependencies
pnpm exec playwright install --with-deps
```

### 3. Environment Configuration

The framework uses `.env` files for secure configuration. **Never commit your `.env` file.**

```bash
# Create your local environment file
cp configs/.env.example configs/.env
```

Open `configs/.env` and configure the following:

- `BASE_URL`: The local URL where OrangeHRM will run (default: `http://localhost`).
- `ADMIN_USERNAME`: Default admin username (e.g., `admin`).
- `ADMIN_PASSWORD`: Strong password for the admin account (must meet 5.8.1 requirements).
- `DB_ROOT_PASSWORD`, `DB_PASSWORD`: Database credentials for the MariaDB container.

### 4. Running the Application & Tests

The framework handles server orchestration automatically. You can run tests directly, and the server will start via `globalSetup`.

#### Run All Tests (Parallel, Multi-browser)

```bash
pnpm test
```

#### Run with UI Mode (Interactive)

```bash
pnpm test:ui
```

#### Manual Server Control

If you want to start or stop the OrangeHRM environment manually:

```bash
# Start server
pnpm run start:orangehrm

# Stop server
pnpm run stop:orangehrm
```

---

## 🏗️ Project Structure

The project is organized by module to ensure scalability and maintainability:

```text
pages/               # Page Object Models
  ├── [module]/      # e.g., employee, leave-type, event, claim
  │   ├── actions/   # Module-specific action methods
  │   ├── locators/  # Module-specific locator constants
  │   └── Page.ts    # Main page object
tests/               # Atomic test files
setups/              # Project-specific setup/cleanup helpers (login, create entity)
utils/               # Generic reusable utilities (non-project-specific)
scripts/             # Server start/stop automation (TypeScript)
configs/             # Playwright + environment configs
```

---

## 📊 Reporting & Debugging

The framework generates comprehensive reports for every run:

- **Monocart HTML Reporter**: Located at `playwright-report/monocart/index.html`. Provides a high-level overview and deep-dive into test results.
- **Playwright HTML Report**: Located at `playwright-report/html/index.html`.
- **Traces**: Playwright traces are captured on the first retry of a failed test. View them in `test-results/` using the Playwright Trace Viewer.
- **Screenshots/Videos**: Automatically captured on failure and stored in `test-results/`.

---

## 🤖 CI/CD Integration

This project is fully ready for **GitHub Actions**. The pipeline handles:

1. Environment setup (Node, pnpm).
2. Dependency installation.
3. Linting and formatting checks (`pnpm run lint`, `pnpm run format:check`).
4. Automated OrangeHRM server startup.
5. Parallel test execution across **Chromium, Firefox, Webkit, and Edge**.
6. **Artifact Upload**: Reports, traces, and logs are saved for 30 days.

### Required GitHub Secrets

To run the CI pipeline, add these secrets to your repository:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `DB_ROOT_PASSWORD`
- `DB_PASSWORD`

---

## ⚠️ Known Limitations & Assumptions

- **First Boot Latency**: The very first time you start the server, OrangeHRM initializes its database schema. This can take 3–5 minutes. The framework includes a health check to wait for this process.
- **Claim Deletion**: In OrangeHRM 5.8.1, "Initiated" claims may have business rules preventing deletion until they are in a specific state. The framework handles this gracefully with logged warnings.
- **Docker Resources**: Ensure Docker has at least 4GB of RAM allocated for smooth parallel execution.

---

_Built with ❤️ for the Bootcamp._
