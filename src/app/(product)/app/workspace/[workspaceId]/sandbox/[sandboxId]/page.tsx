"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FolderTree,
  GitBranch,
  RefreshCw,
  Server,
  Box,
} from "lucide-react";

import { JeticAnimatedIcon } from "@/components/jetic-animated-icon";
import { GitHubIcon } from "@/components/icons/github-icon";

import { listActivity } from "@/features/activity/activity.api";
import type { ActivityEvent } from "@/features/activity/types";
import { useActivityStream } from "@/features/activity/use-activity-stream";
import { useSandboxContext } from "@/features/sandbox/use-sandbox-context";
import type { Sandbox, SandboxStatus } from "@/features/sandbox/types";
import { errorMessage } from "@/lib/api/browser";

const STATUS_STYLE: Record<SandboxStatus, string> = {
  provisioning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  stopped: "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]",
  error: "border-red-500/20 bg-red-500/10 text-red-300",
  archived: "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]",
  suspended: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

const STATUS_LABEL: Record<SandboxStatus, string> = {
  provisioning: "Importing",
  active: "Ready",
  stopped: "Stopped",
  error: "Error",
  archived: "Archived",
  suspended: "Suspended",
};

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

function activityIcon(event: ActivityEvent) {
  if (event.type.includes("fail") || event.type.includes("error")) {
    return <AlertCircle size={14} className="text-red-300" />;
  }
  if (event.type.includes("ready") || event.type.includes("completed")) {
    return <CheckCircle2 size={14} className="text-emerald-300" />;
  }
  if (event.source === "github") return <GitHubIcon size={14} />;
  if (event.source === "scanner") return <Activity size={14} />;
  return <Box size={14} />;
}

function InfoCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="jetic-card rounded-lg bg-[var(--jetic-bg)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--jetic-emphasis)]">
          <span className="text-[var(--jetic-muted)]">{icon}</span>
          {title}
        </div>
        {action}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 first:pt-0 last:pb-0">
      <span className="jetic-muted shrink-0 text-[11.5px]">{label}</span>
      <span className="flex min-w-0 items-center justify-end truncate text-right text-[12px] text-white">
        {children}
      </span>
    </div>
  );
}

function SandboxHeader({
  sandbox,
  workspaceSlug,
}: {
  sandbox: Sandbox;
  workspaceSlug: string;
}) {  const sourceHref = sandbox.repository
    ? `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}/source`
    : null;

  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[24px] font-semibold tracking-tight text-white">
            {sandbox.name}
          </h1>
          <span
            className={`inline-flex h-5 items-center rounded-full border px-2 text-[10px] font-semibold uppercase tracking-[0.08em] ${STATUS_STYLE[sandbox.status]}`}
          >
            {STATUS_LABEL[sandbox.status]}
          </span>
        </div>
        <p className="jetic-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px]">
          <span className="flex items-center gap-1.5">
            <GitHubIcon size={13} />
            {sandbox.repository?.fullName ?? "No repository connected"}
          </span>
          {sandbox.defaultBranch && (
            <>
              <span className="text-[var(--jetic-faint)]">·</span>
              <span className="flex items-center gap-1.5 font-mono">
                <GitBranch size={12} />
                {sandbox.defaultBranch}
              </span>
            </>
          )}
          <span className="text-[var(--jetic-faint)]">·</span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            Updated {formatRelative(sandbox.updatedAt)}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {sandbox.previewUrl && (
          <a
            href={sandbox.previewUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[12px] font-medium text-black transition-colors hover:bg-white/90"
          >
            Open preview
            <ArrowUpRight size={13} />
          </a>
        )}
        {sourceHref && (
          <Link
            href={sourceHref}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            <FolderTree size={13} />
            Browse source
          </Link>
        )}
      </div>
    </header>
  );
}

const SETUP_MESSAGES = [
  "Preparing your workspace…",
  "Setting up your sandbox…",
  "Setting up environments…",
  "Starting your runtime…",
];

