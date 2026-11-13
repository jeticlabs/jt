"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { X } from "lucide-react";

import { useRepositoryAlerts, useSandboxList } from "@/cache";
import type { RepositoryAlert } from "@/features/github/types";
import type { Sandbox, SandboxStatus } from "@/features/sandbox/types";
import { errorMessage } from "@/lib/api/browser";
import RunReviewCard from "@/components/RunReviewCard";

/* ------------------------------- Icons ---------------------------------- */

function Icon({
  children,
  size = 16,
  stroke = 1.5,
}: {
  children: ReactNode;
  size?: number;
  stroke?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SearchIcon = () => (
  <Icon>
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" />
  </Icon>
);
const FilterIcon = () => (
  <Icon>
    <path d="M2.5 4.5h11M4.5 8h7M6.5 11.5h3" />
  </Icon>
);
const GridIcon = () => (
  <Icon>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx=".8" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx=".8" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx=".8" />
    <rect x="9" y="9" width="4.5" height="4.5" rx=".8" />
  </Icon>
);
const ListIcon = () => (
  <Icon>
    <path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" />
  </Icon>
);
const CopyIcon = () => (
  <Icon size={14}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
  </Icon>
);
const ChevronDown = () => (
  <Icon size={14}>
    <path d="m4 6 4 4 4-4" />
  </Icon>
);
const ChevronUp = () => (
  <Icon size={14}>
    <path d="m4 10 4-4 4 4" />
  </Icon>
);
const ChevronsUpDown = () => (
  <Icon size={14}>
    <path d="m5 6.5 3-3 3 3M5 9.5l3 3 3-3" />
  </Icon>
);
const BellIcon = () => (
  <Icon>
    <path d="M4 11V7a4 4 0 1 1 8 0v4l1 1.5H3L4 11Z" />
    <path d="M6.5 14a1.6 1.6 0 0 0 3 0" />
  </Icon>
);
const EyeIcon = () => (
  <Icon>
    <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
    <circle cx="8" cy="8" r="2" />
  </Icon>
);
const InfoIcon = () => (
  <Icon size={10}>
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 7.25V11M8 4.75v.01" />
  </Icon>
);
const CommitIcon = () => (
  <Icon size={14}>
    <circle cx="8" cy="8" r="2.5" />
    <path d="M1.5 8h4M10.5 8h4" />
  </Icon>
);
const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

/* --------------------------- Project glyphs ----------------------------- */

type IconKind = "vite" | "triangle" | "next" | "jt" | "cube";

function ProjectGlyph({ kind }: { kind: IconKind }) {
  switch (kind) {
    case "vite":
      return (
        <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
          <defs>
            <linearGradient id="vite-a" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#41d1ff" />
              <stop offset="1" stopColor="#bd34fe" />
            </linearGradient>
            <linearGradient id="vite-b" x1="0.3" y1="0" x2="0.5" y2="1">
              <stop offset="0" stopColor="#ffea83" />
              <stop offset="0.08" stopColor="#ffdd35" />
              <stop offset="1" stopColor="#ffa800" />
            </linearGradient>
          </defs>
          <path d="M30 6 17 29.5a1 1 0 0 1-1.75 0L2 6a1 1 0 0 1 1-1.5L16 6.8 29 4.5A1 1 0 0 1 30 6Z" fill="url(#vite-a)" />
          <path d="M22 2 12.5 3.9a.5.5 0 0 0-.4.4l-.8 8.3a.5.5 0 0 0 .6.5l2.6-.6a.5.5 0 0 1 .6.6l-.8 4a.5.5 0 0 0 .7.6l1.6-.8a.5.5 0 0 1 .7.6L15 24.5c-.1.4.4.6.7.3l.2-.4 5.8-11.7a.5.5 0 0 0-.5-.7l-2.7.5a.5.5 0 0 1-.6-.6L22.6 2.7A.5.5 0 0 0 22 2Z" fill="url(#vite-b)" />
        </svg>
      );
    case "triangle":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--jetic-well)] ring-1 ring-white/10">
          <svg width="11" height="10" viewBox="0 0 76 65" fill="#ffffff" aria-hidden="true">
            <path d="m37.5 0 37.5 65h-75l37.5-65Z" />
          </svg>
        </span>
      );
    case "next":
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--jetic-well)] text-[11px] font-bold text-white ring-1 ring-white/10">
          N
        </span>
      );
    case "jt":
      return (
        <span className="flex h-6 w-6 items-center justify-center text-[22px] font-black leading-none text-white">
          J
        </span>
      );
    case "cube":
      return (
        <svg width="26" height="26" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
          <path d="m16 2 12 7v14l-12 7L4 23V9l12-7Zm0 4.2L7.6 11 16 15.8 24.4 11 16 6.2ZM7 13.6v8.6l8 4.6v-8.6l-8-4.6Zm18 0-8 4.6v8.6l8-4.6v-8.6Z" />
        </svg>
      );
  }
}

