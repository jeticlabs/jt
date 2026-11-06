import { cn } from "@/lib/utils";
import { SidebarShell } from "@/components/ui/Sidebar/sidebar-shell";

/**
 * Shared shimmer skeleton primitives.
 *
 * The shimmer is a CSS background animation (see `globals.css`) so it works in
 * both server-rendered loading files and client components without a motion
 * dependency.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("jetic-shimmer rounded-lg", className ?? "h-4 w-full")}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-2.5 rounded-full",
            index === lines - 1 && lines > 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("jetic-shimmer shrink-0 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return <Skeleton className={cn("h-8 w-24 rounded-md", className)} />;
}

/* -------------------------------------------------------------------------- */
/*                              Product chrome                                */
/* -------------------------------------------------------------------------- */

export function ToolbarSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={cn("border-b border-white/10 bg-[#0a0a0a]", className)}
    >
      <div className="flex items-center gap-2 px-2 py-1.5 sm:gap-4 sm:px-3">
        <Skeleton className="h-7 w-8 rounded-xl" />
        <Skeleton className="hidden h-4 w-14 rounded sm:block" />
        <Skeleton className="h-4 w-16 rounded sm:w-24" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="hidden h-8 w-28 rounded-lg sm:block" />
          <Skeleton className="h-7 w-10 rounded-full sm:w-44" />
        </div>
      </div>
      <div className="flex items-center gap-4 overflow-hidden border-t border-white/10 px-2 py-2">
        {["w-14", "w-16", "w-14", "w-20", "w-14"].map((width, index) => (
          <Skeleton
            key={`${width}-${index}`}
            className={cn("h-2.5 shrink-0 rounded-full", width)}
          />
        ))}
      </div>
      <span className="sr-only">Loading toolbar</span>
    </div>
  );
}

export function SidebarSkeleton({ collapsed = false }: { collapsed?: boolean }) {
  const widths = ["w-20", "w-24", "w-16", "w-24", "w-20", "w-16", "w-20", "w-16"];

  return (
    <SidebarShell collapsed={collapsed} aria-label="Loading sidebar">
      <div className="flex flex-1 flex-col gap-1 p-2">
        {!collapsed && <Skeleton className="mb-2 h-9 w-full rounded-lg" />}
        {widths.map((width, index) => (
          <div
            key={width + index}
            className={cn(
              "flex h-9 items-center rounded-lg",
              collapsed ? "justify-center" : "gap-2.5 px-3",
            )}
          >
            <Skeleton className="h-4 w-4 rounded" />
            {!collapsed && <Skeleton className={cn("h-2.5 rounded-full", width)} />}
          </div>
        ))}
      </div>
      <span className="sr-only">Loading sidebar</span>
    </SidebarShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Pages                                     */
/* -------------------------------------------------------------------------- */

export function WorkspaceContentSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <Skeleton className="h-7 w-40 rounded" />
        <Skeleton className="mt-2 h-3 w-64 rounded-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="h-36 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-64 rounded-lg" />
      </div>
      <span className="sr-only">Loading workspace</span>
    </div>
  );
}

export function WorkspaceShellSkeleton() {
  return (
    <div className="jetic-surface flex h-full min-h-0 w-full flex-col">
      <ToolbarSkeleton className="shrink-0" />
      <div className="flex min-h-0 flex-1">
        <SidebarSkeleton />
        <div className="min-w-0 flex-1 overflow-y-auto">
          <WorkspaceContentSkeleton />
        </div>
      </div>
      <span className="sr-only">Loading workspace</span>
    </div>
  );
}

