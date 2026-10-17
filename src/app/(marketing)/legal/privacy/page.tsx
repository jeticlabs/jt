export default function PrivacyPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Jetic processes repository metadata and simulation data to provide the
        workspace. Secrets stay server-side and are never exposed via public
        environment variables.
      </p>
    </div>
  );
}
