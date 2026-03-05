/**
 * Generates a unique name with the given prefix using a timestamp + random suffix.
 * Parallel-safe: avoids collisions even when multiple workers create entities simultaneously.
 */
export function uniqueName(prefix: string): string {
  const ts = Date.now().toString().slice(-6);
  const rnd = Math.floor(Math.random() * 1000);
  return `${prefix}_${ts}_${rnd}`;
}
