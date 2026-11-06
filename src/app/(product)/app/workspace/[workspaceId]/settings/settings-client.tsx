"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import type { Plan, WorkspaceSummary } from "@/features/workspace/types";
import { isValidSlug } from "@/features/workspace/slug";
import { useSlugAvailability } from "@/features/workspace/use-slug-availability";
import { apiFetch, errorMessage } from "@/lib/api/browser";

/* ------------------------------ Primitives ------------------------------ */

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
        <h2 className="text-[18px] font-semibold tracking-tight text-white">{title}</h2>
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
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center justify-center rounded-md px-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${disabled
        ? "cursor-not-allowed bg-white/[0.06] text-[var(--jetic-faint)]"
        : danger
          ? "bg-red-500/90 text-white hover:bg-red-500"
          : "bg-white text-black hover:bg-white/90"
        }`}
    >
      {children}
    </button>
  );
}

const inputClass =
  "h-9 w-full max-w-[320px] rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

/* -------------------------------- Page ---------------------------------- */

const PLANS: { id: Plan; label: string; description: string }[] = [
  { id: "hobby", label: "Hobby", description: "Free for personal, non-commercial projects." },
  { id: "pro", label: "Pro", description: "Commercial projects with the full feature set." },
];

export function SettingsClient({ workspace }: { workspace: WorkspaceSummary }) {
  const router = useRouter();
  const isOwner = workspace.role === "owner";
  const base = `/v1/organizations/${encodeURIComponent(workspace.id)}`;

  const [name, setName] = useState(workspace.name);
  const [slug, setSlug] = useState(workspace.slug);
  const [plan, setPlan] = useState<Plan>(workspace.plan);

  const [savedName, setSavedName] = useState(workspace.name);
  const [savedSlug, setSavedSlug] = useState(workspace.slug);
  const [savedPlan, setSavedPlan] = useState<Plan>(workspace.plan);

  const [busy, setBusy] = useState<"name" | "slug" | "plan" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const trimmedName = name.trim();
  const slugDirty = slug !== savedSlug;
  const availability = useSlugAvailability(slugDirty ? slug : "");
  const slugStatus = !slugDirty
    ? "idle"
    : availability.slug === slug
      ? availability.status
      : "checking";
  const canSaveSlug =
    isOwner &&
    slugDirty &&
    isValidSlug(slug) &&
    slugStatus === "available" &&
    busy === null;

  useEffect(() => {
    if (!deleteOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDeleteOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteOpen]);

  const saveName = async () => {
    if (!isOwner || trimmedName.length === 0 || trimmedName === savedName) return;
    setBusy("name");
    setError(null);
    setNotice(null);
    try {
      await apiFetch(base, { method: "PATCH", body: { name: trimmedName } });
      setSavedName(trimmedName);
      setName(trimmedName);
      setNotice("Workspace name updated.");
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const saveSlug = async () => {
    if (!canSaveSlug) return;
    setBusy("slug");
    setError(null);
    setNotice(null);
    try {
      await apiFetch(base, { method: "PATCH", body: { slug } });
      setSavedSlug(slug);
      setNotice("Workspace URL updated.");
      router.push(`/app/workspace/${encodeURIComponent(slug)}/settings`);
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const savePlan = async () => {
    if (!isOwner || plan === savedPlan) return;
    setBusy("plan");
    setError(null);
    setNotice(null);
    try {
      await apiFetch(base, { method: "PATCH", body: { plan } });
      setSavedPlan(plan);
      setNotice(`Workspace switched to the ${plan === "pro" ? "Pro" : "Hobby"} plan.`);
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const deleteWorkspace = async () => {
    if (!isOwner || deleteConfirm !== workspace.name) return;
    setBusy("delete");
    setError(null);
    setNotice(null);
    try {
      await apiFetch(base, { method: "DELETE" });
      router.push("/app");
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(null);
    }
  };

  const copyTeamId = async () => {
    try {
      await navigator.clipboard.writeText(workspace.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-white">
              Workspace settings
            </h1>
            <p className="jetic-muted mt-1 text-[13px]">
              Manage this workspace&apos;s identity, URL, and plan.
            </p>
          </div>
          <span className="jetic-pill jetic-pill-hobby">
            {workspace.role.charAt(0).toUpperCase() + workspace.role.slice(1)}
          </span>
        </header>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`text-[12.5px] ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
          >
            {error ?? notice}
          </p>
        )}

        <Card
          title="Workspace name"
          description="This is your workspace's visible name within Jetic. For example, the name of your company or department."
          footer={
            <>
              <span>Up to 100 characters.</span>
              <Button
                disabled={
                  !isOwner ||
                  busy !== null ||
                  trimmedName.length === 0 ||
                  trimmedName === savedName
                }
                onClick={() => void saveName()}
              >
                {busy === "name" ? "Saving…" : "Save"}
              </Button>
            </>
          }
        >
          <input
            value={name}
            maxLength={100}
            disabled={!isOwner}
            onChange={(event) => {
              setName(event.target.value);
              setError(null);
              setNotice(null);
            }}
            aria-label="Workspace name"
            className={inputClass}
          />
        </Card>

        <Card
          title="Workspace URL"
          description="This is your workspace's URL namespace on Jetic. Members use it to reach projects and settings."
          footer={
            <>
              <span>
                {!isOwner
                  ? "Only owners can change the workspace URL."
                  : slugStatus === "taken"
                    ? "That URL is already taken."
                    : slugStatus === "invalid"
                      ? "Use lowercase letters, numbers, and single hyphens."
                      : "Up to 50 characters."}
              </span>
              <Button disabled={!canSaveSlug} onClick={() => void saveSlug()}>
                {busy === "slug" ? "Saving…" : "Save"}
              </Button>
            </>
          }
        >
          <div className="flex h-9 w-full max-w-[320px] overflow-hidden rounded-md border border-white/10 bg-[var(--jetic-recess)] focus-within:border-white/30">
            <span className="flex items-center border-r border-white/10 bg-[var(--jetic-bg)] px-3 text-[12.5px] text-[var(--jetic-muted)]">
              jetic.space/
            </span>
            <input
              value={slug}
              maxLength={50}
              disabled={!isOwner}
              onChange={(event) => {
                setSlug(event.target.value.toLowerCase().replace(/\s+/g, "-"));
                setError(null);
                setNotice(null);
              }}
              aria-label="Workspace URL"
              className="min-w-0 flex-1 bg-transparent px-3 text-[12.5px] text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
          {slugDirty && (
            <p className="mt-2 flex items-center gap-1.5 text-[12px]">
              {slugStatus === "checking" && (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border border-white/25 border-t-white" />
                  <span className="jetic-muted">Checking availability…</span>
                </>
              )}
              {slugStatus === "available" && (
                <span className="text-[var(--jetic-emphasis)]">Available</span>
              )}
              {slugStatus === "taken" && <span className="text-red-400">Already taken</span>}
              {slugStatus === "invalid" && (
                <span className="text-red-400">
                  Use lowercase letters, numbers, and single hyphens.
                </span>
              )}
              {slugStatus === "error" && (
                <span className="text-red-400">Couldn&apos;t check availability.</span>
              )}
            </p>
          )}
        </Card>

        <Card
          title="Plan"
          description="Choose the plan that matches how this workspace is used."
          footer={
            <>
              <span>
                {isOwner
                  ? "Plan changes apply immediately."
                  : "Only owners can change the plan."}
              </span>
              <Button
                disabled={!isOwner || busy !== null || plan === savedPlan}
                onClick={() => void savePlan()}
              >
                {busy === "plan" ? "Saving…" : "Save plan"}
              </Button>
            </>
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {PLANS.map((option) => {
              const selected = plan === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!isOwner}
                  aria-pressed={selected}
                  onClick={() => {
                    setPlan(option.id);
                    setError(null);
                    setNotice(null);
                  }}
                  className={`rounded-lg border p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed ${selected
                    ? "border-white/40 bg-white/10"
                    : "border-white/10 bg-[var(--jetic-recess)] hover:border-white/25"
                    }`}
                >
                  <span className="flex items-center gap-2 text-[12.5px] font-semibold">
                    {option.label}
                    {savedPlan === option.id && (
                      <span className="jetic-muted text-[11px] font-normal">Current</span>
                    )}
                  </span>
                  <span className="jetic-muted mt-1 block text-[12.5px] leading-5">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          title="Workspace ID"
          description="This is your workspace's ID within Jetic."
          footer={<span>Used when interacting with the Jetic API.</span>}
        >
          <div className="inline-flex h-9 items-center gap-3 rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3">
            <code className="font-mono text-[12.5px] text-white">{workspace.id}</code>
            <button
              type="button"
              onClick={() => void copyTeamId()}
              aria-label="Copy workspace ID"
              className="text-[var(--jetic-muted)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {copied ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 8.5 3.5 3.5L13 4.5" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                  <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
                </svg>
              )}
            </button>
          </div>
        </Card>

        <Card
          title="Delete workspace"
          description="Permanently remove this workspace and all of its contents from Jetic. This action is not reversible."
          danger
          footer={
            <>
              <span>
                {isOwner
                  ? "You will be redirected to your next workspace."
                  : "Only owners can delete this workspace."}
              </span>
              <Button
                danger
                disabled={!isOwner || busy !== null}
                onClick={() => {
                  setDeleteConfirm("");
                  setDeleteOpen(true);
                }}
              >
                Delete workspace
              </Button>
            </>
          }
        />
      </div>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && busy !== "delete") setDeleteOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-workspace-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-red-500/25 bg-[#111111] text-white shadow-2xl"
          >
            <div className="border-b border-white/10 p-5 w-full">
              <h2 id="delete-workspace-title" className="text-lg font-semibold">
                Delete {workspace.name}?
              </h2>
              <p className="jetic-muted mt-2 text-[13px] leading-5">
                This permanently deletes the workspace, its memberships, and its invitations.
                Type <strong className="text-white">{workspace.name}</strong> to confirm.
              </p>
            </div>
            <div className="p-5">
              <label htmlFor="delete-confirm" className="jetic-muted mb-1.5 block text-[11px]">
                Workspace name
              </label>
              <input
                id="delete-confirm"
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
                onClick={() => void deleteWorkspace()}
                disabled={deleteConfirm !== workspace.name || busy === "delete"}
                className="inline-flex h-8 items-center rounded-md bg-red-500/90 px-3 text-[12px] font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {busy === "delete" ? "Deleting…" : "Delete workspace"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
