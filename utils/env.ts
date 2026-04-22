/* eslint-disable playwright/require-hook */
import dotenv from "dotenv";
import path from "path";

let envLoaded = false;

export function loadProjectEnv(): void {
    if (envLoaded) {
        return;
    }

    dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
    dotenv.config({
        path: path.resolve(__dirname, "..", "configs", ".env"),
        override: true,
    });
    envLoaded = true;
}

export function requireEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(
            `[env] Missing required environment variable: ${name}. Copy .env.example and provide a real value.`,
        );
    }
    return value;
}
