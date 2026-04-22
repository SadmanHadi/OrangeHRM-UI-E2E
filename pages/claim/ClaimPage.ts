import { ClaimActions } from "./actions/ClaimActions";

/**
 * ClaimPage keeps page-object import stable while action logic stays modular.
 */
export class ClaimPage extends ClaimActions {}
export { ClaimLocators } from "./locators/ClaimLocators";
