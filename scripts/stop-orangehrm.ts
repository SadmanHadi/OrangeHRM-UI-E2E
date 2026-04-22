import { execSync } from "child_process";

export function stopOrangeHRM(): void {
    console.log("[stop-orangehrm] Stopping OrangeHRM via Docker Compose...");
    execSync("docker compose down", { stdio: "inherit" });

    console.log("[stop-orangehrm] OrangeHRM stopped (volumes are preserved).");
}

if (require.main === module) {
    stopOrangeHRM();
}
