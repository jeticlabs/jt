export default function PricingPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Start free. Upgrade when simulations and agent runs become critical
        path.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[.08] p-6 dark:border-white/[.08]">
          <h2 className="font-semibold">Starter</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            For side projects and evaluation.
          </p>
        </div>
        <div className="rounded-2xl border border-black/[.08] p-6 dark:border-white/[.08]">
          <h2 className="font-semibold">Team</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            For workspaces with shared environments and approvals.
          </p>
        </div>
      </div>
    </div>
  );
}
