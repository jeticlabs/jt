const DEFAULT_DESTINATION = "/app/onboarding";

/**
 * Returns a safe same-origin destination from the `next` query parameter.
 * Falls back to onboarding when the value is missing or points elsewhere.
 */
export function postAuthDestination(): string {
  if (typeof window === "undefined") return DEFAULT_DESTINATION;

  const next = new URLSearchParams(window.location.search).get("next");
  if (!next) return DEFAULT_DESTINATION;

  try {
    const target = new URL(next, window.location.origin);
    if (target.origin !== window.location.origin) return DEFAULT_DESTINATION;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return DEFAULT_DESTINATION;
  }
}
