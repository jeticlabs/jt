"use client";

export function ErrorState({
  title = "Something went wrong",
  body,
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/[.04] px-6 py-10 text-center">
      <h2 className="text-base font-semibold">{title}</h2>
      {body ? <p className="max-w-sm text-sm text-zinc-600">{body}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-black/[.08] px-4 py-1.5 text-sm"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
