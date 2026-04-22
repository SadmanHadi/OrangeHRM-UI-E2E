# Project Structure

- `src/pages/`: Page Object Models organized by module (claim, employee, event, leave-type, login).
  - `actions/`: Business logic and interactions.
  - `locators/`: UI selectors.
- `tests/`: Atomic test files organized by module.
- `src/setup/`: Project-specific data setup and cleanup functions.
- `src/utils/`: Generic reusable utilities (common, database).
- `scripts/`: Server orchestration and installer scripts.
- `configs/`: (To be populated) Environment and tool configurations.
- `docker/`: Dockerfiles and infrastructure configuration.
- `.github/workflows/`: CI/CD pipeline definitions.
