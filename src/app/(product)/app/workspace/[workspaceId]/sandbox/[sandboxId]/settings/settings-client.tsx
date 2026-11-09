"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Play,
  RefreshCw,
  Square,
  Trash2,
} from "lucide-react";

import { useSandboxPermissions } from "@/cache";
import { queryKeys } from "@/cache/query-keys";
import { AccessDenied } from "@/components/ui/access-denied";
import {
  archiveSandbox,
  deleteSandbox,
  restoreSandbox,
  startSandbox,
  stopSandbox,
  updateSandbox,
} from "@/features/sandbox/sandbox.api";
import { useSandboxContext } from "@/features/sandbox/use-sandbox-context";
import type { Sandbox } from "@/features/sandbox/types";
import { errorMessage } from "@/lib/api/browser";

function Card({
  title,
  description,
  children,
  footer,
  danger,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={`jetic-card rounded-lg bg-[var(--jetic-bg)] ${danger ? "border-red-500/25" : ""}`}
    >
      <div className="p-5">
        <h2 className="text-[18px] font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && (
          <div className="mt-1 text-[12.5px] leading-5 text-[var(--jetic-muted)]">
            {description}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
      {footer && (
        <div className="flex min-h-[3rem] flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3 text-[11.5px] text-[var(--jetic-muted)]">
          {footer}
        </div>
      )}
    </section>
  );
}

