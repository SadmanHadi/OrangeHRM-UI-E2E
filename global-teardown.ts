import { execSync } from 'child_process';

/**
 * global-teardown.ts
 * Runs after all tests complete.
 */
async function globalTeardown() {
  console.log('[global-teardown] All tests finished. Stopping OrangeHRM via Docker Compose...');
  try {
    execSync('docker compose down -v', { stdio: 'inherit' });
    console.log('[global-teardown] Cleanup complete.');
  } catch (error: any) {
    console.error('[global-teardown] Error during Docker cleanup:', error.message);
  }
}

export default globalTeardown;
