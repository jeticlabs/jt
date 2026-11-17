import { redirect } from "next/navigation";

import { BackendError, backendFetch } from "@/server/api/backend";
import { requireAuthContext } from "@/server/auth/session";

export const instant = false;

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function GitHubAppSetupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const installationId = first(params["installation_id"]);
  const state = first(params["state"]);

  if (!installationId || !state) {
    redirect("/app?github=error");
  }

  const context = await requireAuthContext();

  let workspaceSlug: string;
  try {
    const result = await backendFetch<{ workspaceSlug: string }>(
      "/v1/github/app/installations/complete",
      context.token,
      {
        method: "POST",
        body: JSON.stringify({ installationId, state }),
      },
    );
    workspaceSlug = result.workspaceSlug;
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      redirect("/sign-in");
    }
    redirect("/app?github=error");
  }

  redirect(
    `/app/workspace/${encodeURIComponent(workspaceSlug)}/integrations?github=connected`,
  );
}
