import { redirect } from "next/navigation";

import { inter } from "@/app/fonts";
import { GithubAutoReconnect } from "@/components/providers/github-auto-reconnect";
import { StateProvider } from "@/context/providers/state-provider";
import { WorkspaceChrome } from "@/components/ui/WorkspaceChrome/workspace-chrome";
import { requireAuthContext } from "@/server/auth/session";
import {
  findWorkspaceById,
  getMyPermissions,
  listWorkspaces,
  resolveWorkspace,
} from "@/server/organizations";

// Authenticated shell is request-bound (session enforced backend-side),
// so allow blocking navigation here instead of forcing a static shell.
export const instant = false;

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const context = await requireAuthContext();
  const allWorkspaces = await listWorkspaces(context.token);

  // URLs use the workspace slug. Older links may still carry the immutable
  // id, so resolve those once and redirect to the canonical slug.
  const workspace =
    (await resolveWorkspace(context.token, workspaceId)) ??
    (await findWorkspaceById(context.token, workspaceId));

  if (!workspace) {
    // Authenticated deep links with an unknown slug should land on the user's
    // current workspace instead of a dead end. The active organization from
    // the session wins; otherwise use the newest workspace they belong to.
    const fallback =
      (context.session.activeOrganizationId
        ? allWorkspaces.find(
            (item) => item.id === context.session.activeOrganizationId,
          )
        : undefined) ?? allWorkspaces[0];

    if (fallback) {
      redirect(`/app/workspace/${encodeURIComponent(fallback.slug)}`);
    }
    redirect("/app/onboarding");
  }

  if (workspace.slug !== workspaceId) {
    redirect(`/app/workspace/${encodeURIComponent(workspace.slug)}`);
  }

  const permissions = await getMyPermissions(context.token, workspace.id);

  return (
    <div className={`${inter.className} h-full w-full bg-[#111111]`}>
      <StateProvider>
        <GithubAutoReconnect />
        <WorkspaceChrome
          user={{
            name: context.user.name,
            email: context.user.email,
            image: context.user.image,
          }}
          workspace={workspace}
          workspaces={allWorkspaces}
          permissions={permissions.permissions}
        >
          {children}
        </WorkspaceChrome>
      </StateProvider>
    </div>
  );
}
