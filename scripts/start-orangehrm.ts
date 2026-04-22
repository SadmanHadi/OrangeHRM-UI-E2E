import { execSync } from "child_process";

export function startOrangeHRM(): void {
    console.log("[start-orangehrm] Starting OrangeHRM via Docker Compose...");
    execSync("docker compose up -d ohrm-db orangehrm", { stdio: "inherit" });
}

if (require.main === module) {
    startOrangeHRM();
}
