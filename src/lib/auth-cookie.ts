/**
 * Cookie set by the web app after email verification. The API session cookie
 * may live on a different origin, so the web app keeps its own httpOnly copy
 * and the proxy turns it into a bearer token.
 */
export const SESSION_COOKIE_NAME = "jetic_session";

/**
 * Older deployments used different cookie names. Reading them keeps existing
 * sessions working while the web-owned cookie becomes the primary one.
 */
export const SESSION_COOKIE_NAMES: readonly string[] = [
  ...(process.env.JETIC_SESSION_COOKIE_NAME
    ? [process.env.JETIC_SESSION_COOKIE_NAME]
    : []),
  SESSION_COOKIE_NAME,
  "jetic.session_token",
  "flowscan.session_token",
];
