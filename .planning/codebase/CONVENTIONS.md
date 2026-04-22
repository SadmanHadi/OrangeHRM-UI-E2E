# Coding Conventions

- **Naming**:
  - Classes: PascalCase (e.g., `ClaimActions`)
  - Methods/Variables: camelCase (e.g., `createClaim`)
  - Locators: SCREAMING_SNAKE_CASE in dedicated locator files.
- **Async/Await**: Mandatory for all browser interactions.
- **Assertions**: Use Playwright `expect` with locators for automatic retries.
- **Linting**: ESLint with `eslint-plugin-playwright`.
- **Formatting**: Prettier with integrated configuration.
- **Imports**: Clean and organized (verified via `eslint-plugin-import`).
