import { apiFetch } from "@/lib/api/browser";
import type {
  GitHubAccount,
  GitHubBranch,
  GitHubConnection,
  GitHubRepositoryPage,
} from "./types";

export function fetchGithubConnection(): Promise<GitHubConnection> {
  return apiFetch<GitHubConnection>("/v1/github/connection");
}

export async function fetchGithubAccounts(): Promise<GitHubAccount[]> {
  const result = await apiFetch<{ data: GitHubAccount[] }>("/v1/github/accounts");
  return result.data;
}

export function fetchGithubRepositories(input: {
  owner?: string | null;
  query?: string | null;
  page?: number;
  perPage?: number;
} = {}): Promise<GitHubRepositoryPage> {
  const params = new URLSearchParams();
  if (input.owner) params.set("owner", input.owner);
  if (input.query) params.set("query", input.query);
  if (input.page !== undefined) params.set("page", String(input.page));
  if (input.perPage !== undefined) params.set("perPage", String(input.perPage));
  const query = params.toString();
  return apiFetch<GitHubRepositoryPage>(
    `/v1/github/repositories${query ? `?${query}` : ""}`,
  );
}

export async function fetchGithubBranches(
  owner: string,
  repository: string,
): Promise<GitHubBranch[]> {
  const result = await apiFetch<{ data: GitHubBranch[] }>(
    `/v1/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/branches`,
  );
  return result.data;
}
