import { redirect } from "next/navigation";

import { OnboardingClient } from "./onboarding-client";
import { requireAuthContext } from "@/server/auth/session";
import { listWorkspaces } from "@/server/organizations";

export const instant = false;

export default async function OnboardingPage() {
  const context = await requireAuthContext();
  const workspaces = await listWorkspaces(context.token);

  // Onboarding is only for accounts without a workspace. Returning users go
  // straight to the workspace they were last using.
  if (workspaces.length > 0) {
    const active =
      workspaces.find((workspace) => workspace.id === context.session.activeOrganizationId) ??
      workspaces[0];
    if (active) {
      redirect(`/app/workspace/${encodeURIComponent(active.slug)}`);
    }
  }

  return <OnboardingClient />;
}
