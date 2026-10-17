export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-black/[.12] px-6 py-10 text-center dark:border-white/[.12]">
      <h2 className="text-base font-semibold">{title}</h2>
      {body ? (
        <p className="max-w-sm text-sm text-zinc-600 dark:text-zinc-400">
          {body}
        </p>
      ) : null}
      {action}
    </div>
  );
}
