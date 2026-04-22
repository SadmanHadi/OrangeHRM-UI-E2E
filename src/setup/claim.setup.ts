import { Page } from "@playwright/test";
import { ClaimPage } from "../pages/claim/ClaimPage";
import { EventPage } from "../pages/event/EventPage";

/**
 * Project-specific setup helper to create a claim.
 * Hard dependency: creates an Event first.
 */
export async function createClaimWithEvent(
    page: Page,
    eventName: string,
    remarks: string,
): Promise<void> {
    const eventPage = new EventPage(page);
    await eventPage.create(eventName);

    const claimPage = new ClaimPage(page);
    await claimPage.create(eventName, remarks);
}

/**
 * Project-specific cleanup helper to delete a claim and its event.
 */
export async function deleteClaimAndEvent(
    page: Page,
    eventName: string,
    remarks?: string,
): Promise<void> {
    const claimPage = new ClaimPage(page);
    // Attempt claim deletion (uses hybrid UI/DB fallback)
    await claimPage
        .delete(eventName, remarks)
        .catch((err) =>
            console.warn(
                `Claim cleanup failed (expected for initiated claims): ${err}`,
            ),
        );

    const eventPage = new EventPage(page);
    await eventPage.delete(eventName);
}
