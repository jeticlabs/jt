import { BrowserApiError } from "@/lib/api/browser";

/** True when the API needs the user to run the GitHub link flow again. */
export function needsGithubReconnectMessage(
  message: string | null | undefined,
): boolean {
  if (!message) return false;
  const value = message.toLowerCase();
  return (
    value.includes("connect github") ||
    value.includes("reconnect github") ||
    value.includes("authorization could not be read") ||
    value.includes("authorization expired")
  );
}

export function needsGithubReconnect(error: unknown): boolean {
  if (error instanceof BrowserApiError) {
    if (error.code === "GITHUB_AUTH_REQUIRED") return true;
    return needsGithubReconnectMessage(error.message);
  }
  return error instanceof Error
    ? needsGithubReconnectMessage(error.message)
    : false;
}
