import Link from "next/link";
import { redirect } from "next/navigation";

import { JeticIcon } from "@/components/jetic-icon";
import { BackendError, backendFetch } from "@/server/api/backend";
import { getAuthContext } from "@/server/auth/session";
import { listWorkspaces } from "@/server/organizations";

export const instant = false;

function first(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function setupPath(
  params: Record<string, string | string[] | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, item);
    } else if (value !== undefined) {
      search.set(key, value);
    }
  }
  const query = search.toString();
  return `/app/integrations/github${query ? `?${query}` : ""}`;
}

function SetupMessage({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <main className="jetic-surface flex min-h-screen items-center justify-center px-4">
      <div className="jetic-card flex w-full max-w-[460px] flex-col items-center rounded-xl bg-[var(--jetic-bg)] px-6 py-8 text-center">
        <JeticIcon />
        <h1 className="mt-6 text-[20px] font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="jetic-muted mt-2 text-[13px] leading-6">{description}</p>
        <Link href={href} className="jetic-btn-light mt-6 w-full">
          {action}
        </Link>
      </div>
    </main>
  );
}

export default async function GitHubAppSetupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const installationId = first(params["installation_id"]);
  const state = first(params["state"]);

  const context = await getAuthContext();
  if (!context) {
    const next = setupPath(params);
    redirect(`/sign-in?next=${encodeURIComponent(next)}`);
  }

  if (!installationId) {
    redirect("/app?github=error");
  }

  const workspaces = await listWorkspaces(context.token);
  const workspace =
    workspaces.find(
      (entry) => entry.id === context.session.activeOrganizationId,
    ) ?? workspaces[0];
  const workspaceHref = workspace
    ? `/app/workspace/${encodeURIComponent(workspace.slug)}/integrations`
    : "/app";

  // A direct install from GitHub, or a setup redirect that lost its state,
  // has no signed Jetic state. Verify the installation through the GitHub App
  // API and attach only an installation that belongs to this signed-in user.
  if (!state) {
    let syncError: string | null = null;
    if (workspace) {
      try {
        const result = await backendFetch<{ connected: number }>(
          "/v1/github/app/installations/sync",
          context.token,
          {
            method: "POST",
            body: JSON.stringify({ workspaceId: workspace.id }),
          },
        );
        if (result.connected > 0) {
          redirect(`${workspaceHref}?github=connected`);
        }
      } catch (error) {
        if (error instanceof BackendError && error.isUnauthorized) {
          redirect(`/sign-in?next=${encodeURIComponent(setupPath(params))}`);
        }
        syncError =
          error instanceof BackendError && error.status === 503
            ? "The GitHub App is not configured on the API deployment. Add GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_SLUG, then restart the API."
            : error instanceof Error
              ? error.message
              : "The installation could not be synced.";
      }
    }

    return (
      <SetupMessage
        title={syncError ? "Could not sync GitHub" : "GitHub is installed"}
        description={
          syncError ??
          (workspace
            ? "Jetic could not verify which workspace started this installation. Open your workspace integrations page and click “Sync existing installation”."
            : "Create or join a workspace, then open its integrations page and connect the GitHub App.")
        }
        href={workspaceHref}
        action={workspace ? "Open GitHub integration" : "Open Jetic"}
      />
    );
  }

  try {
    const result = await backendFetch<{ workspaceSlug: string }>(
      "/v1/github/app/installations/complete",
      context.token,
      {
        method: "POST",
        body: JSON.stringify({ installationId, state }),
      },
    );
    redirect(
      `/app/workspace/${encodeURIComponent(result.workspaceSlug)}/integrations?github=connected`,
    );
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      redirect(`/sign-in?next=${encodeURIComponent(setupPath(params))}`);
    }

    const detail =
      error instanceof BackendError && error.status === 503
        ? "The GitHub App is not configured on the API deployment. Add GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, and GITHUB_APP_SLUG, then restart the API."
        : error instanceof Error
          ? error.message
          : "The GitHub App connection could not be completed.";

    return (
      <SetupMessage
        title="Could not finish connecting GitHub"
        description={detail}
        href={workspaceHref}
        action="Back to GitHub integration"
      />
    );
  }
}
