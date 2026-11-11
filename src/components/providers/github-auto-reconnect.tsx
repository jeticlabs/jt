"use client";

import { useEffect } from "react";

import { useUserStore } from "@/context";

const RECONNECT_FLAG_PREFIX = "jetic:github-auto-reconnect:";

/**
 * One-shot GitHub reconnection for linked accounts whose stored credential is
 * missing or unreadable. The API's connection payload reports
 * `credentialsStored: false` in exactly the case the repository picker labels
 * "Reconnect GitHub".
 *
 * The sessionStorage flag prevents a redirect loop when the user cancels the
 * GitHub consent screen or when the new token still cannot be read.
 */
export function GithubAutoReconnect() {
  const status = useUserStore((state) => state.status);
  const github = useUserStore((state) => state.github);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (status !== "ready" || !user || !github) return;

    const flagKey = `${RECONNECT_FLAG_PREFIX}${user.id}`;

    if (!user.githubId) {
      window.sessionStorage.removeItem(flagKey);
      return;
    }

    if (!github.connected) return;

    // A successful connection clears the guard so a future token expiry can
    // trigger another automatic repair.
    if (github.credentialsStored) {
      window.sessionStorage.removeItem(flagKey);
      return;
    }

    if (window.sessionStorage.getItem(flagKey) === "1") return;
    window.sessionStorage.setItem(flagKey, "1");

    const next = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    window.location.assign(
      `/api/auth/github/connect?next=${encodeURIComponent(next)}`,
    );
  }, [status, github, user]);

  return null;
}
