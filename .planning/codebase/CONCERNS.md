# Technical Concerns

- **Docker Dependency**: Framework requires Docker Engine to be running and healthy. First boot latency is high (3-5 mins).
- **Environment Stability**: Flaky tests may arise from high parallel load on the local OrangeHRM container.
- **Claim Module Logic**: Business rules in OrangeHRM 5.8.1 restrict claim deletion in certain states; requires database fallback or specific UI flows.
- **Secret Management**: High risk of `.env` or sensitive logs leaking if GitHub Actions secrets are misconfigured.
- **Pathing**: Differences between local Windows execution and CI Linux execution (already addressed via `path.resolve`).
