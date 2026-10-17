"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-sm text-sm text-zinc-600">
          {error.message || "An unexpected error occurred."}
          {error.digest ? ` (Digest: ${error.digest})` : null}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
