import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/ui/access-denied";
import { requireAuthContext } from "@/server/auth/session";
import {
  getGitHubAppConnection,
  getMyPermissions,
  resolveWorkspace,
} from "@/server/organizations";

import { IntegrationsClient } from "./integrations-client";

export const instant = false;

export default async function IntegrationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ workspaceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { workspaceId } = await params;
  const query = await searchParams;
  const context = await requireAuthContext();
  const workspace = await resolveWorkspace(context.token, workspaceId);

  if (!workspace) {
    notFound();
  }

  const permissions = await getMyPermissions(context.token, workspace.id);
  if (!permissions.permissions["workspace.integrations.view"]) {
    return (
      <AccessDenied
        description="You do not have permission to view this workspace's integrations."
        backHref={`/app/workspace/${encodeURIComponent(workspace.slug)}`}
        backLabel="Back to workspace"
      />
    );
  }

  const connection = await getGitHubAppConnection(
    context.token,
    workspace.id,
  );
  const githubStatus = Array.isArray(query["github"])
    ? query["github"][0]
    : query["github"];

  return (
    <IntegrationsClient
      workspaceId={workspace.id}
      workspaceSlug={workspace.slug}
      initialConnection={connection}
      canManage={permissions.permissions["workspace.integrations.manage"] === true}
      githubStatus={githubStatus}
    />
  );
}
