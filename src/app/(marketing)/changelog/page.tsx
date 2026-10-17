export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
      <ul className="flex flex-col gap-4 text-sm">
        <li className="rounded-2xl border border-black/[.08] p-5 dark:border-white/[.08]">
          <strong>v0.1.0</strong> — Initial workspace, simulations, and agent
          skeleton.
        </li>
      </ul>
    </div>
  );
}
