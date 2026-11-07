"use client";

import { create } from "zustand";

import { errorMessage } from "@/lib/api/browser";
import {
  fetchGithubAccounts,
  fetchGithubBranches,
  fetchGithubRepositories,
} from "@/features/github/github.api";
import type {
  GitHubAccount,
  GitHubBranch,
  GitHubRepository,
} from "@/features/github/types";
import type { AsyncStatus } from "../state/types";

interface RepositoryPageState {
  readonly page: number;
  readonly hasMore: boolean;
}

interface GithubState {
  readonly accounts: GitHubAccount[];
  readonly accountsStatus: AsyncStatus;
  readonly accountsError: string | null;

  readonly repositories: GitHubRepository[];
  readonly repositoriesStatus: AsyncStatus;
  readonly repositoriesError: string | null;
  readonly repositoriesLoadingMore: boolean;
  readonly repositoryOwner: string | null;
  readonly repositoryQuery: string;
  readonly repositoryPage: RepositoryPageState;
  readonly repositoryRequest: number;

  readonly branches: Record<string, GitHubBranch[]>;
  readonly branchStatus: Record<string, AsyncStatus>;
  readonly branchError: Record<string, string | null>;

  loadAccounts: (options?: { force?: boolean }) => Promise<void>;
  loadRepositories: (options?: {
    owner?: string | null;
    query?: string | null;
    page?: number;
    append?: boolean;
    force?: boolean;
  }) => Promise<void>;
  loadBranches: (
    owner: string,
    repository: string,
    options?: { force?: boolean },
  ) => Promise<void>;
  resetRepositories: () => void;
  reset: () => void;
}

function branchKey(owner: string, repository: string): string {
  return `${owner}/${repository}`.toLowerCase();
}

const initialState = {
  accounts: [] as GitHubAccount[],
  accountsStatus: "idle" as AsyncStatus,
  accountsError: null as string | null,
  repositories: [] as GitHubRepository[],
  repositoriesStatus: "idle" as AsyncStatus,
  repositoriesError: null as string | null,
  repositoriesLoadingMore: false,
  repositoryOwner: null as string | null,
  repositoryQuery: "",
  repositoryPage: { page: 1, hasMore: false },
  repositoryRequest: 0,
  branches: {} as Record<string, GitHubBranch[]>,
  branchStatus: {} as Record<string, AsyncStatus>,
  branchError: {} as Record<string, string | null>,
};

export const useGithubStore = create<GithubState>((set, get) => ({
  ...initialState,

  async loadAccounts(options = {}) {
    const { accountsStatus } = get();
    if (!options.force && (accountsStatus === "loading" || accountsStatus === "ready")) {
      return;
    }

    set({ accountsStatus: "loading", accountsError: null });
    try {
      set({
        accounts: await fetchGithubAccounts(),
        accountsStatus: "ready",
        accountsError: null,
      });
    } catch (error) {
      set({ accountsStatus: "error", accountsError: errorMessage(error) });
    }
  },

  async loadRepositories(options = {}) {
    const {
      repositoryRequest,
      repositoryOwner,
      repositoryQuery,
      repositories,
      repositoriesLoadingMore,
    } = get();
    const append = options.append ?? false;
    if (append && repositoriesLoadingMore) return;

    const request = repositoryRequest + 1;
    const owner = options.owner === undefined ? repositoryOwner : options.owner;
    const query = options.query === undefined ? repositoryQuery : options.query;
    const page = options.page ?? 1;

    set({
      repositoryRequest: request,
      repositoryOwner: owner,
      repositoryQuery: query ?? "",
      repositoriesLoadingMore: append,
      ...(append
        ? {}
        : {
            repositories: [],
            repositoriesStatus: "loading" as AsyncStatus,
            repositoriesError: null,
          }),
    });

    try {
      const result = await fetchGithubRepositories({
        owner,
        query,
        page,
        perPage: 100,
      });
      if (get().repositoryRequest !== request) return;

      set({
        repositories: append
          ? [...repositories, ...result.data]
          : [...result.data],
        repositoriesStatus: "ready",
        repositoriesError: null,
        repositoriesLoadingMore: false,
        repositoryPage: {
          page: result.page.page,
          hasMore: result.page.hasMore,
        },
      });
    } catch (error) {
      if (get().repositoryRequest !== request) return;
      set({
        repositoriesStatus: "error",
        repositoriesError: errorMessage(error),
        repositoriesLoadingMore: false,
      });
    }
  },

  async loadBranches(owner, repository, options = {}) {
    const key = branchKey(owner, repository);
    const status = get().branchStatus[key];
    if (!options.force && (status === "loading" || status === "ready")) return;

    set((state) => ({
      branchStatus: { ...state.branchStatus, [key]: "loading" },
      branchError: { ...state.branchError, [key]: null },
    }));

    try {
      const branches = await fetchGithubBranches(owner, repository);
      set((state) => ({
        branches: { ...state.branches, [key]: branches },
        branchStatus: { ...state.branchStatus, [key]: "ready" },
        branchError: { ...state.branchError, [key]: null },
      }));
    } catch (error) {
      set((state) => ({
        branchStatus: { ...state.branchStatus, [key]: "error" },
        branchError: { ...state.branchError, [key]: errorMessage(error) },
      }));
    }
  },

  resetRepositories() {
    set((state) => ({
      repositories: [],
      repositoriesStatus: "idle",
      repositoriesError: null,
      repositoriesLoadingMore: false,
      repositoryOwner: null,
      repositoryQuery: "",
      repositoryPage: { page: 1, hasMore: false },
      repositoryRequest: state.repositoryRequest + 1,
    }));
  },

  reset() {
    set({ ...initialState });
  },
}));
