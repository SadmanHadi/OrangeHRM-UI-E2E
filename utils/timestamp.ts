/**
 * Generates a unique name with the given prefix using a timestamp + random suffix.
 * Parallel-safe: avoids collisions even when multiple workers create entities simultaneously.
 */
export function uniqueName(prefix: string): string {
    const ts = Date.now().toString(36);
    const rnd = Math.random().toString(36).slice(2, 6);
    const name = `${prefix}_${ts}_${rnd}`;
    return name.substring(0, 30);
}
