import { Suspense } from "react";

export default function RepositoriesPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <Repositories params={params} />
    </Suspense>
  );
}

async function Repositories({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Workspace {workspaceId} — connection, branch info, indexing status,
        and permissions live in `features/repository`.
      </p>
      <div className="rounded-2xl border border-dashed border-black/[.12] p-6 text-sm dark:border-white/[.12]">
        No repository connected yet. (Placeholder)
      </div>
    </div>
  );
}
