import { apiFetch } from "@/lib/api/browser";
import type { RepositoryAlert } from "./types";

export async function fetchRepositoryAlerts(): Promise<RepositoryAlert[]> {
  const result = await apiFetch<{ data: RepositoryAlert[] }>(
    "/v1/github/repository-alerts",
  );
  return result.data;
}

export function dismissRepositoryAlert(alertId: string): Promise<void> {
  return apiFetch<void>(
    `/v1/github/repository-alerts/${encodeURIComponent(alertId)}/dismiss`,
    { method: "POST" },
  );
}

export function markRepositoryAlertImported(
  repositoryId: string,
): Promise<void> {
  return apiFetch<void>("/v1/github/repository-alerts/imported", {
    method: "POST",
    body: { repositoryId },
  });
}
