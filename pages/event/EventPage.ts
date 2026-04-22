import { EventActions } from "./actions/EventActions";

/**
 * EventPage keeps page-object import stable while action logic stays modular.
 */
export class EventPage extends EventActions {}
export { EventLocators } from "./locators/EventLocators";
