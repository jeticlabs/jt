"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

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
const CloseIcon = () => (
  <Icon size={10} stroke={1.8}>
    <path d="m4 4 8 8M12 4l-8 8" />
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

function StatusRing({ variant = "build" }: { variant?: "build" | "activity" }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <button
      type="button"
      aria-label="Project status"
      className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--jetic-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
        {variant === "build" && (
          <circle
            cx="14"
            cy="14"
            r={r}
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${c * 0.28} ${c}`}
            transform="rotate(-60 14 14)"
          />
        )}
        {variant === "build" ? (
          <path
            d="m9.5 14.2 2.2 2.2 3.3-4.2M13.8 14.2l1.2 1.2 3.2-4"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
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
    </button>
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

type Project = {
  name: string;
  domain: string;
  commit: string;
  repo: string;
  date: string;
  icon: IconKind;
  status?: "build" | "activity";
};

const projects: Project[] = [
  { name: "jt", domain: "jt-lime.jetic.app", commit: "feat: add strict api rules to api endpoints", repo: "jeticlabs/jt", date: "21h ago", icon: "cube" },
  /*{ name: "jetic", domain: "cli.jetic.space", commit: "feat: wrong api link in production", repo: "jeticlabs/jt", date: "21h ago", icon: "jt" },
  { name: "learnwithuncletee", domain: "learnwithuncletee.jetic.app", commit: "Corrected adress in studentidcard.tsx component", repo: "ProdevappOFFICIAL/Learnwithuncletee", date: "Oct 31", icon: "vite" },
  { name: "learning-deck", domain: "www.learningdeck.online", commit: "feat/aded-results-to-teacher-navitems", repo: "LearningDeck-HQ/LearningDeck", date: "Oct 31", icon: "triangle" },
  { name: "lab-stx-ide", domain: "ide.labstx.online", commit: "v1.2.2 Live in Production", repo: "LabSTX/LabSTX_IDE", date: "Aug 19", icon: "cube" },
  { name: "flowfi-btc", domain: "flowfi-btc.jetic.app", commit: "Fixed small changes", repo: "FlowFi-BTC/FlowFi", date: "Sep 14", icon: "vite" },
  { name: "cpe-project-g3", domain: "cpe-project-g3.jetic.app", commit: "new", repo: "ProdevappOFFICIAL/CPE-510-Project-G3", date: "Aug 19", icon: "vite" },
  { name: "lab-stx", domain: "www.labstx.online", commit: "Feat: v1.2.2 is Live", repo: "LabSTX/LabSTX", date: "Aug 19", icon: "vite" },
  { name: "stacks-mart", domain: "stacks-mart-murex.jetic.app", commit: "Fixed the explorer link", repo: "ProdevappOFFICIAL/StacksMart", date: "Jul 25", icon: "triangle" },
  { name: "stacks-mart-54qe", domain: "stacks-mart-54qe.jetic.app", commit: "Fixed the explorer link", repo: "ProdevappOFFICIAL/StacksMart", date: "Jul 25", icon: "triangle" },
  { name: "storesolly", domain: "storesolly.jetic.app", commit: "Basic MVP", repo: "Storesoly/Frontend", date: "May 23", icon: "next" },
  { name: "learning-deck-website-vm49", domain: "learning-deck-website-vm49.jetic.app", commit: "update", repo: "ProdevappOFFICIAL/LearningDeck_Website", date: "6/26/25", icon: "next", status: "activity" },*/
];

const usage = [
  { label: "Fluid Active CPU", value: "26m 24s / 4h", fraction: 0.11 },
  { label: "CDN Requests", value: "76K / 1M", fraction: 0.076 },
  { label: "ISR Reads", value: "75K / 1M", fraction: 0.075 },

  { label: "Edge Requests", value: "112K / 1M", fraction: 0.112 },
  { label: "Function Invocations", value: "18K / 1M", fraction: 0.018 },
];

/* ------------------------------ Components ------------------------------ */

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`jetic-card bg-[var(--jetic-recess)] ${className}`}>
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

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="jetic-card flex flex-col gap-3 bg-[var(--jetic-recess)] p-4 transition-colors hover:border-white/20">
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center">
            <ProjectGlyph kind={p.icon} />
          </div>
          <div className="min-w-0 leading-4">
            <h3 className="truncate text-[13px] font-semibold text-white">{p.name}</h3>
            <p className="jetic-muted truncate text-xs">{p.domain}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[var(--jetic-muted)]">
          <StatusRing variant={p.status} />
          <ChevronsUpDown />
        </div>
      </header>
      <div className="flex flex-col gap-1.5">
        <p className="flex items-center gap-1.5 text-[13px] font-semibold text-white">
          <span className="shrink-0 text-[var(--jetic-muted)]">
            <CommitIcon />
          </span>
          <span className="truncate">{p.commit}</span>
        </p>
        <p className="jetic-muted flex items-center gap-1.5 text-xs">
          <GithubIcon />
          <span className="truncate">
            {p.repo} · {p.date}
          </span>
        </p>
      </div>
    </article>
  );
}

/* -------------------------------- Page ---------------------------------- */

const secondaryControl =
  "border border-white/10 bg-[var(--jetic-recess)] text-[var(--jetic-muted)] transition-colors hover:bg-[var(--jetic-well)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

const primaryControl =
  "bg-white text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40";

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [usageOpen, setUsageOpen] = useState(false);
  const [repoBannerOpen, setRepoBannerOpen] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(t.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q) ||
        p.repo.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <main className="jetic-surface min-h-full w-full px-4 py-3">
      <div className="mx-auto w-full max-w-[1220px]">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-10 min-w-[200px] flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[var(--jetic-recess)] px-3 text-[var(--jetic-muted)] transition-colors focus-within:border-white/25">
            <SearchIcon />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[var(--jetic-faint)]"
            />
            <kbd className="flex h-5 w-5 items-center justify-center rounded border border-white/10 bg-[var(--jetic-well)] text-[11px] text-[var(--jetic-muted)]">
              /
            </kbd>
          </label>

          <button
            type="button"
            aria-label="Filter and sort"
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${secondaryControl}`}
          >
            <FilterIcon />
          </button>

          <div className="flex h-10 items-center overflow-hidden rounded-xl border border-white/10 bg-[var(--jetic-recess)] p-0.5">
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
                className={`flex h-full w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                  view === key
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
            className={`flex h-10 items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium text-white ${secondaryControl}`}
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

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:gap-[17px]">
          {/* Sidebar */}
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[305px]">
            <section>
              <SectionTitle>Usage</SectionTitle>
              <Panel className="relative p-3 pb-4">
                <div className="mb-3 flex items-center justify-between z-0">
                  <span className="text-[13px] font-medium">Last 30 days</span>
                  <button
                    type="button"
                    className={`h-6 rounded-lg px-2 text-xs font-medium ${primaryControl}`}
                  >
                    Upgrade
                  </button>
                </div>
                <ul
                  className={`flex flex-col gap-1 overflow-hidden  z-0 ${
                    usageOpen ? "" : "max-h-[128px]"
                  }`}
                >
                  {usage.map((u) => (
                    <li
                      key={u.label}
                      className="flex h-8 shrink-0 items-center justify-between gap-2 rounded-lg bg-[var(--jetic-well)] px-2 text-xs"
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
              <Panel className="flex flex-col items-center gap-3 px-6 py-6 text-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-[var(--jetic-muted)]">
                  <BellIcon />
                </span>
                <p className="jetic-muted text-xs leading-5">
                  Get notified when usage or
                  <br />
                  errors spike across your projects.
                </p>
                <button
                  type="button"
                  className={`h-8 rounded-lg px-3 text-[13px] font-medium ${secondaryControl}`}
                >
                  Upgrade to Pro
                </button>
              </Panel>
            </section>

            <section>
              <SectionTitle>Recent Previews</SectionTitle>
              <Panel className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-[var(--jetic-muted)]">
                  <EyeIcon />
                </span>
                <p className="jetic-muted text-xs leading-5">
                  Preview deployments that you have
                  <br />
                  recently visited or created will appear here.
                </p>
              </Panel>
            </section>
          </aside>

          {/* Projects */}
          <section className="min-w-0 flex-1">
            <SectionTitle>Sandbox</SectionTitle>

            <div
              className={`grid gap-3 ${
                view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {repoBannerOpen && !query && (
                <div className="relative rounded-xl border border-dashed border-white/15 bg-[var(--jetic-recess)] p-3">
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setRepoBannerOpen(false)}
                    className="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-[var(--jetic-bg)] text-[var(--jetic-muted)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <CloseIcon />
                  </button>
                  <div className="flex items-center gap-3 pb-3 pl-1 pt-1">
                    <span className="jetic-muted w-6 text-center text-xs">ex</span>
                    <div className="leading-4">
                      <h3 className="text-[13px] font-semibold">New repository detected</h3>
                      <p className="jetic-muted mt-1 flex items-center gap-1.5 text-xs">
                        <GithubIcon />
                        jeticlabs/jetic-api
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`h-8 w-full rounded-lg text-[13px] font-medium ${primaryControl}`}
                  >
                    Import
                  </button>
                </div>
              )}

              {filtered.map((p) => (
                <ProjectCard key={p.name} p={p} />
              ))}

             
            </div>

            {filtered.length === 0 && (
              <p className="jetic-muted py-10 text-center text-sm">
                No projects match &ldquo;{query}&rdquo;.
              </p>
            )}

            <button
              type="button"
              className={`mt-4 h-10 w-full rounded-xl text-[13px] font-medium ${secondaryControl}`}
            >
              Show More
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}