/* ----------------------------- Status icons ----------------------------- */

type StatusVariant = "build" | "activity" | "error";

function StatusRing({ variant = "activity" }: { variant?: StatusVariant }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  const stroke = variant === "error" ? "#f87171" : "#ffffff";
  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-7 items-center justify-center rounded-full ${variant === "error" ? "text-red-300" : "text-[var(--jetic-muted)]"
        }`}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        <circle
          cx="14"
          cy="14"
          r={r}
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${c * (variant === "activity" ? 1 : 0.28)} ${c}`}
          transform="rotate(-60 14 14)"
        />
        {variant === "build" ? (
          <path
            d="m9.5 14.2 2.2 2.2 3.3-4.2M13.8 14.2l1.2 1.2 3.2-4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : variant === "error" ? (
          <path
            d="M14 9v6M14 18.5v.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M8.5 14h2.3l1.4-3.5 2.6 7 1.6-3.5h2.1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </span>
  );
}

function UsageRing({ fraction }: { fraction: number }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle
        cx="8"
        cy="8"
        r={r}
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${Math.max(c * fraction, 4)} ${c}`}
        transform="rotate(-90 8 8)"
      />
    </svg>
  );
}

/* -------------------------------- Data ---------------------------------- */

const usage = [
  { label: "Fluid Active CPU", value: "26m 24s / 4h", fraction: 0.11 },
  { label: "CDN Requests", value: "76K / 1M", fraction: 0.076 },
  { label: "ISR Reads", value: "75K / 1M", fraction: 0.075 },
  { label: "Edge Requests", value: "112K / 1M", fraction: 0.112 },
  { label: "Function Invocations", value: "18K / 1M", fraction: 0.018 },
];

const STATUS_LABEL: Record<SandboxStatus, string> = {
  provisioning: "Importing",
  active: "Ready",
  stopped: "Stopped",
  error: "Import failed",
  archived: "Archived",
  suspended: "Suspended",
};

function statusVariant(status: SandboxStatus): StatusVariant {
  if (status === "error") return "error";
  if (status === "provisioning") return "build";
  return "activity";
}

function iconFor(sandbox: Sandbox): IconKind {
  const hint = `${sandbox.name} ${sandbox.framework ?? ""} ${sandbox.language ?? ""}`.toLowerCase();
  if (hint.includes("next")) return "next";
  if (hint.includes("vite")) return "vite";
  if (sandbox.repositoryOwner?.toLowerCase() === "jeticlabs") return "jt";
  return "cube";
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

/* ------------------------------ Components ------------------------------ */

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`jetic-card rounded-lg bg-[var(--jetic-bg)] ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-3 px-1 text-[13px] font-semibold text-[var(--jetic-emphasis)]">
      {children}
    </h2>
  );
}

