"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  GitBranch,
  Lock,
  PackageOpen,
  Search,
  X,
} from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { slugify } from "@/features/workspace/slug";
import type { Plan } from "@/features/workspace/types";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Step = "source" | "repositories" | "configure";

interface GithubAccount {
  id: string;
  label: string;
}

interface Repository {
  id: string;
  owner: string;
  name: string;
  updated: string;
  isPrivate?: boolean;
  icon: "next" | "express" | "jetic" | "vite";
}

interface SelectOption {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  badgeTone?: Plan;
}

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

const ACCOUNTS: GithubAccount[] = [
  { id: "jeticlabs", label: "jeticlabs" },
  { id: "simulsol", label: "SIMULSOL" },
];

const REPOSITORIES: Repository[] = [
  {
    id: "jeticlabs/jt",
    owner: "jeticlabs",
    name: "jt",
    updated: "3h ago",
    icon: "next",
  },
  {
    id: "jeticlabs/jetic-api",
    owner: "jeticlabs",
    name: "jetic-api",
    updated: "13h ago",
    isPrivate: true,
    icon: "express",
  },
  {
    id: "jeticlabs/Jetic",
    owner: "jeticlabs",
    name: "Jetic",
    updated: "Oct 20",
    icon: "jetic",
  },
  {
    id: "jeticlabs/jetic-frontend-v2",
    owner: "jeticlabs",
    name: "jetic-frontend-v2",
    updated: "Oct 18",
    isPrivate: true,
    icon: "next",
  },
  {
    id: "jeticlabs/Jetic-web",
    owner: "jeticlabs",
    name: "Jetic-web",
    updated: "Sep 27",
    isPrivate: true,
    icon: "vite",
  },
  {
    id: "simulsol/SIMULSOL-ELECTRON",
    owner: "simulsol",
    name: "SIMULSOL-ELECTRON",
    updated: "2d ago",
    icon: "vite",
  },
  {
    id: "simulsol/simulsol-site",
    owner: "simulsol",
    name: "simulsol-site",
    updated: "Oct 30",
    icon: "next",
  },
];

