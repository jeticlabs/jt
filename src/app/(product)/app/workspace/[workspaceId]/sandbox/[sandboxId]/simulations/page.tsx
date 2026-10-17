import Link from "next/link";
import { Suspense } from "react";

export default function SimulationsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <Simulations params={params} />
    </Suspense>
  );
}

async function Simulations({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Simulations</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Creation, history, results, and replay controls live in
        `features/simulation`.
      </p>
      <Link
        href={`/app/workspaces/${workspaceId}/simulations/demo-simulation`}
        className="w-fit rounded-full border border-black/[.08] px-4 py-2 text-sm dark:border-white/[.12]"
      >
        Open demo simulation →
      </Link>
    </div>
  );
}
