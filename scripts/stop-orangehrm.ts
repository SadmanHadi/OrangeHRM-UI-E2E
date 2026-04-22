import { execSync } from "child_process";

export function stopOrangeHRM(): void {
    console.log("[stop-orangehrm] Stopping OrangeHRM via Docker Compose...");
    execSync("docker compose down -v", { stdio: "inherit" });

    console.log("[stop-orangehrm] Ensuring all volumes are removed...");
    try {
        // List all volumes
        const volumesOutput = execSync("docker volume ls -q", {
            encoding: "utf-8",
        });
        const volumeNames = [
            "orangehrm-ui-e2e_orangehrm_data",
            "orangehrm-ui-e2e_mariadb_data",
        ];

        for (const volume of volumeNames) {
            if (volumesOutput.includes(volume)) {
                try {
                    console.log(
                        `[stop-orangehrm] Removing orphaned volume: ${volume}`,
                    );
                    execSync(`docker volume rm ${volume}`, { stdio: "pipe" });
                } catch (error) {
                    // Volume in use, try force remove
                    try {
                        execSync(`docker volume rm -f ${volume}`, {
                            stdio: "pipe",
                        });
                    } catch (e) {
                        console.warn(
                            `[stop-orangehrm] Could not remove ${volume}, it may be in use`,
                        );
                    }
                }
            }
        }
    } catch (error) {
        // Ignore errors during cleanup
    }

    console.log("[stop-orangehrm] OrangeHRM stopped and volumes cleaned.");
}

if (require.main === module) {
    stopOrangeHRM();
}