const LANGUAGES: SelectOption[] = [
  { value: "vite", label: "Vite", icon: <ViteMark size={18} /> },
  {
    value: "nextjs",
    label: "Next.js",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
        N
      </span>
    ),
  },
  {
    value: "other",
    label: "Other",
    icon: <span className="h-[18px] w-[18px] rounded-full border border-[#4a4a4a]" />,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

function ViteMark({ size = 18 }: { size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientA = `vite-a-${uid}`;
  const gradientB = `vite-b-${uid}`;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient
          id={gradientA}
          x1="6"
          y1="4"
          x2="19"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#41d1ff" />
          <stop offset="1" stopColor="#bd34fe" />
        </linearGradient>
        <linearGradient
          id={gradientB}
          x1="14"
          y1="2"
          x2="18"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffea83" />
          <stop offset=".08" stopColor="#ffdd35" />
          <stop offset="1" stopColor="#ffa800" />
        </linearGradient>
      </defs>
      <path
        d="M29.9 5.8 16.7 29.4a.7.7 0 0 1-1.2 0L2.1 5.8A.7.7 0 0 1 2.7 4.8l13.2 2.4a.7.7 0 0 0 .2 0l12.9-2.4a.7.7 0 0 1 .9 1Z"
        fill={`url(#${gradientA})`}
      />
      <path
        d="M22.3 2 12.4 3.9a.4.4 0 0 0-.3.4l-.6 10.3a.4.4 0 0 0 .5.4l2.8-.6a.4.4 0 0 1 .5.5l-.8 4a.4.4 0 0 0 .5.5l1.7-.5a.4.4 0 0 1 .5.5l-1.3 6.2c-.1.4.4.6.7.3l.2-.3 8.1-16.3a.4.4 0 0 0-.4-.6l-2.9.6a.4.4 0 0 1-.5-.5l1.9-6.7a.4.4 0 0 0-.4-.5Z"
        fill={`url(#${gradientB})`}
      />
    </svg>
  );
}

function RepoIcon({ kind }: { kind: Repository["icon"] }) {
  if (kind === "vite") return <ViteMark size={22} />;

  if (kind === "jetic") {
    return (
      <span
        aria-hidden="true"
        className="relative flex h-6 w-6 shrink-0 items-center justify-center"
      >
        <span className="absolute left-0.5 top-1 h-2.5 w-2.5 rounded-full bg-[#34d399]" />
        <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full bg-[#a78bfa]" />
        <span className="absolute bottom-0.5 left-2.5 h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
        kind === "next"
          ? "bg-white text-black"
          : "border border-white/15 bg-[var(--jetic-well)] text-white"
      }`}
    >
      {kind === "next" ? "N" : "EX"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Source previews                               */
/* -------------------------------------------------------------------------- */

const previewTransform = {
  transform: "perspective(800px) rotateX(8deg) rotateZ(-1deg)",
};

function BlankPreview() {
  const panelClass =
    "absolute inset-x-4 -bottom-8 block h-[118px] overflow-hidden rounded-xl border border-white/30 bg-white p-3 shadow-[0_24px_50px_rgba(0,0,0,0.55)]";

  return (
    <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
      <span className={panelClass} style={previewTransform}>
        <span className="flex items-center justify-between">
          <span className="h-1.5 w-14 rounded-full bg-black/20" />
          <span className="flex gap-1">
            <span className="h-1 w-1 rounded-full bg-black/15" />
            <span className="h-1 w-1 rounded-full bg-black/15" />
            <span className="h-1 w-1 rounded-full bg-black/15" />
          </span>
        </span>
        <span className="mt-3 grid grid-cols-[1fr_58px] gap-2">
          <span className="flex flex-col gap-1.5">
            <span className="h-1.5 w-24 rounded-full bg-black/15" />
            <span className="h-1.5 w-16 rounded-full bg-black/10" />
            <span className="h-1.5 w-20 rounded-full bg-black/10" />
          </span>
          <span className="flex items-center justify-center rounded-md border border-dashed border-black/20 text-black/30">
            <PackageOpen size={16} strokeWidth={1.6} />
          </span>
        </span>
        <span className="mt-3 block h-1.5 w-28 rounded-full bg-black/[0.06]" />
      </span>
    </span>
  );
}

function GithubPreview() {
  const files = ["README.md", "src", "package.json"];
  const panelClass =
    "absolute inset-x-4 -bottom-8 block h-[118px] overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] p-3 shadow-[0_24px_50px_rgba(0,0,0,0.55)]";

  return (
    <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
      <span className={panelClass} style={previewTransform}>
        <span className="flex items-center gap-1.5 text-[8.5px] text-white/50">
          <GitBranch size={10} />
          main
          <span className="ml-auto rounded-full border border-white/10 px-1.5 py-0.5 text-[7.5px]">
            Public
          </span>
        </span>
        <span className="mt-2.5 block space-y-1">
          {files.map((file) => (
            <span
              key={file}
              className="flex items-center gap-1.5 rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-1 text-[8px] text-white/45"
            >
              <span className="h-1 w-1 rounded-full bg-white/25" />
              {file}
            </span>
          ))}
        </span>
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Small pieces                                */
/* -------------------------------------------------------------------------- */

const fieldLabel = "jetic-muted mb-2 block text-[13px]";

const STEPS: { id: Step; label: string }[] = [
  { id: "source", label: "Source" },
  { id: "repositories", label: "Repository" },
  { id: "configure", label: "Configure" },
];

/** Shared numbered progress bar rendered above every wizard step. */
function StepProgress({ current }: { current: number }) {
  return (
    <div className="border-b border-white/10 bg-[var(--jetic-well)] px-5 py-3">
      <ol
        aria-label="Sandbox creation progress"
        className="flex items-center gap-2 sm:gap-3"
      >
        {STEPS.map((item, index) => {
          const done = index < current;
          const active = index === current;
          return (
            <li
              key={item.id}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-2 sm:gap-2.5 ${
                index < STEPS.length - 1 ? "flex-1" : ""
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
                  active
                    ? "border-white bg-white text-black"
                    : done
                      ? "border-white/30 bg-[var(--jetic-recess)] text-white"
                      : "border-white/10 bg-[var(--jetic-recess)] text-[var(--jetic-faint)]"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`hidden whitespace-nowrap text-[11.5px] font-medium transition-colors sm:block ${
                  active
                    ? "text-white"
                    : done
                      ? "text-[var(--jetic-emphasis)]"
                      : "text-[var(--jetic-muted)]"
                }`}
              >
                {item.label}
              </span>
              {index < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`mx-0.5 h-px min-w-4 flex-1 transition-colors ${
                    done ? "bg-white/50" : "bg-white/10"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Select({
  options,
  value,
  onChange,
  label,
  compact = false,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className={`jetic-select ${compact ? "!h-10 text-[12.5px]" : ""}`}
      >
        {current.icon}
        <span className="min-w-0 flex-1 truncate">{current.label}</span>
        {current.badge && (
          <span
            className={`jetic-pill text-[11px] ${
              current.badgeTone === "pro" ? "jetic-pill-pro" : "jetic-pill-hobby"
            }`}
          >
            {current.badge}
          </span>
        )}
        <span className="jetic-muted shrink-0">
          <ChevronDown size={14} strokeWidth={2} />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="jetic-menu absolute left-0 right-0 top-[calc(100%+4px)] z-20"
        >
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className="jetic-menu-item"
              >
                {option.icon}
                <span className="flex-1 truncate">{option.label}</span>
                {option.badge && (
                  <span
                    className={`jetic-pill text-[11px] ${
                      option.badgeTone === "pro" ? "jetic-pill-pro" : "jetic-pill-hobby"
                    }`}
                  >
                    {option.badge}
                  </span>
                )}
                {option.value === value && <Check size={14} className="shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="jetic-card bg-[#1a1a1a]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-full items-center gap-2.5 rounded-xl px-3.5 text-left text-[14px] text-[#ededed] transition-colors hover:bg-[#1e1e1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <ChevronRight
          size={16}
          strokeWidth={2}
          className={`transition-transform ${open ? "rotate-90" : ""}`}
        />
        {title}
      </button>
      {open && <div className="border-t border-white/10 p-4">{children}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Dialog                                   */
/* -------------------------------------------------------------------------- */

/**
 * Multi-step sandbox creation dialog.
 *
 *   source       → choose where the sandbox comes from (GitHub for now)
 *   repositories → pick a GitHub account + repository
 *   configure    → name the sandbox and adjust runtime settings
 *
 * The dialog is intentionally UI-driven for now: repository data is static and
 * the final action routes to the sandbox route after the configuration step.
 */
export function CreateSandboxDialog({
  workspaceSlug,
  workspaceName,
  workspacePlan = "hobby",
  onClose,
}: {
  workspaceSlug: string;
  workspaceName?: string;
  workspacePlan?: Plan;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("source");
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [repoQuery, setRepoQuery] = useState("");
  const [repository, setRepository] = useState<Repository | null>(null);
  const [team, setTeam] = useState("workspace");
  const [name, setName] = useState("untitled-sandbox");
  const [rootDir, setRootDir] = useState("./");
  const [language, setLanguage] = useState("vite");
  const [buildCommand, setBuildCommand] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  const accountOptions = useMemo<SelectOption[]>(
    () =>
      ACCOUNTS.map((account) => ({
        value: account.id,
        label: account.label,
        icon: <GitHubIcon size={14} />,
      })),
    [],
  );

  const teamOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: "workspace",
        label: workspaceName ?? workspaceSlug,
        icon: <span className="h-4 w-4 shrink-0 rounded-full bg-white" />,
        badge: workspacePlan === "pro" ? "Pro" : "Hobby",
        badgeTone: workspacePlan,
      },
    ],
    [workspaceName, workspacePlan, workspaceSlug],
  );

  const repositories = useMemo(() => {
    const query = repoQuery.trim().toLowerCase();
    return REPOSITORIES.filter(
      (repo) =>
        repo.owner === accountId &&
        (query === "" || repo.name.toLowerCase().includes(query)),
    );
  }, [accountId, repoQuery]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const chooseRepository = (repo: Repository) => {
    setRepository(repo);
    setName(slugify(repo.name) || "untitled-sandbox");
    setStep("configure");
  };

  const updateEnv = (index: number, field: "key" | "value", value: string) => {
    setEnvVars((rows) =>
      rows.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    );
  };

  const startSandbox = () => {
    const slug = slugify(name.trim());
    if (!slug) return;
    onClose();
    router.push(
      `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(slug)}`,
    );
  };

  const heading =
    step === "source"
      ? {
          title: "Create a sandbox",
          description:
            "Start from nothing, or bring in a repository from your provider.",
        }
      : step === "repositories"
        ? {
            title: "Import Git Repository",
            description: "Choose a repository to start a new sandbox.",
          }
        : {
            title: "New Sandbox",
            description: "Review the repository and configure the runtime.",
          };

  const stepIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-sandbox-title"
        className={`jetic-surface flex max-h-[min(880px,calc(100dvh_-_2rem))] w-full flex-col overflow-hidden rounded border border-white/10 bg-[var(--jetic-bg)] text-white shadow-2xl ${
          step === "configure" ? "max-w-2xl" : "max-w-4xl"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {step !== "source" && (
                <button
                  type="button"
                  aria-label="Go back"
                  onClick={() =>
                    setStep(step === "configure" ? "repositories" : "source")
                  }
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <ChevronRight size={16} strokeWidth={2} className="rotate-180" />
                </button>
              )}
              <h2
                id="create-sandbox-title"
                className="truncate text-[20px] font-semibold tracking-tight"
              >
                {heading.title}
              </h2>
            </div>
            <p className="jetic-muted mt-1 text-[13px]">{heading.description}</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <X size={16} />
          </button>
        </div>

        <StepProgress current={stepIndex} />

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {step === "source" && (
            <div
              role="radiogroup"
              aria-label="Sandbox source"
              className="grid gap-2 sm:grid-cols-2"
            >
              {/* Blank sandboxes are locked until the runtime exists. */}
              <div
                aria-disabled="true"
                title="Coming soon"
                className="group relative flex cursor-not-allowed flex-col overflow-hidden rounded-lg border border-white/10 bg-[var(--jetic-recess)]"
              >
                <div className="pointer-events-none select-none opacity-70 blur-[1.5px]">
                  <div className="block p-3.5 pr-9">
                    <span className="block text-[13.5px] font-semibold">
                      Blank Sandbox
                    </span>
                    <span className="jetic-muted mt-1 block text-[11.5px] leading-5">
                      Start with an empty sandbox and add files yourself.
                    </span>
                  </div>
                  <BlankPreview />
                </div>

                <div className="absolute inset-0 z-10 flex items-center justify-center">
                  <span className="relative">
                    <button
                      type="button"
                      aria-label="Blank Sandbox is coming soon"
                      title="Coming soon"
                      onClick={(event) => event.preventDefault()}
                      className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full border border-white/20 bg-[var(--jetic-bg)]/85 text-white shadow-lg backdrop-blur-sm"
                    >
                      <Lock size={13} />
                    </button>
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[var(--jetic-bg)] px-2 py-1 text-[10.5px] font-medium text-[var(--jetic-emphasis)] opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                    >
                      Coming soon
                    </span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("repositories")}
                className="relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[var(--jetic-recess)] text-left transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span className="block p-3.5 pr-9">
                  <span className="block text-[13.5px] font-semibold">
                    Import from GitHub
                  </span>
                  <span className="jetic-muted mt-1 block text-[11.5px] leading-5">
                    Clone a repository and open it in a fresh sandbox.
                  </span>
                </span>
                <GithubPreview />
              </button>
            </div>
          )}

          {step === "repositories" && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <Select
                  options={accountOptions}
                  value={accountId}
                  onChange={setAccountId}
                  label="GitHub account"
                  compact
                />

                <label className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[var(--jetic-recess)] px-3 text-[var(--jetic-muted)] transition-colors focus-within:border-white/20">
                  <Search size={14} />
                  <input
                    type="text"
                    value={repoQuery}
                    onChange={(event) => setRepoQuery(event.target.value)}
                    placeholder="Search"
                    aria-label="Search repositories"
                    className="min-w-0 flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-[var(--jetic-muted)]"
                  />
                </label>
              </div>

              <div className="overflow-hidden rounded-lg border border-white/10 bg-[var(--jetic-well)]">
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"
                  >
                    <RepoIcon kind={repo.icon} />
                    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[13.5px]">
                      <span className="truncate font-semibold text-white">
                        {repo.name}
                      </span>
                      {repo.isPrivate && (
                        <Lock
                          size={11}
                          className="shrink-0 text-[var(--jetic-muted)]"
                          aria-label="Private repository"
                        />
                      )}
                      <span className="text-[var(--jetic-faint)]">·</span>
                      <span className="jetic-muted shrink-0 text-[12px]">
                        {repo.updated}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => chooseRepository(repo)}
                      className="flex h-7 shrink-0 items-center rounded-md bg-white px-3 text-[12px] font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Import
                    </button>
                  </div>
                ))}

                {repositories.length === 0 && (
                  <p className="jetic-muted px-4 py-8 text-center text-[12.5px]">
                    No repositories match &ldquo;{repoQuery}&rdquo;.
                  </p>
                )}
              </div>
            </div>
          )}

          {step === "configure" && repository && (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-[var(--jetic-recess)] px-3 py-2.5">
                <p className="jetic-muted text-[12px]">Importing from GitHub</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-white">
                    <span className="shrink-0">
                      <GitHubIcon size={16} />
                    </span>
                    <span className="truncate">
                      {repository.owner.toUpperCase()}/{repository.name.toUpperCase()}
                    </span>
                  </span>
                  <span className="jetic-muted flex items-center gap-1.5 font-mono text-[12px]">
                    <GitBranch size={13} />
                    main
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep("repositories")}
                    className="ml-auto text-[12px] font-medium text-[var(--jetic-emphasis)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    Change
                  </button>
                </div>
              </div>

              <p className="text-[13.5px] text-white">
                Choose where you want to create the project and give it a name.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
                <div className="min-w-0 flex-1">
                  <span className={fieldLabel}>Jetic Team</span>
                  <Select
                    options={teamOptions}
                    value={team}
                    onChange={setTeam}
                    label="Jetic Team"
                  />
                </div>

                <span
                  aria-hidden="true"
                  className="hidden pb-2.5 text-[22px] font-light text-[var(--jetic-ring)] sm:block"
                >
                  /
                </span>

                <div className="min-w-0 flex-1">
                  <label htmlFor="sandbox-name" className={fieldLabel}>
                    Sandbox Name
                  </label>
                  <input
                    id="sandbox-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="jetic-input"
                    placeholder="untitled-sandbox"
                  />
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="root-directory" className={fieldLabel}>
                    Root Directory
                  </label>
                  <div className="relative">
                    <span className="jetic-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                      <Folder size={15} />
                    </span>
                    <input
                      id="root-directory"
                      type="text"
                      value={rootDir}
                      onChange={(event) => setRootDir(event.target.value)}
                      className="jetic-input pl-9 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className={fieldLabel}>Language</span>
                  <Select
                    options={LANGUAGES}
                    value={language}
                    onChange={setLanguage}
                    label="Language"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <Accordion title="Build and Output Settings">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="build-command" className={fieldLabel}>
                        Build Command
                      </label>
                      <input
                        id="build-command"
                        type="text"
                        value={buildCommand}
                        onChange={(event) => setBuildCommand(event.target.value)}
                        placeholder="npm run build"
                        className="jetic-input font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="output-directory" className={fieldLabel}>
                        Output Directory
                      </label>
                      <input
                        id="output-directory"
                        type="text"
                        value={outputDirectory}
                        onChange={(event) => setOutputDirectory(event.target.value)}
                        placeholder="dist"
                        className="jetic-input font-mono"
                      />
                    </div>
                  </div>
                </Accordion>

                <Accordion title="Environment Variables">
                  <div className="flex flex-col gap-2">
                    {envVars.map((row, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          aria-label="Key"
                          value={row.key}
                          onChange={(event) => updateEnv(index, "key", event.target.value)}
                          placeholder="EXAMPLE_NAME"
                          className="jetic-input font-mono"
                        />
                        <input
                          type="text"
                          aria-label="Value"
                          value={row.value}
                          onChange={(event) => updateEnv(index, "value", event.target.value)}
                          placeholder="I9JU23NF394R6HH"
                          className="jetic-input font-mono"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEnvVars((rows) => [...rows, { key: "", value: "" }])
                      }
                      className="mt-1 self-start text-[13px] font-semibold text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      Add another
                    </button>
                  </div>
                </Accordion>
              </div>

              <div>
                <button
                  type="button"
                  onClick={startSandbox}
                  disabled={!name.trim()}
                  className="jetic-btn flex items-center justify-center"
                >
                  Start
                </button>
                <p className="jetic-muted mt-2 text-center text-[11px]">
                  You can change these settings later in the sandbox.
                </p>
              </div>
            </div>
          )}
        </div>

        {step !== "configure" && (
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3">
            <p className="jetic-muted min-w-0 flex-1 text-[11.5px]">
              {step === "source"
                ? "Blank sandboxes are coming soon. Import from GitHub to continue."
                : "Pick a repository from your connected GitHub account."}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              {step === "repositories" && (
                <button
                  type="button"
                  onClick={() => setStep("source")}
                  className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
