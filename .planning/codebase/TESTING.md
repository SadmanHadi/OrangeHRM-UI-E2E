# Testing Standards

- **Atomicity**: One test per objective. No long end-to-end chains that fail at the start.
- **Repeatability**: Tests must clean up their own data or use unique data to ensure they can run indefinitely.
- **Parallelism**: Configured for 4+ workers. Must remain safe under high concurrency.
- **Reporting**:
  - Monocart HTML Reporter for rich visualization.
  - Playwright Trace on first retry.
  - Screenshots/Videos on failure.
- **Coverage**: Full CRUD (Create, Read, Update, Delete) for Employee, Leave Type, Event, and Claim modules.
