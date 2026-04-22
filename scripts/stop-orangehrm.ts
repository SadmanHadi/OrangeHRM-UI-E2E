import { execSync } from "child_process";
import { loadProjectEnv } from "../utils/env";

export function stopOrangeHRM(): void {
    loadProjectEnv();
    console.log("[stop-orangehrm] Stopping OrangeHRM via Docker Compose...");
    execSync("docker compose down", { stdio: "inherit" });

    console.log("[stop-orangehrm] OrangeHRM stopped (volumes are preserved).");
}

if (require.main === module) {
    stopOrangeHRM();
}
