/**
 * global-teardown.ts
 * Runs after all tests complete. Use for housekeeping (e.g., remove test artifacts).
 * Docker is stopped by the CI pipeline itself; no special teardown needed here.
 */
async function globalTeardown() {
  console.log('[global-teardown] All tests finished. Cleanup complete.');
}

export default globalTeardown;
