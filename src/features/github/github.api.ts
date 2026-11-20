import { apiFetch } from "@/lib/api/browser";
import type {
  GitHubAccount,
  GitHubAppConnection,
  GitHubBranch,
  GitHubConnection,
  GitHubRepositoryPage,
} from "./types";

export function fetchGithubConnection(): Promise<GitHubConnection> {
  return apiFetch<GitHubConnection>("/v1/github/connection");
}

export function fetchGithubAppConnection(
  workspaceId: string,
): Promise<GitHubAppConnection> {
  return apiFetch<GitHubAppConnection>(
    `/v1/github/app/connection?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
}

export function startGithubAppInstallation(
  workspaceId: string,
): Promise<{ url: string }> {
  return apiFetch<{ url: string }>("/v1/github/app/installations/start", {
    method: "POST",
    body: { workspaceId },
  });
}

export function disconnectGithubAppInstallation(
  workspaceId: string,
  installationId: string,
): Promise<void> {
  return apiFetch<void>(
    `/v1/github/app/installations/${encodeURIComponent(installationId)}?workspaceId=${encodeURIComponent(workspaceId)}`,
    { method: "DELETE" },
  );
}

export function uninstallGithubAppInstallation(
  workspaceId: string,
  installationId: string,
): Promise<void> {
  return apiFetch<void>(
    `/v1/github/app/installations/${encodeURIComponent(installationId)}/github?workspaceId=${encodeURIComponent(workspaceId)}`,
    { method: "DELETE" },
  );
}

export function syncGithubAppInstallations(
  workspaceId: string,
): Promise<{ connected: number; connection: GitHubAppConnection }> {
  return apiFetch<{ connected: number; connection: GitHubAppConnection }>(
    "/v1/github/app/installations/sync",
    { method: "POST", body: { workspaceId } },
  );
}

export async function fetchGithubAccounts(
  workspaceId: string,
): Promise<GitHubAccount[]> {
  const result = await apiFetch<{ data: GitHubAccount[] }>(
    `/v1/github/accounts?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  return result.data;
}

export function fetchGithubRepositories(
  workspaceId: string,
  input: {
    owner?: string | null;
    query?: string | null;
    page?: number;
    perPage?: number;
  } = {},
): Promise<GitHubRepositoryPage> {
  const params = new URLSearchParams({ workspaceId });
  if (input.owner) params.set("owner", input.owner);
  if (input.query) params.set("query", input.query);
  if (input.page !== undefined) params.set("page", String(input.page));
  if (input.perPage !== undefined) params.set("perPage", String(input.perPage));
  return apiFetch<GitHubRepositoryPage>(
    `/v1/github/repositories?${params.toString()}`,
  );
}

export async function fetchGithubBranches(
  workspaceId: string,
  owner: string,
  repository: string,
): Promise<GitHubBranch[]> {
  const result = await apiFetch<{ data: GitHubBranch[] }>(
    `/v1/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/branches?workspaceId=${encodeURIComponent(workspaceId)}`,
  );
  return result.data;
}
