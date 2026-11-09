import { notFound } from "next/navigation";

import { requireAuthContext } from "@/server/auth/session";
import {
  getMyPermissions,
  listPendingInvitations,
  listWorkspaceMembers,
  resolveWorkspace,
} from "@/server/organizations";

import { MembersClient } from "./members-client";

export const instant = false;

export default async function MembersPage({
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

  const [members, invitations, permissions] = await Promise.all([
    listWorkspaceMembers(context.token, workspace.id),
    listPendingInvitations(context.token, workspace.id),
    getMyPermissions(context.token, workspace.id),
  ]);

  return (
    <MembersClient
      organizationId={workspace.id}
      workspaceSlug={workspace.slug}
      plan={workspace.plan}
      currentUserId={context.user.id}
      role={workspace.role}
      members={members}
      invitations={invitations}
      permissions={permissions.permissions}
    />
  );
}
