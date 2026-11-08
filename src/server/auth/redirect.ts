import { listWorkspaces } from "@/server/organizations";
import type { AuthContext } from "./session";

/**
 * Returns the authenticated user's current workspace. The session's active
 * organization wins; otherwise fall back to the most recently created
 * workspace. Users without a workspace are sent through onboarding.
 */
export async function currentWorkspacePath(context: AuthContext): Promise<string> {
  const workspaces = await listWorkspaces(context.token);
  const activeId = context.session.activeOrganizationId;
  const workspace =
    (activeId ? workspaces.find((item) => item.id === activeId) : undefined) ??
    workspaces[0];

  return workspace
    ? `/app/workspace/${encodeURIComponent(workspace.slug)}`
    : "/app/onboarding";
}
