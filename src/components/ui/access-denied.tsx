import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export function AccessDenied({
  title = "Access denied",
  description = "You do not have permission to view this page.",
  backHref,
  backLabel = "Go back",
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <main className="jetic-surface flex min-h-full items-center justify-center bg-[var(--jetic-well)] px-5 py-16">
      <div className="jetic-card flex w-full max-w-md flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-10 text-center">
        <ShieldAlert size={24} className="text-amber-300" />
        <h1 className="text-[15px] font-semibold text-white">{title}</h1>
        <p className="jetic-muted text-[12.5px] leading-5">{description}</p>
        {backHref && (
          <Link
            href={backHref}
            className="mt-1 inline-flex h-8 items-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            {backLabel}
          </Link>
        )}
      </div>
    </main>
  );
}
