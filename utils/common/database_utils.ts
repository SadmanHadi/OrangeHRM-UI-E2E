import { execSync } from "child_process";
import { requireEnv } from "../env";

/**
 * Database utilities for the OrangeHRM E2E framework.
 * Allows direct manipulation of the database via Docker exec for cleanup or bypass scenarios.
 */

export class DatabaseUtils {
    /**
     * Executes a SQL command inside the orangehrm_db container.
     */
    static executeSql(sql: string): void {
        const containerName = "orangehrm_db";
        const user = "root";
        const password = requireEnv("DB_ROOT_PASSWORD");
        const dbName = requireEnv("DB_NAME");

        // Construct the docker exec command
        // Note: Using -p without space is required for mysql CLI
        const command = `docker exec ${containerName} mysql -u ${user} -p${password} ${dbName} -e "${sql}"`;

        try {
            const output = execSync(command, { encoding: "utf8" });
            console.log(`[DatabaseUtils] SQL Success. Output: ${output}`);
        } catch (error) {
            console.error(`[DatabaseUtils] SQL Execution failed: ${sql}`);
            console.error(error);
        }
    }

    /**
     * Deletes a claim request by searching for its reference/description.
     */
    static deleteClaimByName(name: string): void {
        const sql = `DELETE FROM ohrm_claim_request WHERE description LIKE '%${name}%' OR reference_id LIKE '%${name}%';`;
        this.executeSql(sql);
    }
}
