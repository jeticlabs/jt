import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/ui/access-denied";
import { requireAuthContext } from "@/server/auth/session";
import {
  getMyPermissions,
  getOrganizationBySlug,
  resolveWorkspace,
} from "@/server/organizations";

import { SettingsClient } from "./settings-client";

export const instant = false;

export default async function TeamSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const context = await requireAuthContext();
  const workspace = await resolveWorkspace(context.token, workspaceId);

  if (!workspace) {
    notFound();
  }

  const [membership, permissions] = await Promise.all([
    getOrganizationBySlug(context.token, workspace.slug),
    getMyPermissions(context.token, workspace.id),
  ]);

  if (!permissions.permissions["workspace.settings.view"]) {
    return (
      <AccessDenied
        description="You do not have permission to view workspace settings."
        backHref={`/app/workspace/${encodeURIComponent(workspace.slug)}`}
        backLabel="Back to workspace"
      />
    );
  }

  return (
    <SettingsClient
      workspace={workspace}
      initialMembership={membership}
      initialPermissions={permissions}
    />
  );
}
