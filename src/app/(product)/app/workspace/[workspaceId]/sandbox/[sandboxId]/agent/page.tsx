import { Suspense } from "react";
import { AgentWorkspace } from "@/features/agent";

export default function AgentPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading agent…</p>}>
      <AgentLoader params={params} />
    </Suspense>
  );
}

async function AgentLoader({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  // Keep app/ thin: render the feature-owned workspace.
  return <AgentWorkspace workspaceId={workspaceId} />;
}
