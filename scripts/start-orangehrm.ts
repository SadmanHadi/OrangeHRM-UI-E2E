import { execSync } from "child_process";
import { loadProjectEnv } from "../utils/env";

/**
 * Starts the OrangeHRM and MariaDB containers using Docker Compose.
 * Uses --remove-orphans to ensure a clean state.
 */
export function startOrangeHRM(): void {
    loadProjectEnv();
    console.log("[start-orangehrm] Starting OrangeHRM via Docker Compose...");
    try {
        execSync("docker compose up -d --remove-orphans", { stdio: "inherit" });
    } catch (error: any) {
        console.warn(
            `[start-orangehrm] Warning: docker compose up failed: ${error.message}`,
        );
    }
}

if (require.main === module) {
    startOrangeHRM();
}
