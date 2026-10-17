export default function WorkspaceSettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Preferences, integrations, and workspace config live in
        `features/settings`.
      </p>
    </div>
  );
}
