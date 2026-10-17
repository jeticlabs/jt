import { Suspense } from "react";

export default function SimulationDetailPage({
  params,
}: {
  params: Promise<{ workspaceId: string; simulationId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <Detail params={params} />
    </Suspense>
  );
}

async function Detail({
  params,
}: {
  params: Promise<{ workspaceId: string; simulationId: string }>;
}) {
  const { workspaceId, simulationId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        Simulation {simulationId}
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Workspace {workspaceId} — request/response inspection and replay
        controls belong to `features/simulation`.
      </p>
    </div>
  );
}
