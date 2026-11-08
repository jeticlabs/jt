"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  GitBranch,
  GitCommitHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";

import { listActivity, syncGithubActivity } from "@/features/activity/activity.api";
import type { ActivityEvent } from "@/features/activity/types";
import { useActivityStream } from "@/features/activity/use-activity-stream";
import { listSandboxes } from "@/features/sandbox/sandbox.api";
import type { Sandbox } from "@/features/sandbox/types";
import { resolveWorkspaceBySlug } from "@/features/workspace/api";
import type { PageMeta } from "@/features/workspace/types";
import { errorMessage } from "@/lib/api/browser";

type LoadStatus = "loading" | "ready" | "error";
type Filter = "all" | "runtime" | "repository" | "model";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All activity" },
  { id: "runtime", label: "Runtime" },
  { id: "repository", label: "Repository" },
  { id: "model", label: "Models" },
];

function metadataOf(event: ActivityEvent): Record<string, unknown> {
  if (
    event.metadata !== null &&
    typeof event.metadata === "object" &&
    !Array.isArray(event.metadata)
  ) {
    return event.metadata as Record<string, unknown>;
  }
  return {};
}

function textMeta(metadata: Record<string, unknown>, key: string): string | null {
  const value = metadata[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function formatRelative(value: string): string {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

type DisplayStatus = "ready" | "error" | "building" | "queued";

function statusOf(event: ActivityEvent): DisplayStatus {
  const metadata = metadataOf(event);
  const metaStatus = textMeta(metadata, "status")?.toLowerCase();
  if (metaStatus === "error" || metaStatus === "failed") return "error";
  if (metaStatus === "provisioning" || metaStatus === "queued") return "building";

  const type = event.type.toLowerCase();
  if (type.includes("fail") || type.includes("error")) return "error";
  if (type.includes("provision") || type.includes("start") || type.includes("queued")) {
    return "building";
  }
  if (type.includes("stopped") || type.includes("archive")) return "queued";
  return "ready";
}

const STATUS_COPY: Record<DisplayStatus, { label: string; dot: string; text: string }> = {
  ready: { label: "Ready", dot: "bg-emerald-400", text: "text-emerald-300" },
  error: { label: "Error", dot: "bg-red-400", text: "text-red-300" },
  building: { label: "Building", dot: "bg-amber-400", text: "text-amber-300" },
  queued: { label: "Queued", dot: "bg-[var(--jetic-faint)]", text: "text-[var(--jetic-muted)]" },
};

function filterMatches(event: ActivityEvent, filter: Filter): boolean {
  if (filter === "all") return true;
  if (filter === "runtime") return event.source === "sandbox";
  if (filter === "repository") return event.source === "github";
  return event.source === "scanner" || event.type.startsWith("api.");
}

function eventProject(
  event: ActivityEvent,
  sandboxes: Record<string, Sandbox>,
  workspaceSlug: string,
): { name: string; href: string | null; icon: ReactNode } {
  const metadata = metadataOf(event);
  const sandbox = event.sandboxId ? sandboxes[event.sandboxId] : undefined;
  const name =
    sandbox?.name ??
    textMeta(metadata, "sandboxSlug") ??
    (event.source === "github" ? "Repository" : event.source);
  const href = sandbox
    ? `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`
    : null;

  return {
    name,
    href,
    icon: event.source === "github" ? <GitHubIcon size={13} /> : <Activity size={13} />,
  };
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={index} className="border-b border-white/[0.05]">
          {Array.from({ length: 8 }).map((__, cell) => (
            <td key={cell} className="px-4 py-3">
              <span
                className="jetic-shimmer block h-2.5 rounded-full"
                style={{ width: `${45 + ((index + cell) * 11) % 50}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function WorkspaceActivityPage() {
  const params = useParams<{ workspaceId?: string | string[] }>();
  const router = useRouter();
  const workspaceSlug = Array.isArray(params?.workspaceId)
    ? (params.workspaceId[0] ?? "")
    : (params?.workspaceId ?? "");

  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [sandboxes, setSandboxes] = useState<Record<string, Sandbox>>({});
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [page, setPage] = useState<PageMeta>({ nextCursor: null, hasMore: false });
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [loadingMore, setLoadingMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!workspaceSlug) return;
    let cancelled = false;

    void (async () => {
      setStatus("loading");
      setError(null);
      try {
        const membership = await resolveWorkspaceBySlug(workspaceSlug);

        // Best-effort commit sync so pushes appear even when the GitHub
        // webhook is not configured yet. Throttled to avoid hammering GitHub.
        try {
          const syncKey = `jetic:activity-sync:${membership.organization.id}`;
          const lastSync = Number(window.sessionStorage.getItem(syncKey) ?? 0);
          if (Date.now() - lastSync > 60_000) {
            await syncGithubActivity(membership.organization.id);
            window.sessionStorage.setItem(syncKey, String(Date.now()));
          }
        } catch {
          // Commit sync is optional; the activity list is still authoritative.
        }

        const [sandboxPage, activityPage] = await Promise.all([
          listSandboxes(membership.organization.id, { limit: 100 }),
          listActivity(membership.organization.id, { limit: 100 }),
        ]);
        if (cancelled) return;

        setOrganizationId(membership.organization.id);
        setSandboxes(
          Object.fromEntries(sandboxPage.data.map((sandbox) => [sandbox.id, sandbox])),
        );
        setEvents(activityPage.data);
        setPage(activityPage.page);
        setStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        setStatus("error");
        setError(errorMessage(cause));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [workspaceSlug, reloadKey]);

  const { connected } = useActivityStream({
    organizationId,
    enabled: Boolean(organizationId),
    onEvent: (event) => {
      setEvents((current) =>
        current.some((item) => item.id === event.id) ? current : [event, ...current],
      );
    },
  });

  const filtered = useMemo(
    () => events.filter((event) => filterMatches(event, filter)),
    [events, filter],
  );

  const loadMore = async () => {
    if (!organizationId || !page.nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const result = await listActivity(organizationId, {
        limit: 100,
        cursor: page.nextCursor,
      });
      setEvents((current) => {
        const known = new Set(current.map((event) => event.id));
        return [...current, ...result.data.filter((event) => !known.has(event.id))];
      });
      setPage(result.page);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setLoadingMore(false);
    }
  };

  const syncCommits = async () => {
    if (!organizationId || syncing) return;
    setSyncing(true);
    setSyncError(null);
    try {
      await syncGithubActivity(organizationId);
      window.sessionStorage.setItem(
        `jetic:activity-sync:${organizationId}`,
        String(Date.now()),
      );
      setReloadKey((value) => value + 1);
    } catch (cause) {
      setSyncError(errorMessage(cause));
    } finally {
      setSyncing(false);
    }
  };

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-5">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[24px] font-semibold tracking-tight">Activity</h1>
              <span
                className={`inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-[10px] font-medium uppercase tracking-[0.08em] ${
                  connected
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    connected ? "animate-pulse bg-emerald-300" : "bg-[var(--jetic-faint)]"
                  }`}
                />
                {connected ? "Live" : "Connecting"}
              </span>
            </div>
            <p className="jetic-muted mt-1 text-[13px]">
              Deployment, repository, model, and runtime events across this workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md border border-white/10 bg-[var(--jetic-recess)] p-0.5">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={`h-7 rounded px-2.5 text-[11.5px] font-medium transition-colors ${
                    filter === item.id
                      ? "bg-white text-black"
                      : "text-[var(--jetic-muted)] hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => void syncCommits()}
              disabled={syncing || !organizationId}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <GitCommitHorizontal size={13} />
              )}
              Sync GitHub
            </button>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </header>

        {syncError && (
          <p role="alert" className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-300">
            {syncError}
          </p>
        )}

        {status === "error" ? (
          <div className="jetic-card flex flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-12 text-center">
            <AlertCircle size={22} className="text-red-300" />
            <h2 className="text-[14px] font-semibold">Activity could not be loaded</h2>
            <p className="jetic-muted max-w-md text-[12.5px] leading-5">
              {error ?? "Something went wrong while reading the workspace activity."}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        ) : (
          <section className="jetic-card overflow-hidden rounded-lg bg-[var(--jetic-bg)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--jetic-faint)]">
                    <th className="px-4 py-3 font-semibold">Project</th>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Environment</th>
                    <th className="px-4 py-3 font-semibold">Commit</th>
                    <th className="px-4 py-3 font-semibold">Branch</th>
                    <th className="px-4 py-3 font-semibold">Time</th>
                    <th className="px-4 py-3 font-semibold">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {status === "loading" && <SkeletonRows />}

                  {status === "ready" &&
                    filtered.map((event) => {
                      const metadata = metadataOf(event);
                      const project = eventProject(event, sandboxes, workspaceSlug);
                      const displayStatus = statusOf(event);
                      const statusCopy = STATUS_COPY[displayStatus];
                      const environment =
                        textMeta(metadata, "environment") ??
                        (event.source === "sandbox" ? "Sandbox" : "Workspace");
                      const commit = textMeta(metadata, "commitSha");
                      const branch = textMeta(metadata, "branch");
                      const actorName = event.actorName ?? "Jetic";
                      const actorAvatar = textMeta(metadata, "actorAvatarUrl");
                      const href = project.href;

                      return (
                        <tr
                          key={event.id}
                          role={href ? "link" : undefined}
                          tabIndex={href ? 0 : undefined}
                          onClick={() => {
                            if (href) router.push(href);
                          }}
                          onKeyDown={(keyboardEvent) => {
                            if (href && (keyboardEvent.key === "Enter" || keyboardEvent.key === " ")) {
                              keyboardEvent.preventDefault();
                              router.push(href);
                            }
                          }}
                          className={`border-b border-white/[0.05] text-[12px] transition-colors last:border-b-0 hover:bg-white/[0.025] ${
                            href ? "cursor-pointer" : ""
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
                                {project.icon}
                              </span>
                              <span className="max-w-[160px] truncate font-medium text-white">
                                {project.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex max-w-[420px] flex-col gap-0.5">
                              <span className="truncate font-medium text-white">
                                {event.title}
                              </span>
                              {event.description && (
                                <span className="jetic-muted truncate text-[11px]">
                                  {event.description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1.5">
                              <span className={`h-1.5 w-1.5 rounded-full ${statusCopy.dot}`} />
                              <span className={statusCopy.text}>{statusCopy.label}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex h-5 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 text-[10.5px] text-[var(--jetic-emphasis)]">
                              <ArrowRight size={9} className="text-[var(--jetic-muted)]" />
                              {environment}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="jetic-muted flex items-center gap-1.5 font-mono text-[11px]">
                              <GitCommitHorizontal size={12} />
                              {commit ? commit.slice(0, 7) : "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="jetic-muted flex items-center gap-1.5 font-mono text-[11px]">
                              <GitBranch size={12} />
                              {branch ?? "main"}
                            </span>
                          </td>
                          <td className="jetic-muted px-4 py-3 text-[11px]">
                            {formatRelative(event.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              title={actorName}
                              className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[var(--jetic-well)] bg-cover bg-center text-[9px] font-semibold text-white"
                              style={
                                actorAvatar
                                  ? { backgroundImage: `url(${JSON.stringify(actorAvatar)})` }
                                  : undefined
                              }
                            >
                              {actorAvatar
                                ? null
                                : actorName.trim().charAt(0).toUpperCase() || "J"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {status === "ready" && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 border-t border-white/10 px-6 py-14 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[var(--jetic-muted)]">
                  <Activity size={16} />
                </span>
                <p className="text-[13px] font-semibold text-white">
                  {events.length > 0 ? "No activity matches this filter" : "No activity yet"}
                </p>
                <p className="jetic-muted max-w-sm text-[12px] leading-5">
                  {events.length > 0
                    ? "Try a different filter to see the rest of the workspace history."
                    : "Sandbox imports, repository events, and model scans will appear here as they happen. The feed updates live."}
                </p>
                <Link
                  href={`/app/workspace/${encodeURIComponent(workspaceSlug)}`}
                  className="mt-1 text-[11.5px] font-medium text-[var(--jetic-link)] hover:underline"
                >
                  Back to workspace overview
                </Link>
              </div>
            )}

            {status === "ready" && page.hasMore && filter === "all" && (
              <div className="border-t border-white/10 p-3">
                <button
                  type="button"
                  onClick={() => void loadMore()}
                  disabled={loadingMore}
                  className="inline-flex h-8 w-full items-center justify-center gap-2 rounded-md border border-white/10 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loadingMore && <Loader2 size={13} className="animate-spin" />}
                  Load more
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
