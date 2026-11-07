import { timingSafeEqual } from "node:crypto";

import { env } from "@/lib/env";

export const GITHUB_STATE_COOKIE = "jetic_oauth_state";
const STATE_TTL_SECONDS = 10 * 60;

export interface GitHubState {
  readonly state: string;
  readonly next: string;
  readonly mode: "login" | "link";
}

export function githubCallbackUrl(): string {
  return `${env.appUrl.replace(/\/+$/, "")}/api/auth/github/callback`;
}

export function safeNext(value: string | null): string {
  if (!value) return "/app/onboarding";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/app/onboarding";
  }
  return value;
}

export function encodeGithubState(
  state: string,
  next: string,
  mode: GitHubState["mode"] = "login",
): string {
  return Buffer.from(JSON.stringify({ state, next, mode }), "utf8").toString("base64url");
}

export function decodeGithubState(value: string | undefined): GitHubState | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Partial<GitHubState>;
    if (typeof parsed.state !== "string" || parsed.state.length < 16) return null;
    if (typeof parsed.next !== "string") return null;
    return {
      state: parsed.state,
      next: safeNext(parsed.next),
      mode: parsed.mode === "link" ? "link" : "login",
    };
  } catch {
    return null;
  }
}

export function statesMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export const GITHUB_STATE_MAX_AGE_SECONDS = STATE_TTL_SECONDS;
