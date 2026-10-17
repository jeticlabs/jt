import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-lg bg-black/[.06] dark:bg-white/[.08]",
        className ?? "h-4 w-full"
      )}
    />
  );
}
