import { notFound } from "next/navigation";

import { requireAuthContext } from "@/server/auth/session";
import { resolveWorkspace } from "@/server/organizations";

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

  return <SettingsClient workspace={workspace} />;
}
