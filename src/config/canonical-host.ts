/**
 * The one host this site is served on, alone in its own file for one reason.
 *
 * Client-side scripts need it — Analytics.astro gates on the live origin — and
 * importing it from config/site.ts drags that module's computed exports along
 * with it: HOURS_DAYS, HOURS_TIMES and HOURS_LABEL are all built by calling
 * clock() at module scope, and Rollup cannot prove those calls are side-effect
 * free, so it keeps them. That put roughly 300 bytes on every page load which
 * compute a string and immediately throw it away. A leaf module holding one
 * string imports as one string.
 *
 * config/site.ts re-exports this, so it remains the single place the rest of
 * the site imports URLs from. Import this file directly only from a script
 * that ships to the browser.
 */
export const CANONICAL_HOST = 'https://www.careinflow.com';
