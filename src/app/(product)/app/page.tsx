import { redirect } from "next/navigation";

import { requireAuthContext } from "@/server/auth/session";
import { listWorkspaces } from "@/server/organizations";

// The destination depends on the session and its workspaces.
export const instant = false;

export default async function ProductRootPage() {
  const context = await requireAuthContext();
  const workspaces = await listWorkspaces(context.token);

  if (workspaces.length === 0) {
    redirect("/app/onboarding");
  }

  const active =
    workspaces.find((workspace) => workspace.id === context.session.activeOrganizationId) ??
    workspaces[0];

  redirect(`/app/workspace/${encodeURIComponent(active.slug)}`);
}