function Button({
  children,
  disabled,
  onClick,
  danger,
  icon,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
        disabled
          ? "cursor-not-allowed bg-white/[0.06] text-[var(--jetic-faint)]"
          : danger
            ? "bg-red-500/90 text-white hover:bg-red-500"
            : "bg-white text-black hover:bg-white/90"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

const inputClass =
  "h-9 w-full max-w-[420px] rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

function LabeledInput({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="jetic-muted text-[11px]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={inputClass}
      />
    </label>
  );
}

function formatRelative(value: string | null): string {
  if (!value) return "Never";
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

function applySandboxUpdate(
  queryClient: ReturnType<typeof useQueryClient>,
  workspaceSlug: string,
  sandbox: Sandbox,
  next: Sandbox,
) {
  queryClient.setQueryData(queryKeys.sandbox(workspaceSlug, sandbox.slug), {
    sandbox: next,
  });
  queryClient.setQueryData(queryKeys.sandbox(workspaceSlug, next.slug), {
    sandbox: next,
  });
  void queryClient.invalidateQueries({
    queryKey: queryKeys.workspaceSandboxes(workspaceSlug),
  });
}

export function SandboxSettingsClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { workspaceSlug, sandbox, status, error, reload } = useSandboxContext();
  const permissionsQuery = useSandboxPermissions(
    workspaceSlug,
    sandbox?.id ?? null,
  );

  const permissions = permissionsQuery.data?.permissions ?? {};
  const canManage = permissions["sandbox.settings.manage"] === true;
  const canDelete = permissions["sandbox.delete"] === true;
  const canRuntime = permissions["sandbox.runtime.manage"] === true;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [rootDirectory, setRootDirectory] = useState(".");
  const [buildCommand, setBuildCommand] = useState("");
  const [outputDirectory, setOutputDirectory] = useState("");
  const [saved, setSaved] = useState({
    name: "",
    slug: "",
    description: "",
    branch: "",
    rootDirectory: ".",
    buildCommand: "",
    outputDirectory: "",
  });
  const [busy, setBusy] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (!sandbox) return;
    const next = {
      name: sandbox.name,
      slug: sandbox.slug,
      description: sandbox.description ?? "",
      branch: sandbox.defaultBranch ?? "",
      rootDirectory: sandbox.rootDirectory,
      buildCommand: sandbox.buildCommand ?? "",
      outputDirectory: sandbox.outputDirectory ?? "",
    };
    setName(next.name);
    setSlug(next.slug);
    setDescription(next.description);
    setBranch(next.branch);
    setRootDirectory(next.rootDirectory);
    setBuildCommand(next.buildCommand);
    setOutputDirectory(next.outputDirectory);
    setSaved(next);
  }, [sandbox]);

  useEffect(() => {
    if (!deleteOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleteOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteOpen]);

  if (status === "loading") {
    return (
      <main className="jetic-surface min-h-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
          <span className="jetic-shimmer h-7 w-56 rounded-md" />
          <span className="jetic-shimmer h-3 w-80 rounded-full" />
          <div className="jetic-card h-52 rounded-lg bg-[var(--jetic-bg)] p-5">
            <span className="jetic-shimmer h-3 w-32 rounded-full" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <span
                  key={index}
                  className="jetic-shimmer h-10 w-full rounded-md"
                />
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

  if (!permissionsQuery.isPending && !permissions["sandbox.settings.view"]) {
    return (
      <AccessDenied
        description="You do not have permission to view this sandbox's settings."
        backHref={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`}
        backLabel="Back to sandbox"
      />
    );
  }

  const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  const identityDirty =
    name.trim() !== saved.name ||
    slug !== saved.slug ||
    description.trim() !== saved.description;
  const buildDirty =
    branch !== saved.branch ||
    rootDirectory !== saved.rootDirectory ||
    buildCommand !== saved.buildCommand ||
    outputDirectory !== saved.outputDirectory;

  const patch = async (label: string, payload: Parameters<typeof updateSandbox>[2]) => {
    if (!canManage || busy) return;
    setBusy(label);
    setActionError(null);
    setNotice(null);
    try {
      const result = await updateSandbox(
        sandbox.organizationId,
        sandbox.id,
        payload,
      );
      applySandboxUpdate(queryClient, workspaceSlug, sandbox, result.sandbox);
      setSaved({
        name: result.sandbox.name,
        slug: result.sandbox.slug,
        description: result.sandbox.description ?? "",
        branch: result.sandbox.defaultBranch ?? "",
        rootDirectory: result.sandbox.rootDirectory,
        buildCommand: result.sandbox.buildCommand ?? "",
        outputDirectory: result.sandbox.outputDirectory ?? "",
      });
      setNotice(`${label} saved.`);
      if (result.sandbox.slug !== sandbox.slug) {
        router.replace(
          `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(result.sandbox.slug)}/settings`,
        );
      }
    } catch (cause) {
      setActionError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const runtimeAction = async (
    label: string,
    action: () => Promise<{ sandbox: Sandbox }>,
  ) => {
    if (!canRuntime || busy) return;
    setBusy(label);
    setActionError(null);
    setNotice(null);
    try {
      const result = await action();
      applySandboxUpdate(queryClient, workspaceSlug, sandbox, result.sandbox);
      setNotice(`${label} completed.`);
    } catch (cause) {
      setActionError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!canDelete || deleteConfirm !== sandbox.name || busy) return;
    setBusy("delete");
    setActionError(null);
    setNotice(null);
    try {
      await deleteSandbox(sandbox.organizationId, sandbox.id);
      queryClient.removeQueries({
        queryKey: queryKeys.sandbox(workspaceSlug, sandbox.slug),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceSandboxes(workspaceSlug),
      });
      router.push(`/app/workspace/${encodeURIComponent(workspaceSlug)}`);
    } catch (cause) {
      setActionError(errorMessage(cause));
      setBusy(null);
    }
  };

  const archiveAction = async () => {
    if (!canRuntime || busy) return;
    await runtimeAction(sandbox.archivedAt ? "Restore" : "Archive", () =>
      sandbox.archivedAt
        ? restoreSandbox(sandbox.organizationId, sandbox.id)
        : archiveSandbox(sandbox.organizationId, sandbox.id),
    );
  };

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`}
              className="jetic-muted inline-flex items-center gap-1.5 text-[11.5px] transition-colors hover:text-white"
            >
              <ArrowLeft size={12} />
              Back to sandbox
            </Link>
            <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">
              Sandbox settings
            </h1>
            <p className="jetic-muted mt-1 text-[13px]">
              Manage {sandbox.name}&apos;s identity, repository, runtime, and lifecycle.
            </p>
          </div>
          <span className="jetic-pill jetic-pill-hobby capitalize">
            {sandbox.status}
          </span>
        </header>

        {(actionError || notice) && (
          <p
            role={actionError ? "alert" : "status"}
            className={`text-[12.5px] ${actionError ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
          >
            {actionError ?? notice}
          </p>
        )}

        {!canManage && (
          <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] leading-5 text-[var(--jetic-muted)]">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>
              You can view these settings but need the{" "}
              <code className="font-mono">sandbox.settings.manage</code> permission
              to change them.
            </span>
          </div>
        )}

        <Card
          title="Sandbox identity"
          description="The name and URL used to identify this sandbox."
          footer={
            <>
              <span>
                {canManage
                  ? "Changes apply immediately."
                  : "Only members with sandbox settings management can edit this."}
              </span>
              <Button
                disabled={!canManage || !identityDirty || !validSlug || busy !== null}
                onClick={() =>
                  void patch("Sandbox identity", {
                    name: name.trim(),
                    slug,
                    description: description.trim() || null,
                  })
                }
              >
                {busy === "Sandbox identity" ? "Saving…" : "Save identity"}
              </Button>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Name"
              value={name}
              onChange={setName}
              disabled={!canManage || busy !== null}
              maxLength={100}
            />
            <LabeledInput
              label="Slug"
              value={slug}
              onChange={(value) => setSlug(value.toLowerCase().replace(/\s+/g, "-"))}
              disabled={!canManage || busy !== null}
              maxLength={50}
            />
          </div>
          <label className="mt-3 flex flex-col gap-1.5">
            <span className="jetic-muted text-[11px]">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={!canManage || busy !== null}
              maxLength={1000}
              rows={3}
              className="w-full max-w-[760px] rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          {!validSlug && (
            <p className="mt-2 text-[11.5px] text-red-400">
              Use lowercase letters, numbers, and single hyphens.
            </p>
          )}
        </Card>

        <Card
          title="Repository & build"
          description="The imported repository and how Jetic builds the sandbox."
          footer={
            <>
              <span>
                {sandbox.repository?.fullName ?? "No repository connected"}
              </span>
              <Button
                disabled={!canManage || !buildDirty || busy !== null}
                onClick={() =>
                  void patch("Repository & build", {
                    branch: branch.trim() || undefined,
                    rootDirectory: rootDirectory.trim() || ".",
                    buildCommand: buildCommand.trim() || null,
                    outputDirectory: outputDirectory.trim() || null,
                  })
                }
              >
                {busy === "Repository & build" ? "Saving…" : "Save build settings"}
              </Button>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <LabeledInput
              label="Branch"
              value={branch}
              onChange={setBranch}
              disabled={!canManage || busy !== null}
              placeholder="main"
            />
            <LabeledInput
              label="Root directory"
              value={rootDirectory}
              onChange={setRootDirectory}
              disabled={!canManage || busy !== null}
              placeholder="."
            />
            <LabeledInput
              label="Build command"
              value={buildCommand}
              onChange={setBuildCommand}
              disabled={!canManage || busy !== null}
              placeholder="Auto"
            />
            <LabeledInput
              label="Output directory"
              value={outputDirectory}
              onChange={setOutputDirectory}
              disabled={!canManage || busy !== null}
              placeholder="Auto"
            />
          </div>
          <div className="mt-4 grid gap-2 text-[12px] sm:grid-cols-3">
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Language</p>
              <p className="mt-0.5 text-white">{sandbox.language ?? "Not detected"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Framework</p>
              <p className="mt-0.5 text-white">{sandbox.framework ?? "Not detected"}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Visibility</p>
              <p className="mt-0.5 text-white">
                {sandbox.repository?.isPrivate ? "Private" : "Public"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          title="Runtime"
          description="Start, stop, archive, or restore the sandbox runtime."
          footer={
            <>
              <span>
                {sandbox.lastStartedAt
                  ? `Last started ${formatRelative(sandbox.lastStartedAt)}`
                  : "Not started yet"}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  disabled={!canRuntime || busy !== null}
                  onClick={() =>
                    void runtimeAction("Start", () =>
                      startSandbox(sandbox.organizationId, sandbox.id),
                    )
                  }
                  icon={<Play size={12} />}
                >
                  Start
                </Button>
                <Button
                  disabled={!canRuntime || busy !== null}
                  onClick={() =>
                    void runtimeAction("Stop", () =>
                      stopSandbox(sandbox.organizationId, sandbox.id),
                    )
                  }
                  icon={<Square size={12} />}
                >
                  Stop
                </Button>
              </div>
            </>
          }
        >
          <div className="grid gap-2 text-[12px] sm:grid-cols-4">
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Provider</p>
              <p className="mt-0.5 capitalize text-white">{sandbox.runtimeProvider}</p>
            </div>
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Runtime status</p>
              <p className="mt-0.5 capitalize text-white">
                {sandbox.runtimeStatus ?? "Unknown"}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Preview</p>
              <p className="mt-0.5 truncate text-white">
                {sandbox.previewUrl ? (
                  <a
                    href={sandbox.previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--jetic-link)] hover:underline"
                  >
                    {sandbox.previewUrl.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  "Not available"
                )}
              </p>
            </div>
            <div className="rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2">
              <p className="jetic-muted text-[10.5px]">Last error</p>
              <p className="mt-0.5 truncate text-white">
                {sandbox.lastError ?? "None"}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              disabled={!canRuntime || busy !== null}
              onClick={() => void archiveAction()}
              icon={<Archive size={12} />}
            >
              {sandbox.archivedAt ? "Restore sandbox" : "Archive sandbox"}
            </Button>
            {sandbox.archivedAt && (
              <span className="jetic-muted text-[11.5px]">
                Archived {formatRelative(sandbox.archivedAt)}
              </span>
            )}
          </div>
        </Card>

        <Card
          title="Delete sandbox"
          description="Permanently remove this sandbox and all of its data from Jetic. This action is not reversible."
          danger
          footer={
            <>
              <span>
                {canDelete
                  ? "You will be redirected to the workspace."
                  : "Only members with sandbox deletion permission can delete this sandbox."}
              </span>
              <Button
                danger
                disabled={!canDelete || busy !== null}
                onClick={() => {
                  setDeleteConfirm("");
                  setDeleteOpen(true);
                }}
                icon={<Trash2 size={12} />}
              >
                Delete sandbox
              </Button>
            </>
          }
        />
      </div>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && busy !== "delete") {
              setDeleteOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-sandbox-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#111111] text-white shadow-2xl"
          >
            <div className="border-b border-white/10 p-5">
              <h2 id="delete-sandbox-title" className="text-lg font-semibold">
                Delete {sandbox.name}?
              </h2>
              <p className="jetic-muted mt-2 text-[13px] leading-5">
                This permanently deletes the sandbox, its environments, API model,
                and activity. Type <strong className="text-white">{sandbox.name}</strong> to confirm.
              </p>
            </div>
            <div className="p-5">
              <label htmlFor="delete-sandbox-confirm" className="jetic-muted mb-1.5 block text-[11px]">
                Sandbox name
              </label>
              <input
                id="delete-sandbox-confirm"
                type="text"
                value={deleteConfirm}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                autoFocus
                className={inputClass}
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                disabled={busy === "delete"}
                className="inline-flex h-8 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={deleteConfirm !== sandbox.name || busy === "delete"}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-red-500/90 px-3 text-[12px] font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={12} />
                {busy === "delete" ? "Deleting…" : "Delete sandbox"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
