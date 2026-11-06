import { notFound } from "next/navigation";

import { requireAuthContext } from "@/server/auth/session";
import {
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

  const [members, invitations] = await Promise.all([
    listWorkspaceMembers(context.token, workspace.id),
    listPendingInvitations(context.token, workspace.id),
  ]);

  return (
    <MembersClient
      organizationId={workspace.id}
      currentUserId={context.user.id}
      role={workspace.role}
      members={members}
      invitations={invitations}
    />
  );
}
