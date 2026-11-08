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
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Folder,
  GitBranch,
  Loader2,
  Lock,
  PackageOpen,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { JeticAnimatedIcon } from "@/components/jetic-animated-icon";
import { GitHubIcon } from "@/components/icons/github-icon";
import {
  selectGithubConnected,
  selectGithubReady,
  useGithubStore,
  useSandboxDraftStore,
  useUserStore,
} from "@/context";
import { createSandbox, getSandboxStatus, startSandbox } from "@/features/sandbox/sandbox.api";
import type { Sandbox } from "@/features/sandbox/types";
import type { GitHubBranch, GitHubRepository } from "@/features/github/types";
import type { Plan } from "@/features/workspace/types";
import { errorMessage } from "@/lib/api/browser";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

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

const LANGUAGES: SelectOption[] = [
  {
    value: "node",
    label: "Node.js",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#68a063] text-[9px] font-bold text-black">
        JS
      </span>
    ),
  },
  {
    value: "nextjs",
    label: "Next.js",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
        N
      </span>
    ),
  },
  { value: "vite", label: "Vite", icon: <ViteMark size={18} /> },
  {
    value: "python",
    label: "Python",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#3776ab] text-[9px] font-bold text-white">
        Py
      </span>
    ),
  },
  {
    value: "go",
    label: "Go",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#00add8] text-[9px] font-bold text-black">
        Go
      </span>
    ),
  },
  {
    value: "rust",
    label: "Rust",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#ce422b] text-[9px] font-bold text-white">
        Rs
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

function RepoMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0d1117] text-white"
    >
      <GitHubIcon size={16} />
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
const primaryButton =
  "inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-white px-4 text-[13px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-40";
const secondaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40";

