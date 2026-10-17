export default function FeaturesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Features</h1>
      <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
        Simulations, agent-assisted workflows, repository indexing, and
        environment-safe configuration — each owned by its own feature module.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {[
          "Simulation runs with history and replay",
          "Agent workspace with approvals",
          "Repository connection and indexing status",
          "Environment-scoped secrets and settings",
        ].map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-black/[.08] p-5 text-sm dark:border-white/[.08]"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