export function MembersPageSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <Skeleton className="h-7 w-32 rounded" />
        <Skeleton className="mt-2 h-3 w-56 rounded-full" />

        <div className="jetic-card mt-5 rounded-lg bg-[var(--jetic-bg)]">
          <div className="p-5">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="mt-2 h-3 w-3/4 rounded-full" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <Skeleton className="h-2.5 w-20 rounded-full" />
                <Skeleton className="mt-2 h-9 w-full rounded-md" />
              </div>
              <div>
                <Skeleton className="h-2.5 w-10 rounded-full" />
                <Skeleton className="mt-2 h-9 w-full rounded-md" />
              </div>
            </div>
            <Skeleton className="mt-3 h-8 w-28 rounded-md" />
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3">
            <Skeleton className="h-2.5 w-64 rounded-full" />
            <SkeletonButton className="w-16" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6 border-b border-white/10 py-2">
          <Skeleton className="h-3 w-24 rounded-full" />
          <Skeleton className="h-3 w-32 rounded-full" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Skeleton className="h-9 min-w-[150px] flex-1 rounded-md" />
          <Skeleton className="h-9 w-[125px] rounded-md" />
          <Skeleton className="h-9 w-[110px] rounded-md" />
          <Skeleton className="h-9 w-[110px] rounded-md" />
        </div>

        <div className="jetic-card mt-3 rounded-lg bg-[var(--jetic-bg)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
          {[0, 1].map((row) => (
            <div
              key={row}
              className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0"
            >
              <Skeleton className="h-3.5 w-3.5 rounded-[3px]" />
              <SkeletonCircle size={40} />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-40 rounded-full" />
                <Skeleton className="mt-2 h-2.5 w-56 rounded-full" />
              </div>
              <Skeleton className="h-3 w-12 rounded-full" />
              <Skeleton className="h-3 w-8 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading members</span>
    </div>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Skeleton className="h-7 w-52 rounded" />
            <Skeleton className="mt-2 h-3 w-72 rounded-full" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {[0, 1, 2, 3].map((card) => (
            <section key={card} className="jetic-card rounded-lg bg-[var(--jetic-bg)]">
              <div className="p-5">
                <Skeleton className="h-5 w-40 rounded" />
                <Skeleton className="mt-2 h-3 w-3/4 rounded-full" />
                <Skeleton className="mt-1.5 h-3 w-1/2 rounded-full" />
                <div className="mt-4">
                  {card === 2 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-[74px] rounded-lg" />
                      <Skeleton className="h-[74px] rounded-lg" />
                    </div>
                  ) : card === 3 ? (
                    <Skeleton className="h-9 w-64 rounded-md" />
                  ) : (
                    <Skeleton className="h-9 w-full max-w-[320px] rounded-md" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3">
                <Skeleton className="h-2.5 w-40 rounded-full" />
                <SkeletonButton className="w-20" />
              </div>
            </section>
          ))}
        </div>
      </div>
      <span className="sr-only">Loading workspace settings</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Account dialog panels                            */
/* -------------------------------------------------------------------------- */

export function AccountRowsSkeleton({
  rows = 2,
  label = "Loading",
}: {
  rows?: number;
  label?: string;
}) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-white/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
        >
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="min-w-0 flex-1">
            <Skeleton className="h-3 w-1/2 rounded-full" />
            <Skeleton className="mt-2 h-2.5 w-2/3 rounded-full" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function AccountDetailsSkeleton({
  rows = 4,
  label = "Loading account details",
}: {
  rows?: number;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="flex flex-col divide-y divide-white/[0.06]"
    >
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0"
        >
          <Skeleton className="h-2.5 w-20 rounded-full" />
          <Skeleton className="h-2.5 w-32 rounded-full" />
        </div>
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function AccountPanelSkeleton({
  rows = 3,
  label = "Loading account settings",
}: {
  rows?: number;
  label?: string;
}) {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-4">
      <section className="jetic-card rounded-lg bg-[var(--jetic-recess)]">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <SkeletonCircle size={40} />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="mt-2 h-2.5 w-56 rounded-full" />
            </div>
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="mt-2 h-9 w-full rounded-md" />
            </div>
            <div>
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="mt-2 h-9 w-full rounded-md" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <SkeletonButton className="w-24" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-4 py-2.5">
          <Skeleton className="h-2.5 w-40 rounded-full" />
          <SkeletonButton className="w-24" />
        </div>
      </section>

      <section className="jetic-card rounded-lg bg-[var(--jetic-recess)]">
        <div className="border-b border-white/10 px-4 py-3">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="mt-2 h-2.5 w-2/3 rounded-full" />
        </div>
        <div className="px-4">
          {Array.from({ length: rows }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-b border-white/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-3 w-1/2 rounded-full" />
                <Skeleton className="mt-2 h-2.5 w-2/3 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </section>
      <span className="sr-only">{label}</span>
    </div>
  );
}
