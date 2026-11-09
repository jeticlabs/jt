import { notFound } from "next/navigation";

import { AccessDenied } from "@/components/ui/access-denied";
import { BackendError } from "@/server/api/backend";
import { requireAuthContext } from "@/server/auth/session";
import {
  getMemberPermissions,
  getMyPermissions,
  listWorkspaceSandboxes,
  resolveWorkspace,
} from "@/server/organizations";

import { MemberPermissionsClient } from "./member-permissions-client";

export const instant = false;

export default async function MemberPermissionsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; memberId: string }>;
}) {
  const { workspaceId, memberId } = await params;
  const context = await requireAuthContext();
  const workspace = await resolveWorkspace(context.token, workspaceId);

  if (!workspace) {
    notFound();
  }

  const myPermissions = await getMyPermissions(context.token, workspace.id);
  if (
    myPermissions.permissions["workspace.members.view"] !== true ||
    myPermissions.permissions["workspace.permissions.view"] !== true
  ) {
    return (
      <AccessDenied
        description="You do not have permission to view or edit member permissions."
        backHref={`/app/workspace/${encodeURIComponent(workspace.slug)}/members`}
        backLabel="Back to members"
      />
    );
  }

  let permissions;
  try {
    permissions = await getMemberPermissions(
      context.token,
      workspace.id,
      memberId,
    );
  } catch (error) {
    if (error instanceof BackendError && error.isNotFound) {
      notFound();
    }
    if (error instanceof BackendError && error.isForbidden) {
      return (
        <AccessDenied
          description={error.message}
          backHref={`/app/workspace/${encodeURIComponent(workspace.slug)}/members`}
          backLabel="Back to members"
        />
      );
    }
    throw error;
  }

  const sandboxes = await listWorkspaceSandboxes(
    context.token,
    workspace.id,
  ).catch((error: unknown) => {
    if (error instanceof BackendError && error.isForbidden) return [];
    throw error;
  });

  return (
    <MemberPermissionsClient
      organizationId={workspace.id}
      workspaceSlug={workspace.slug}
      memberId={memberId}
      initialPermissions={permissions}
      sandboxes={sandboxes}
    />
  );
}