function SandboxCard({
  sandbox,
  href,
}: {
  sandbox: Sandbox;
  href: string;
}) {
  const repository = sandbox.repository?.fullName;
  const branch = sandbox.defaultBranch ?? "main";
  const status = STATUS_LABEL[sandbox.status];

  return (
    <Link
      href={href}
      className="jetic-card flex flex-col gap-3 rounded-lg bg-[var(--jetic-bg)] p-4 transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <ProjectGlyph kind={iconFor(sandbox)} />
          </div>
          <div className="min-w-0 leading-4">
            <h3 className="truncate text-[13px] font-semibold text-white">
              {sandbox.name}
            </h3>
            <p className="jetic-muted truncate text-xs">
              {repository ?? "No repository connected"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[var(--jetic-muted)]">
          <StatusRing variant={statusVariant(sandbox.status)} />
          <ChevronsUpDown />
        </div>
      </header>

      <div className="flex flex-col gap-1.5">
        <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-white">
          <span className="shrink-0 text-[var(--jetic-muted)]">
            <CommitIcon />
          </span>
          <span className="truncate">
            {sandbox.status === "error"
              ? (sandbox.lastError ?? "The import did not finish")
              : `${status} · ${branch}`}
          </span>
        </p>
        <p className="jetic-muted flex items-center gap-1.5 text-xs">
          <GithubIcon />
          <span className="truncate">
            {repository ?? "no repository"} · {formatRelative(sandbox.updatedAt)}
          </span>
        </p>
      </div>
    </Link>
  );
}

function SandboxSkeleton() {
  return (
    <div className="jetic-card flex flex-col gap-3 rounded-lg bg-[var(--jetic-bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="jetic-shimmer h-7 w-7 rounded-md" />
          <div className="flex flex-col gap-1.5">
            <span className="jetic-shimmer h-3 w-28 rounded-full" />
            <span className="jetic-shimmer h-2.5 w-20 rounded-full" />
          </div>
        </div>
        <span className="jetic-shimmer h-7 w-7 rounded-full" />
      </div>
      <span className="jetic-shimmer h-3 w-40 rounded-full" />
      <span className="jetic-shimmer h-2.5 w-32 rounded-full" />
    </div>
  );
}

function NewRepositoryAlertCard({
  alert,
  count,
  onDismiss,
  onImport,
}: {
  alert: RepositoryAlert;
  count: number;
  onDismiss: () => void;
  onImport: () => void;
}) {
  return (
    <div className="relative max-w-md rounded-lg border border-dashed border-white/25 bg-[var(--jetic-bg)] p-4">
      <button
        type="button"
        aria-label="Dismiss new repository alert"
        onClick={onDismiss}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <X size={12} />
      </button>
      <div className="flex items-start gap-3 pr-7">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
          <GithubIcon />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold text-white">
            New repository detected
            {count > 1 && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[9.5px] font-medium text-[var(--jetic-muted)]">
                {count} new
              </span>
            )}
          </p>
          <p className="jetic-muted mt-1 truncate text-[12px]">
            {alert.repository.fullName}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onImport}
        className="mt-3 flex h-8 w-full items-center justify-center rounded-md bg-white text-[12.5px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        Import
      </button>
    </div>
  );
}

/* -------------------------------- Page ---------------------------------- */

