export function logStep(message: string): void {
    console.log(`[STEP] ${message}`);
}

export function logSuccess(message: string): void {
    console.log(`[OK] ${message}`);
}

export function logError(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`, error);
}
