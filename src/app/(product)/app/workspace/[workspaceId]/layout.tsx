import { notFound, redirect } from "next/navigation";

import { inter } from "@/app/fonts";
import { WorkspaceChrome } from "@/components/ui/WorkspaceChrome/workspace-chrome";
import { requireAuthContext } from "@/server/auth/session";
import {
  findWorkspaceById,
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
    notFound();
  }

  if (workspace.slug !== workspaceId) {
    redirect(`/app/workspace/${encodeURIComponent(workspace.slug)}`);
  }

  return (
    <div className={`${inter.className} h-full w-full bg-[#111111]`}>
      <WorkspaceChrome
        user={{ name: context.user.name, email: context.user.email }}
        workspace={workspace}
        workspaces={allWorkspaces}
      >
        {children}
      </WorkspaceChrome>
    </div>
  );
}
