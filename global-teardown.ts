/**
 * global-teardown.ts
 * Runs after all tests complete.
 */
async function globalTeardown() {
    console.log(
        "[global-teardown] All tests finished. Stopping OrangeHRM via Docker Compose...",
    );
    try {
        // stopOrangeHRM();
        console.log(
            "[global-teardown] Cleanup skipped to preserve environment state.",
        );
    } catch (error: any) {
        console.error(
            "[global-teardown] Error during Docker cleanup:",
            error.message,
        );
    }
}

export default globalTeardown;
