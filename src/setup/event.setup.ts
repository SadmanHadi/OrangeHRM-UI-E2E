import { Page } from "@playwright/test";
import { EventPage } from "../pages/event/EventPage";

/**
 * Project-specific setup helper to create an event.
 * Uses the EventPage POM.
 */
export async function createEvent(page: Page, name: string): Promise<void> {
    const eventPage = new EventPage(page);
    await eventPage.create(name);
}

/**
 * Project-specific cleanup helper to delete an event.
 * Uses the EventPage POM.
 */
export async function deleteEvent(page: Page, name: string): Promise<void> {
    const eventPage = new EventPage(page);
    await eventPage.delete(name);
}