const secondaryControl =
  "border border-white/10 bg-[var(--jetic-recess)] text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const primaryControl =
  "bg-white text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export default function DashboardPage() {
  const params = useParams<{ workspaceId?: string | string[] }>();
  const workspaceSlug = Array.isArray(params?.workspaceId)
    ? (params.workspaceId[0] ?? "")
    : (params?.workspaceId ?? "");

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [usageOpen, setUsageOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(target.tagName)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const {
    sandboxes,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSandboxList(workspaceSlug);
  const {
    alerts: repositoryAlerts,
    dismiss: dismissRepositoryAlert,
  } = useRepositoryAlerts(workspaceSlug);

  const loadError = isError ? errorMessage(error) : null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sandboxes;
    return sandboxes.filter((sandbox) => {
      const repository = sandbox.repository?.fullName ?? "";
      return (
        sandbox.name.toLowerCase().includes(q) ||
        repository.toLowerCase().includes(q) ||
        (sandbox.defaultBranch?.toLowerCase().includes(q) ?? false) ||
        sandbox.status.toLowerCase().includes(q)
      );
    });
  }, [query, sandboxes]);

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <header>
          <h1 className="text-[24px] font-semibold tracking-tight text-white">Overview</h1>
          <p className="jetic-muted mt-1 text-[13px]">
            Monitor your sandboxes, usage, and workspace activity.
          </p>
        </header>

        {/* Toolbar */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <label className="flex h-9 min-w-[200px] flex-1 items-center gap-2 rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 text-[var(--jetic-muted)] transition-colors focus-within:border-white/20">
            <SearchIcon />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sandboxes"
              className="min-w-0 flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-[var(--jetic-muted)]"
            />
            <kbd className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-[var(--jetic-well)] text-[11px] text-[var(--jetic-muted)]">
              /
            </kbd>
          </label>

          <button
            type="button"
            aria-label="Filter and sort"
            className={`flex h-9 w-9 items-center justify-center rounded-md ${secondaryControl}`}
          >
            <FilterIcon />
          </button>

          <div className="flex h-9 items-center overflow-hidden rounded-md border border-white/10 bg-[var(--jetic-recess)] p-0.5">
            {(
              [
                ["grid", <GridIcon key="g" />, "Grid view"],
                ["list", <ListIcon key="l" />, "List view"],
              ] as const
            ).map(([key, icon, label]) => (
              <button
                key={key}
                type="button"
                aria-label={label}
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={`flex h-full w-9 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${view === key
                  ? "bg-[var(--jetic-well)] text-white"
                  : "text-[var(--jetic-faint)] hover:text-white"
                  }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`flex h-9 items-center gap-2.5 rounded-md px-3 text-[12.5px] font-medium text-white ${secondaryControl}`}
          >
            <span className="flex items-center -space-x-1" aria-hidden="true">
              <span className="h-4 w-4 rounded-full border border-white/20 bg-[var(--jetic-recess)]" />
              <span className="h-4 w-4 rounded-full border border-white/40 bg-[var(--jetic-recess)]" />
              <span className="h-4 w-4 rounded-full bg-white" />
            </span>
            Onboard Your Agent
            <span className="text-[var(--jetic-muted)]">
              <CopyIcon />
            </span>
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:gap-4">
          {/* Sidebar */}
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[305px]">
            <section>
              <SectionTitle>Usage</SectionTitle>
              <Panel className="relative p-4">
                <div className="z-0 mb-3 flex items-center justify-between">
                  <span className="text-[12.5px] font-medium">Last 30 days</span>
                  <button
                    type="button"
                    className={`h-7 rounded-md px-2.5 text-[11.5px] font-medium ${primaryControl}`}
                  >
                    Upgrade
                  </button>
                </div>
                <ul
                  className={`z-0 flex flex-col gap-1 overflow-hidden ${usageOpen ? "" : "max-h-[128px]"
                    }`}
                >
                  {usage.map((u) => (
                    <li
                      key={u.label}
                      className="flex h-8 shrink-0 items-center justify-between gap-2 rounded-md bg-[var(--jetic-recess)] px-2.5 text-[11.5px]"
                    >
                      <span className="flex items-center gap-2 text-[var(--jetic-emphasis)]">
                        <UsageRing fraction={u.fraction} />
                        <span className="font-medium">{u.label}</span>
                        <span className="text-[var(--jetic-faint)]">
                          <InfoIcon />
                        </span>
                      </span>
                      <span className="jetic-muted">{u.value}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  aria-label={usageOpen ? "Show less usage" : "Show more usage"}
                  aria-expanded={usageOpen}
                  onClick={() => setUsageOpen((v) => !v)}
                  className={` ${primaryControl} absolute -bottom-4 z-10 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white/15 bg-[var(--jetic-recess)] text-[var(--jetic-muted)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
                >
                  {usageOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
              </Panel>
            </section>

            <section>
              <SectionTitle>Alerts</SectionTitle>
              <Panel className="flex flex-col items-center gap-3 px-5 py-6 text-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-[var(--jetic-muted)]">
                  <BellIcon />
                </span>
                <p className="jetic-muted text-[12px] leading-5">
                  Get notified when usage or
                  <br />
                  errors spike across your projects.
                </p>
                <button
                  type="button"
                  className={`h-8 rounded-md px-3 text-[12px] font-medium ${secondaryControl}`}
                >
                  Upgrade to Pro
                </button>
              </Panel>
            </section>

            <section>
              <SectionTitle>Recent Previews</SectionTitle>
              <Panel className="flex flex-col items-center gap-3 px-5 py-8 text-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[var(--jetic-muted)]">
                  <EyeIcon />
                </span>
                <p className="jetic-muted text-[12px] leading-5">
                  Preview deployments that you have
                  <br />
                  recently visited or created will appear here.
                </p>
              </Panel>
            </section>
          </aside>

          {/* Sandboxes */}
          <section className="min-w-0 flex-1">
            <SectionTitle>Sandboxes</SectionTitle>

            {repositoryAlerts.length > 0 && repositoryAlerts[0] && (
              <div className="mb-3">
                <NewRepositoryAlertCard
                  alert={repositoryAlerts[0]}
                  count={repositoryAlerts.length}
                  onDismiss={() => {
                    void dismissRepositoryAlert(repositoryAlerts[0]!.id).catch(
                      () => undefined,
                    );
                  }}
                  onImport={() => {
                    window.dispatchEvent(
                      new CustomEvent("jetic:import-github-repository", {
                        detail: {
                          repository: repositoryAlerts[0]!.repository,
                        },
                      }),
                    );
                  }}
                />
              </div>
            )}

            <div
              className={`grid gap-3 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                }`}
            >
              {isPending &&
                Array.from({ length: 6 }).map((_, index) => (
                  <SandboxSkeleton key={index} />
                ))}

              {isError && (
                <div className="jetic-card col-span-full flex flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-10 text-center">
                  <span className="text-[13px] font-semibold text-red-300">
                    Sandboxes could not be loaded
                  </span>
                  <p className="jetic-muted max-w-md text-[12.5px] leading-5">
                    {loadError ?? "Something went wrong. Please try again."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void refetch()}
                    className={`h-8 rounded-md px-3 text-[12px] font-medium ${secondaryControl}`}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isPending &&
                !isError &&
                filtered.map((sandbox) => (
                  <SandboxCard
                    key={sandbox.id}
                    sandbox={sandbox}
                    href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`}
                  />
                ))}
            </div>

            {!isPending && !isError && filtered.length === 0 && (
              <div className="jetic-card mt-3 flex flex-col items-center gap-2 rounded-lg border-dashed bg-[var(--jetic-bg)] px-6 py-12 text-center">
                <p className="text-[13px] font-semibold text-white">
                  {query ? "No sandboxes match your search" : "No sandboxes yet"}
                </p>
                <p className="jetic-muted max-w-sm text-[12px] leading-5">
                  {query
                    ? `Nothing matches “${query}”. Try a different name, repository, or status.`
                    : "Use New Sandbox in the toolbar to import a GitHub repository and create your first sandbox."}
                </p>
              </div>
            )}

            {hasNextPage && !query && (
              <button
                type="button"
                onClick={() => void fetchNextPage()}
                disabled={isFetchingNextPage}
                className={`mt-4 h-8 w-full rounded-md text-[12px] font-medium disabled:cursor-not-allowed disabled:opacity-50 ${secondaryControl}`}
              >
                {isFetchingNextPage ? "Loading…" : "Show More"}
              </button>
            )}
          </section>

          <RunReviewCard />
        </div>
      </div>
    </main>
  );
}