const STEPS: { id: "source" | "repositories" | "configure" | "create"; label: string }[] = [
  { id: "source", label: "Source" },
  { id: "repositories", label: "Repository" },
  { id: "configure", label: "Configure" },
  { id: "create", label: "Create" },
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
  disabled = false,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  compact?: boolean;
  disabled?: boolean;
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
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        className={`jetic-select ${compact ? "!h-10 text-[12.5px]" : ""}`}
      >
        {current?.icon ?? <GitHubIcon size={14} />}
        <span className="min-w-0 flex-1 truncate">
          {current?.label ?? "Select"}
        </span>
        {current?.badge && (
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

      {open && options.length > 0 && (
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

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
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

function formatUpdated(value: string): string {
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

function repositoryKey(repository: GitHubRepository): string {
  return `${repository.owner}/${repository.name}`.toLowerCase();
}

/* -------------------------------------------------------------------------- */
/*                                   Dialog                                   */
/* -------------------------------------------------------------------------- */

export function CreateSandboxDialog({
  workspaceId,
  workspaceSlug,
  workspaceName,
  workspacePlan = "hobby",
  onClose,
}: {
  workspaceId: string;
  workspaceSlug: string;
  workspaceName?: string;
  workspacePlan?: Plan;
  onClose: () => void;
}) {
  const router = useRouter();

  const userStatus = useUserStore((state) => state.status);
  const userError = useUserStore((state) => state.error);
  const githubConnected = useUserStore(selectGithubConnected);
  const githubReady = useUserStore(selectGithubReady);
  const githubUsername = useUserStore(
    (state) => state.github?.username ?? state.user?.githubUsername ?? null,
  );
  const loadUser = useUserStore((state) => state.load);

  const accounts = useGithubStore((state) => state.accounts);
  const accountsStatus = useGithubStore((state) => state.accountsStatus);
  const accountsError = useGithubStore((state) => state.accountsError);
  const repositories = useGithubStore((state) => state.repositories);
  const repositoriesStatus = useGithubStore((state) => state.repositoriesStatus);
  const repositoriesError = useGithubStore((state) => state.repositoriesError);
  const repositoriesLoadingMore = useGithubStore(
    (state) => state.repositoriesLoadingMore,
  );
  const repositoryOwner = useGithubStore((state) => state.repositoryOwner);
  const repositoryPage = useGithubStore((state) => state.repositoryPage);
  const branchesByKey = useGithubStore((state) => state.branches);
  const branchStatus = useGithubStore((state) => state.branchStatus);
  const branchError = useGithubStore((state) => state.branchError);
  const loadAccounts = useGithubStore((state) => state.loadAccounts);
  const loadRepositories = useGithubStore((state) => state.loadRepositories);
  const loadBranches = useGithubStore((state) => state.loadBranches);
  const resetGithub = useGithubStore((state) => state.reset);

  const step = useSandboxDraftStore((state) => state.step);
  const selectedRepository = useSandboxDraftStore(
    (state) => state.selectedRepository,
  );
  const branch = useSandboxDraftStore((state) => state.branch);
  const name = useSandboxDraftStore((state) => state.name);
  const rootDirectory = useSandboxDraftStore((state) => state.rootDirectory);
  const language = useSandboxDraftStore((state) => state.language);
  const buildCommand = useSandboxDraftStore((state) => state.buildCommand);
  const outputDirectory = useSandboxDraftStore((state) => state.outputDirectory);
  const envVars = useSandboxDraftStore((state) => state.envVars);
  const creating = useSandboxDraftStore((state) => state.creating);
  const sandboxId = useSandboxDraftStore((state) => state.sandboxId);
  const sandbox = useSandboxDraftStore((state) => state.sandbox);
  const createError = useSandboxDraftStore((state) => state.error);
  const setStep = useSandboxDraftStore((state) => state.setStep);
  const selectRepository = useSandboxDraftStore((state) => state.selectRepository);
  const setBranch = useSandboxDraftStore((state) => state.setBranch);
  const setName = useSandboxDraftStore((state) => state.setName);
  const setRootDirectory = useSandboxDraftStore((state) => state.setRootDirectory);
  const setLanguage = useSandboxDraftStore((state) => state.setLanguage);
  const setBuildCommand = useSandboxDraftStore((state) => state.setBuildCommand);
  const setOutputDirectory = useSandboxDraftStore(
    (state) => state.setOutputDirectory,
  );
  const setEnvVar = useSandboxDraftStore((state) => state.setEnvVar);
  const addEnvVar = useSandboxDraftStore((state) => state.addEnvVar);
  const removeEnvVar = useSandboxDraftStore((state) => state.removeEnvVar);
  const beginCreate = useSandboxDraftStore((state) => state.beginCreate);
  const created = useSandboxDraftStore((state) => state.created);
  const failed = useSandboxDraftStore((state) => state.failed);
  const resetDraft = useSandboxDraftStore((state) => state.reset);

  const [repoQuery, setRepoQuery] = useState("");

  /* Reset the wizard when the dialog mounts. */
  useEffect(() => {
    resetDraft();
    resetGithub();
  }, [resetDraft, resetGithub]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Load GitHub accounts when entering the repository picker. */
  useEffect(() => {
    if (step !== "repositories" || !githubReady) return;
    void loadAccounts();
  }, [step, githubReady, loadAccounts]);

  /* Default to the first account (the connected user) once accounts arrive. */
  useEffect(() => {
    if (step !== "repositories" || !githubReady || repositoryOwner !== null) return;
    const first = accounts[0];
    if (!first) return;
    void loadRepositories({ owner: first.login, query: "", force: true });
  }, [step, githubReady, repositoryOwner, accounts, loadRepositories]);

  /* Load branches for the selected repository. */
  useEffect(() => {
    if (step !== "configure" || !selectedRepository) return;
    void loadBranches(selectedRepository.owner, selectedRepository.name);
  }, [step, selectedRepository, loadBranches]);

  /* Poll the API while the sandbox is being provisioned. */
  useEffect(() => {
    if (step !== "create" || !sandboxId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const result = await getSandboxStatus(workspaceId, sandboxId);
        if (!cancelled) created(result.sandbox);
      } catch (error) {
        if (!cancelled) failed(errorMessage(error));
      }
    };

    void poll();
    const interval = window.setInterval(() => {
      void poll();
    }, 2_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [step, sandboxId, workspaceId, created, failed]);

  function handleClose() {
    resetDraft();
    resetGithub();
    onClose();
  }

  const connectGithub = () => {
    const next =
      typeof window === "undefined" ? undefined : window.location.pathname;
    const destination = `/api/auth/github/connect${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    window.location.assign(
      typeof window === "undefined"
        ? destination
        : new URL(destination, window.location.origin).toString(),
    );
  };

  const handleGithubCard = () => {
    if (userStatus === "loading" || userStatus === "idle") return;
    if (!githubConnected) {
      connectGithub();
      return;
    }
    if (!githubReady) {
      connectGithub();
      return;
    }
    setStep("repositories");
  };

  const accountOptions = useMemo<SelectOption[]>(
    () =>
      accounts.map((account) => ({
        value: account.login,
        label:
          account.type === "organization"
            ? `${account.login} (organization)`
            : account.login,
        icon: <GitHubIcon size={14} />,
      })),
    [accounts],
  );

  const selectedOwner = repositoryOwner ?? accounts[0]?.login ?? null;

  const filteredRepositories = useMemo(() => {
    const query = repoQuery.trim().toLowerCase();
    if (!query) return repositories;
    return repositories.filter(
      (repository) =>
        repository.name.toLowerCase().includes(query) ||
        repository.fullName.toLowerCase().includes(query) ||
        (repository.description?.toLowerCase().includes(query) ?? false),
    );
  }, [repositories, repoQuery]);

  const branches = useMemo(
    () =>
      selectedRepository
        ? (branchesByKey[repositoryKey(selectedRepository)] ?? [])
        : [],
    [selectedRepository, branchesByKey],
  );
  const branchKey = selectedRepository ? repositoryKey(selectedRepository) : "";

  const branchOptions = useMemo<SelectOption[]>(() => {
    const options = branches.map((item: GitHubBranch) => ({
      value: item.name,
      label: item.name,
      icon: <GitBranch size={14} />,
    }));
    if (branch && !options.some((option) => option.value === branch)) {
      options.unshift({
        value: branch,
        label: branch,
        icon: <GitBranch size={14} />,
      });
    }
    return options;
  }, [branches, branch]);

  const teamOptions = useMemo<SelectOption[]>(
    () => [
      {
        value: workspaceId,
        label: workspaceName ?? workspaceSlug,
        icon: <span className="h-4 w-4 shrink-0 rounded-full bg-white" />,
        badge: workspacePlan === "pro" ? "Pro" : "Hobby",
        badgeTone: workspacePlan,
      },
    ],
    [workspaceId, workspaceName, workspacePlan, workspaceSlug],
  );

  const updateEnv = (index: number, field: "key" | "value", value: string) => {
    setEnvVar(index, field, value);
  };

  const startCreation = async () => {
    if (!selectedRepository) return;
    const trimmedName = name.trim() || selectedRepository.name;
    beginCreate();

    try {
      const result = await createSandbox(workspaceId, {
        name: trimmedName,
        repository: {
          owner: selectedRepository.owner,
          name: selectedRepository.name,
          branch,
        },
        rootDirectory: rootDirectory.trim() || ".",
        language,
        buildCommand: buildCommand.trim() || null,
        outputDirectory: outputDirectory.trim() || null,
        environmentVariables: envVars
          .filter((row) => row.key.trim().length > 0)
          .map((row) => ({
            key: row.key.trim(),
            value: row.value,
            isSecret: true,
          })),
      });
      created(result.sandbox);
    } catch (error) {
      failed(errorMessage(error));
    }
  };

  const retryProvisioning = async () => {
    if (!sandboxId) {
      setStep("configure");
      return;
    }
    try {
      const result = await startSandbox(workspaceId, sandboxId);
      created(result.sandbox);
    } catch (error) {
      failed(errorMessage(error));
    }
  };

  const openSandbox = () => {
    if (!sandbox) return;
    const href = `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}?setup=1`;
    handleClose();
    router.push(href);
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
        : step === "configure"
          ? {
              title: "New Sandbox",
              description: "Review the repository and configure the runtime.",
            }
          : {
              title: "Setting up your sandbox",
              description: "Importing the repository and starting the runtime.",
            };

  const stepIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-sandbox-title"
        className={`jetic-surface flex max-h-[min(880px,calc(100dvh_-_2rem))] w-full flex-col overflow-hidden rounded border border-white/10 bg-[var(--jetic-bg)] text-white shadow-2xl ${
          step === "configure" || step === "create" ? "max-w-2xl" : "max-w-4xl"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {step !== "source" && step !== "create" && (
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
            onClick={handleClose}
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
                onClick={handleGithubCard}
                className="relative flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[var(--jetic-recess)] text-left transition-colors hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <span className="block p-3.5 pr-9">
                  <span className="flex items-center gap-2">
                    <span className="block text-[13.5px] font-semibold">
                      {githubConnected ? "Import from GitHub" : "Connect GitHub"}
                    </span>
                    {githubConnected && githubUsername && (
                      <span className="jetic-pill jetic-pill-hobby text-[10px]">
                        @{githubUsername}
                      </span>
                    )}
                  </span>
                  <span className="jetic-muted mt-1 block text-[11.5px] leading-5">
                    {userStatus === "loading" || userStatus === "idle"
                      ? "Checking your GitHub connection…"
                      : githubConnected
                        ? githubReady
                          ? "Clone a repository and open it in a fresh sandbox."
                          : "Reconnect GitHub to grant repository access."
                        : "Link your GitHub account to list repositories."}
                  </span>
                  {userStatus === "error" && (
                    <span className="mt-2 flex items-center gap-1.5 text-[11px] text-red-300">
                      <AlertCircle size={12} />
                      {userError ?? "Could not check GitHub."}
                    </span>
                  )}
                </span>
                <GithubPreview />
              </button>
            </div>
          )}

          {step === "repositories" && (
            <div className="flex flex-col gap-4">
              {!githubConnected || !githubReady ? (
                <div className="flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-[var(--jetic-recess)] px-6 py-14 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#0d1117]">
                    <GitHubIcon size={22} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">
                      {githubConnected ? "Reconnect GitHub" : "Connect GitHub"}
                    </h3>
                    <p className="jetic-muted mx-auto mt-1 max-w-sm text-[12.5px] leading-5">
                      {githubConnected
                        ? "Your GitHub authorization is missing the repository scope. Reconnect to browse and clone your repositories."
                        : "Jetic uses GitHub to list your repositories and clone the one you choose into a sandbox."}
                    </p>
                  </div>
                  <button type="button" onClick={connectGithub} className={primaryButton}>
                    <GitHubIcon size={14} />
                    {githubConnected ? "Reconnect GitHub" : "Connect GitHub"}
                  </button>
                  {userStatus === "error" && (
                    <button
                      type="button"
                      onClick={() => void loadUser({ force: true })}
                      className="text-[12px] text-[var(--jetic-link)] hover:underline"
                    >
                      Retry connection check
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                    {accountsStatus === "loading" && accounts.length === 0 ? (
                      <div className="jetic-select !h-10 cursor-default">
                        <span className="jetic-shimmer h-3 w-24 rounded-full" />
                      </div>
                    ) : (
                      <Select
                        options={accountOptions}
                        value={selectedOwner ?? ""}
                        onChange={(owner) => {
                          setRepoQuery("");
                          void loadRepositories({ owner, query: "", force: true });
                        }}
                        label="GitHub account"
                        compact
                        disabled={accountsStatus === "loading"}
                      />
                    )}

                    <label className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[var(--jetic-recess)] px-3 text-[var(--jetic-muted)] transition-colors focus-within:border-white/20">
                      <Search size={14} />
                      <input
                        type="text"
                        value={repoQuery}
                        onChange={(event) => setRepoQuery(event.target.value)}
                        placeholder="Search repositories"
                        aria-label="Search repositories"
                        className="min-w-0 flex-1 bg-transparent text-[12.5px] text-white outline-none placeholder:text-[var(--jetic-muted)]"
                      />
                      {repoQuery && (
                        <button
                          type="button"
                          aria-label="Clear search"
                          onClick={() => setRepoQuery("")}
                          className="rounded p-0.5 text-[var(--jetic-muted)] hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </label>
                  </div>

                  {accountsError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[12px] text-red-300"
                    >
                      <AlertCircle size={14} />
                      <span className="min-w-0 flex-1">{accountsError}</span>
                      <button
                        type="button"
                        onClick={connectGithub}
                        className="shrink-0 font-medium text-white hover:underline"
                      >
                        Reconnect
                      </button>
                    </div>
                  )}

                  <div className="overflow-hidden rounded-lg border border-white/10 bg-[var(--jetic-well)]">
                    {(repositoriesStatus === "loading" ||
                      (accountsStatus === "loading" && repositories.length === 0)) &&
                      Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"
                        >
                          <span className="jetic-shimmer h-8 w-8 rounded-lg" />
                          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <span className="jetic-shimmer h-3 w-40 rounded-full" />
                            <span className="jetic-shimmer h-2.5 w-24 rounded-full" />
                          </span>
                          <span className="jetic-shimmer h-7 w-16 rounded-md" />
                        </div>
                      ))}

                    {repositoriesStatus === "error" && repositories.length === 0 && (
                      <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                        <AlertCircle size={20} className="text-red-300" />
                        <p className="max-w-sm text-[12.5px] leading-5 text-red-200">
                          {repositoriesError ?? "Repositories could not be loaded."}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            void loadRepositories({
                              owner: selectedOwner,
                              query: repoQuery,
                              force: true,
                            })
                          }
                          className={secondaryButton}
                        >
                          <RefreshCw size={13} />
                          Retry
                        </button>
                      </div>
                    )}

                    {repositoriesStatus !== "loading" &&
                      filteredRepositories.map((repository) => (
                        <div
                          key={repository.id}
                          className="flex items-center gap-3 border-b border-white/10 px-4 py-3 last:border-b-0"
                        >
                          <RepoMark />
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <div className="flex min-w-0 items-center gap-1.5 text-[13.5px]">
                              <span className="truncate font-semibold text-white">
                                {repository.name}
                              </span>
                              {repository.isPrivate && (
                                <Lock
                                  size={11}
                                  className="shrink-0 text-[var(--jetic-muted)]"
                                  aria-label="Private repository"
                                />
                              )}
                              {repository.language && (
                                <>
                                  <span className="text-[var(--jetic-faint)]">·</span>
                                  <span className="jetic-muted shrink-0 text-[11.5px]">
                                    {repository.language}
                                  </span>
                                </>
                              )}
                              <span className="text-[var(--jetic-faint)]">·</span>
                              <span className="jetic-muted shrink-0 text-[11.5px]">
                                {formatUpdated(repository.updatedAt)}
                              </span>
                            </div>
                            <p className="jetic-muted truncate text-[11.5px]">
                              {repository.description ??
                                `${repository.owner}/${repository.name}`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => selectRepository(repository)}
                            className="flex h-7 shrink-0 items-center rounded-md bg-white px-3 text-[12px] font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          >
                            Import
                          </button>
                        </div>
                      ))}

                    {repositoriesStatus !== "loading" &&
                      filteredRepositories.length === 0 &&
                      repositories.length > 0 && (
                        <p className="jetic-muted px-4 py-8 text-center text-[12.5px]">
                          No repositories match &ldquo;{repoQuery}&rdquo;.
                        </p>
                      )}

                    {repositoriesStatus !== "loading" && repositories.length === 0 && (
                      <p className="jetic-muted px-4 py-8 text-center text-[12.5px]">
                        This account has no repositories available.
                      </p>
                    )}
                  </div>

                  {repositoryPage.hasMore && (
                    <div className="flex justify-center">
                      <button
                        type="button"
                        disabled={repositoriesLoadingMore}
                        onClick={() =>
                          void loadRepositories({
                            owner: selectedOwner,
                            query: repoQuery,
                            page: repositoryPage.page + 1,
                            append: true,
                          })
                        }
                        className={secondaryButton}
                      >
                        {repositoriesLoadingMore ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <RefreshCw size={13} />
                        )}
                        Load more repositories
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {step === "configure" && selectedRepository && (
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-[var(--jetic-recess)] px-3 py-2.5">
                <p className="jetic-muted text-[12px]">Importing from GitHub</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] font-semibold text-white">
                    <span className="shrink-0">
                      <GitHubIcon size={16} />
                    </span>
                    <span className="truncate">
                      {selectedRepository.owner}/{selectedRepository.name}
                    </span>
                  </span>
                  <span className="jetic-muted flex items-center gap-1.5 font-mono text-[12px]">
                    <GitBranch size={13} />
                    {branch}
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
                    value={workspaceId}
                    onChange={() => undefined}
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
                  <span className={fieldLabel}>Branch</span>
                  <Select
                    options={branchOptions}
                    value={branch}
                    onChange={setBranch}
                    label="Branch"
                  />
                  {branchStatus[branchKey] === "loading" && (
                    <p className="jetic-muted mt-1.5 flex items-center gap-1.5 text-[11px]">
                      <Loader2 size={11} className="animate-spin" />
                      Loading branches…
                    </p>
                  )}
                  {branchStatus[branchKey] === "error" && (
                    <p className="mt-1.5 text-[11px] text-red-300">
                      {branchError[branchKey] ?? "Branches could not be loaded."}
                    </p>
                  )}
                </div>

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
                      value={rootDirectory}
                      onChange={(event) => setRootDirectory(event.target.value)}
                      className="jetic-input pl-9 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className={fieldLabel}>Language</span>
                  <Select
                    options={LANGUAGES}
                    value={language}
                    onChange={setLanguage}
                    label="Language"
                  />
                </div>
                <div>
                  <span className={fieldLabel}>Detected language</span>
                  <div className="jetic-input flex items-center">
                    {selectedRepository.language ?? "Not detected"}
                  </div>
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
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          aria-label="Key"
                          value={row.key}
                          onChange={(event) => updateEnv(index, "key", event.target.value)}
                          placeholder="EXAMPLE_NAME"
                          className="jetic-input flex-1 font-mono"
                        />
                        <input
                          type="text"
                          aria-label="Value"
                          value={row.value}
                          onChange={(event) =>
                            updateEnv(index, "value", event.target.value)
                          }
                          placeholder="I9JU23NF394R6HH"
                          className="jetic-input flex-1 font-mono"
                        />
                        <button
                          type="button"
                          aria-label="Remove variable"
                          onClick={() => removeEnvVar(index)}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addEnvVar}
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
                  onClick={() => void startCreation()}
                  disabled={!name.trim() || creating}
                  className="jetic-btn flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <JeticAnimatedIcon size={18} loop sheen="#000" className="text-black" />
                  ) : (
                    <GitHubIcon size={15} />
                  )}
                  Start
                </button>
                <p className="jetic-muted mt-2 text-center text-[11px]">
                  Jetic clones the repository into a Vercel Sandbox and starts your
                  runtime. You can change these settings later.
                </p>
              </div>
            </div>
          )}

          {step === "create" && (
            <CreateProgress
              sandbox={sandbox}
              creating={creating}
              error={createError}
              hasSandbox={Boolean(sandboxId)}
              onRetry={() => void retryProvisioning()}
              onOpen={openSandbox}
              onBack={() => setStep("configure")}
              onClose={handleClose}
            />
          )}
        </div>

        {(step === "source" || step === "repositories") && (
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
                  className={secondaryButton}
                >
                  Back
                </button>
              )}
              <button type="button" onClick={handleClose} className={secondaryButton}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Provision progress                             */
/* -------------------------------------------------------------------------- */

function CreateProgress({
  sandbox,
  creating,
  error,
  hasSandbox,
  onRetry,
  onOpen,
  onBack,
  onClose,
}: {
  sandbox: Sandbox | null;
  creating: boolean;
  error: string | null;
  hasSandbox: boolean;
  onRetry: () => void;
  onOpen: () => void;
  onBack: () => void;
  onClose: () => void;
}) {
  const status = sandbox?.status;
  const isError = status === "error" || (!hasSandbox && Boolean(error));
  const isActive = status === "active";
  const repositoryLabel = sandbox
    ? `${sandbox.repositoryOwner ?? ""}/${sandbox.repositoryName ?? ""}`.replace(/^\//, "")
    : null;

  const cloneState = isActive
    ? "done"
    : isError
      ? "error"
      : hasSandbox
        ? "active"
        : "pending";
  const runtimeState = isActive ? "done" : isError ? "error" : "pending";

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border ${
            isError
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : isActive
                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                : "border-white/10 bg-[var(--jetic-recess)] text-white"
          }`}
        >
          {isError ? (
            <AlertCircle size={24} />
          ) : (
            <JeticAnimatedIcon
              size={27}
              loop={!isActive}
              sheen="#fff"
              className="text-white"
            />
          )}
          {isActive && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/15 text-emerald-200">
              <Check size={11} strokeWidth={2.4} />
            </span>
          )}
        </span>
        <div>
          <h3 className="text-[16px] font-semibold">
            {isError
              ? "The import could not finish"
              : isActive
                ? "Sandbox is ready"
                : "Importing your repository"}
          </h3>
          <p className="jetic-muted mx-auto mt-1 max-w-md text-[12.5px] leading-5">
            {isError
              ? (sandbox?.lastError ?? error ?? "Something went wrong while creating the sandbox.")
              : isActive
                ? "Everything is ready. Open your sandbox to start exploring the API model and source."
                : "Jetic is cloning the repository into an isolated microVM. This usually takes a few seconds."}
          </p>
        </div>
      </div>

      {repositoryLabel && (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-[var(--jetic-recess)] px-4 py-3">
          <span className="flex min-w-0 items-center gap-2 text-[13px] font-semibold">
            <GitHubIcon size={15} />
            <span className="truncate">{repositoryLabel}</span>
          </span>
          {sandbox?.defaultBranch && (
            <span className="jetic-muted flex shrink-0 items-center gap-1.5 font-mono text-[11.5px]">
              <GitBranch size={12} />
              {sandbox.defaultBranch}
            </span>
          )}
        </div>
      )}

      <ol className="flex flex-col gap-1 rounded-xl border border-white/10 bg-[var(--jetic-well)] p-3">
        <ProgressRow state="done" label="Sandbox record created" />
        <ProgressRow
          state={cloneState}
          label="Cloning repository and checking out branch"
        />
        <ProgressRow
          state={runtimeState}
          label="Starting the runtime"
          note={
            sandbox?.runtimeProvider === "development" && isActive
              ? "Development runtime — configure Vercel Sandbox credentials to start a real microVM."
              : undefined
          }
        />
      </ol>

      {sandbox?.previewUrl && (
        <a
          href={sandbox.previewUrl}
          target="_blank"
          rel="noreferrer"
          className="text-center text-[12px] font-medium text-[var(--jetic-link)] hover:underline"
        >
          Open preview
        </a>
      )}

      {isActive ? (
        <div className="flex justify-center">
          <button type="button" onClick={onOpen} className={primaryButton}>
            Open sandbox
            <ArrowRight size={14} />
          </button>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={onRetry} className={primaryButton}>
            <RefreshCw size={14} />
            {hasSandbox ? "Retry import" : "Back to settings"}
          </button>
          {!hasSandbox && (
            <button type="button" onClick={onBack} className={secondaryButton}>
              Back
            </button>
          )}
          <button type="button" onClick={onClose} className={secondaryButton}>
            Close
          </button>
        </div>
      ) : creating ? (
        <div className="flex justify-center">
          <button type="button" onClick={onClose} className={secondaryButton}>
            Continue in background
          </button>
        </div>
      ) : null}
    </div>
  );
}

function ProgressRow({
  state,
  label,
  note,
}: {
  state: "pending" | "active" | "done" | "error";
  label: string;
  note?: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg px-2 py-2">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        {state === "done" ? (
          <CheckCircle2 size={16} className="text-emerald-300" />
        ) : state === "active" ? (
          <Loader2 size={16} className="animate-spin text-white" />
        ) : state === "error" ? (
          <AlertCircle size={16} className="text-red-300" />
        ) : (
          <Circle size={14} className="text-[var(--jetic-faint)]" />
        )}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-[12.5px] ${
            state === "pending" ? "text-[var(--jetic-muted)]" : "text-white"
          }`}
        >
          {label}
        </span>
        {note && <span className="jetic-muted mt-0.5 block text-[11px]">{note}</span>}
      </span>
    </li>
  );
}
