export default function EnvironmentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold tracking-tight">Environments</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Environment config and safe secret references live in
        `features/environment`. Never expose private keys via NEXT_PUBLIC_.
      </p>
    </div>
  );
}