function SandboxSetupScreen({
  progress,
  messageIndex,
}: {
  progress: number;
  messageIndex: number;
}) {
  return (
    <main className="jetic-surface flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-[var(--jetic-well)] px-5">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[var(--jetic-bg)] text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <JeticAnimatedIcon size={34} loop sheen="#fff" className="text-white" />
        </div>

        <div>
          <h1 className="text-[20px] font-semibold tracking-tight text-white">
            {SETUP_MESSAGES[messageIndex] ?? SETUP_MESSAGES[0]}
          </h1>
          <p className="jetic-muted mt-2 text-[12.5px] leading-5">
            Jetic is preparing your sandbox. This will only take a moment.
          </p>
        </div>

        <div className="w-full">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-200 ease-linear"
              style={{ width: `${Math.max(2, progress)}%` }}
            />
          </div>
          <div className="jetic-muted mt-2 flex items-center justify-between text-[10.5px]">
            <span>Setting up</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-1.5">
          {SETUP_MESSAGES.map((message, index) => {
            const done = index < messageIndex;
            const active = index === messageIndex;
            return (
              <div
                key={message}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[11.5px] transition-colors ${
                  active
                    ? "bg-white/[0.06] text-white"
                    : done
                      ? "text-[var(--jetic-emphasis)]"
                      : "text-[var(--jetic-faint)]"
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    done
                      ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-300"
                      : active
                        ? "border-white/30 text-white"
                        : "border-white/10"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 size={10} />
                  ) : active ? (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  ) : null}
                </span>
                {message.replace("…", "")}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default function SandboxOverviewPage() {
  const { organizationId, sandbox, status, error, reload, workspaceSlug } =
    useSandboxContext();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [activityStatus, setActivityStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [activityError, setActivityError] = useState<string | null>(null);
  const [setup, setSetup] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupMessage, setSetupMessage] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("setup") !== "1") return;
    const timer = window.setTimeout(() => setSetup(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!setup) return;
    const started = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setSetupProgress(Math.min(100, (elapsed / 8_000) * 100));
      setSetupMessage(
        Math.min(SETUP_MESSAGES.length - 1, Math.floor(elapsed / 2_000)),
      );
    }, 100);
    const done = window.setTimeout(() => {
      setSetup(false);
      const url = new URL(window.location.href);
      url.searchParams.delete("setup");
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }, 8_000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(done);
    };
  }, [setup]);

  useEffect(() => {
    if (!organizationId || !sandbox) return;
    let cancelled = false;
    void (async () => {
      setActivityStatus("loading");
      try {
        const page = await listActivity(organizationId, {
          sandboxId: sandbox.id,
          limit: 6,
        });
        if (cancelled) return;
        setEvents(page.data);
        setActivityError(null);
        setActivityStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        setActivityError(errorMessage(cause));
        setActivityStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [organizationId, sandbox]);

  const { connected } = useActivityStream({
    organizationId,
    sandboxId: sandbox?.id ?? null,
    enabled: Boolean(organizationId && sandbox),
    onEvent: (event) => {
      setEvents((current) =>
        current.some((item) => item.id === event.id)
          ? current
          : [event, ...current].slice(0, 6),
      );
    },
  });

  if (setup) {
    return (
      <SandboxSetupScreen progress={setupProgress} messageIndex={setupMessage} />
    );
  }

  if (status === "loading") {
    return (
      <main className="jetic-surface min-h-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="jetic-shimmer h-7 w-56 rounded-md" />
            <span className="jetic-shimmer h-3 w-80 rounded-full" />
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="jetic-card h-36 rounded-lg bg-[var(--jetic-bg)] p-4">
                <span className="jetic-shimmer h-3 w-24 rounded-full" />
                <div className="mt-4 flex flex-col gap-2">
                  <span className="jetic-shimmer h-2.5 w-full rounded-full" />
                  <span className="jetic-shimmer h-2.5 w-3/4 rounded-full" />
                  <span className="jetic-shimmer h-2.5 w-1/2 rounded-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="jetic-card h-56 rounded-lg bg-[var(--jetic-bg)] p-4">
            <span className="jetic-shimmer h-3 w-32 rounded-full" />
            <div className="mt-4 flex flex-col gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className="jetic-shimmer h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "error" || !sandbox) {
    return (
      <main className="jetic-surface flex min-h-full items-center justify-center bg-[var(--jetic-well)] px-5 py-16">
        <div className="jetic-card flex w-full max-w-md flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-10 text-center">
          <AlertCircle size={22} className="text-red-300" />
          <h1 className="text-[15px] font-semibold">Sandbox could not be loaded</h1>
          <p className="jetic-muted text-[12.5px] leading-5">
            {error ?? "The sandbox may have been deleted or you may not have access."}
          </p>
          <button
            type="button"
            onClick={reload}
            className="mt-1 inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-6">
        <SandboxHeader sandbox={sandbox} workspaceSlug={workspaceSlug} />

        <div className="grid gap-3 md:grid-cols-3">
          <InfoCard title="Repository" icon={<GitHubIcon size={14} />}>
            <Detail label="Repository">
              {sandbox.repository?.fullName ?? "Not connected"}
            </Detail>
            <Detail label="Branch">
              <span className="font-mono">{sandbox.defaultBranch ?? "main"}</span>
            </Detail>
            <Detail label="Language">{sandbox.language ?? "Not detected"}</Detail>
            <Detail label="Visibility">
              {sandbox.repository?.isPrivate ? "Private" : "Public"}
            </Detail>
          </InfoCard>

          <InfoCard title="Runtime" icon={<Server size={14} />}>
            <Detail label="Provider">
              <span className="capitalize">{sandbox.runtimeProvider}</span>
            </Detail>
            <Detail label="Status">
              <span className="capitalize">{sandbox.runtimeStatus ?? "Unknown"}</span>
            </Detail>
            <Detail label="Preview">
              {sandbox.previewUrl ? (
                <a
                  href={sandbox.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-[var(--jetic-link)] hover:underline"
                >
                  {sandbox.previewUrl.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                "Not available"
              )}
            </Detail>
            <Detail label="Last started">
              {sandbox.lastStartedAt ? formatRelative(sandbox.lastStartedAt) : "Never"}
            </Detail>
          </InfoCard>

          <InfoCard title="Configuration" icon={<Box size={14} />}>
            <Detail label="Root directory">
              <span className="font-mono">{sandbox.rootDirectory}</span>
            </Detail>
            <Detail label="Build command">
              <span className="font-mono">{sandbox.buildCommand ?? "Auto"}</span>
            </Detail>
            <Detail label="Output directory">
              <span className="font-mono">{sandbox.outputDirectory ?? "Auto"}</span>
            </Detail>
            <Detail label="Framework">{sandbox.framework ?? "Not detected"}</Detail>
          </InfoCard>
        </div>

        {sandbox.lastError && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12.5px] text-red-200"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <span>{sandbox.lastError}</span>
          </div>
        )}

        <section className="jetic-card rounded-lg bg-[var(--jetic-bg)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--jetic-emphasis)]">
              <Activity size={14} className="text-[var(--jetic-muted)]" />
              Recent activity
              <span
                className={`ml-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.08em] ${
                  connected
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    : "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    connected ? "bg-emerald-300" : "bg-[var(--jetic-faint)]"
                  }`}
                />
                {connected ? "Live" : "Offline"}
              </span>
            </div>
            <Link
              href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/activity`}
              className="text-[11.5px] font-medium text-[var(--jetic-link)] hover:underline"
            >
              View workspace activity
            </Link>
          </div>

          <div className="flex flex-col">
            {activityStatus === "loading" &&
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
                  <span className="jetic-shimmer h-6 w-6 rounded-full" />
                  <span className="flex flex-1 flex-col gap-1.5">
                    <span className="jetic-shimmer h-2.5 w-48 rounded-full" />
                    <span className="jetic-shimmer h-2 w-64 rounded-full" />
                  </span>
                  <span className="jetic-shimmer h-2.5 w-14 rounded-full" />
                </div>
              ))}

            {activityStatus === "error" && (
              <p className="px-4 py-6 text-center text-[12px] text-red-300">
                {activityError ?? "Activity could not be loaded."}
              </p>
            )}

            {activityStatus !== "loading" &&
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
                    {activityIcon(event)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-white">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="jetic-muted mt-0.5 truncate text-[11.5px]">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <span className="jetic-muted shrink-0 text-[11px]">
                    {formatRelative(event.createdAt)}
                  </span>
                </div>
              ))}

            {activityStatus === "ready" && events.length === 0 && (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[var(--jetic-muted)]">
                  <Activity size={15} />
                </span>
                <p className="text-[12.5px] font-medium text-white">No activity yet</p>
                <p className="jetic-muted max-w-sm text-[11.5px] leading-5">
                  Sandbox imports, model scans, and runtime changes will appear here as they happen.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--jetic-muted)] transition-colors hover:text-white"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>
    </main>
  );
}
