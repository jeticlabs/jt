"use client";

import { create } from "zustand";

import { apiFetch, errorMessage } from "@/lib/api/browser";
import { fetchGithubConnection } from "@/features/github/github.api";
import type { GitHubConnection } from "@/features/github/types";
import type { AccountUser, UserEnvelope } from "@/features/auth/types";
import type { AsyncStatus } from "../state/types";

interface UserState {
  readonly user: AccountUser | null;
  readonly github: GitHubConnection | null;
  readonly status: AsyncStatus;
  readonly error: string | null;
  readonly loadedAt: number | null;
  load: (options?: { force?: boolean }) => Promise<void>;
  refreshGithub: () => Promise<void>;
  setUser: (user: AccountUser) => void;
  patchUser: (patch: Partial<AccountUser>) => void;
  clear: () => void;
}

/**
 * Single source of truth for the signed-in user and their GitHub connection.
 * Product pages hydrate this once through StateProvider; dialogs can call
 * `load()` defensively because concurrent calls are deduplicated.
 */
export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  github: null,
  status: "idle",
  error: null,
  loadedAt: null,

  async load(options = {}) {
    const { status } = get();
    if (!options.force && (status === "loading" || status === "ready")) return;

    set({ status: "loading", error: null });
    try {
      const [profile, connection] = await Promise.allSettled([
        apiFetch<UserEnvelope>("/v1/users/me"),
        fetchGithubConnection(),
      ]);

      if (profile.status === "rejected") {
        throw profile.reason;
      }

      set({
        user: profile.value.user,
        github: connection.status === "fulfilled" ? connection.value : get().github,
        status: "ready",
        error: null,
        loadedAt: Date.now(),
      });
    } catch (error) {
      set({ status: "error", error: errorMessage(error) });
    }
  },

  async refreshGithub() {
    try {
      set({ github: await fetchGithubConnection() });
    } catch (error) {
      set({ error: errorMessage(error) });
    }
  },

  setUser(user) {
    set({ user });
  },

  patchUser(patch) {
    const current = get().user;
    if (!current) return;
    set({ user: { ...current, ...patch } });
  },

  clear() {
    set({
      user: null,
      github: null,
      status: "idle",
      error: null,
      loadedAt: null,
    });
  },
}));

export function selectGithubConnected(state: UserState): boolean {
  return Boolean(state.github?.connected ?? state.user?.githubId);
}

export function selectGithubReady(state: UserState): boolean {
  return Boolean(state.github?.credentialsStored);
}
