# Architecture

- **Page Object Model (POM)**: Separation of locators, actions, and page classes.
- **Setup Function Pattern**: Modular setup/cleanup functions in `src/setup/` to ensure test atomicity and data independence.
- **Atomic Tests**: Each test file in `tests/` targets a single CRUD operation or specific objective.
- **Data Isolation**: Unique timestamp-based data for every "Create" operation to support parallel-safe execution.
- **State Management**: Authentication state is captured once in `global-setup.ts` and reused across workers to save time.
