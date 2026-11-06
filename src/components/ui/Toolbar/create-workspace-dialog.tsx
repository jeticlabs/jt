"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { completeOnboarding } from "@/features/onboarding/onboarding.api";
import { isValidSlug, slugify } from "@/features/workspace/slug";
import type { Plan } from "@/features/workspace/types";
import { useSlugAvailability } from "@/features/workspace/use-slug-availability";
import { errorMessage } from "@/lib/api/browser";

const PLANS: { id: Plan; label: string; hint: string }[] = [
  { id: "hobby", label: "Hobby", hint: "Personal projects" },
  { id: "pro", label: "Pro", hint: "Commercial projects" },
];

function Availability({
  slug,
  status,
}: {
  slug: string;
  status: "idle" | "invalid" | "checking" | "available" | "taken" | "error";
}) {
  if (slug.length === 0) {
    return <span className="jetic-muted text-[12px]">Choose a name</span>;
  }
  if (status === "checking") {
    return (
      <span className="jetic-muted flex items-center gap-1.5 text-[12px]">
        <span className="h-3 w-3 animate-spin rounded-full border border-white/25 border-t-white" />
        Checking…
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-[var(--jetic-emphasis)]">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Available
      </span>
    );
  }
  if (status === "taken") {
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        Already taken
      </span>
    );
  }
  if (status === "error") {
    return <span className="text-[12px] text-red-400">Couldn&apos;t check</span>;
  }
  return <span className="jetic-muted text-[12px]">Too short</span>;
}

/**
 * Creates an additional workspace through the onboarding endpoint. The same
 * API records the plan, creates the owner membership, and makes the new
 * workspace active for the current session.
 */
export function CreateWorkspaceDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [plan, setPlan] = useState<Plan>("hobby");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = slugify(name.trim());
  const availability = useSlugAvailability(slug);
  const status =
    availability.slug === slug ? availability.status : slug.length > 0 ? "checking" : "idle";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const canSubmit =
    name.trim().length > 0 &&
    isValidSlug(slug) &&
    status !== "checking" &&
    status !== "taken" &&
    !submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    try {
      const result = await completeOnboarding({ plan, name: name.trim(), slug });
      onClose();
      router.push(`/app/workspace/${encodeURIComponent(result.organization.slug)}`);
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workspace-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2 id="create-workspace-title" className="text-lg font-semibold">
              Create a workspace
            </h2>
            <p className="jetic-muted mt-1 text-[13px]">
              Workspaces keep projects, members, and billing separate.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={submitting}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          <div>
            <label htmlFor="new-workspace-name" className="jetic-muted mb-2 block text-[12px]">
              Workspace name
            </label>
            <input
              id="new-workspace-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              placeholder="ACME"
              autoComplete="organization"
              autoFocus
              className="jetic-input"
            />
          </div>

          <div className="flex min-h-[42px] items-center justify-between gap-3 rounded-xl border border-white/10 bg-[var(--jetic-well)] px-3 py-2.5">
            <span className="min-w-0 truncate font-mono text-[13px] text-[var(--jetic-muted)]">
              jetic.space/
              <span className={slug.length > 0 ? "text-white" : "text-[var(--jetic-faint)]"}>
                {slug.length > 0 ? slug : "your-workspace"}
              </span>
            </span>
            <Availability slug={slug} status={status} />
          </div>

          <fieldset>
            <legend className="jetic-muted mb-2 text-[12px]">Plan</legend>
            <div className="grid grid-cols-2 gap-2">
              {PLANS.map((option) => {
                const selected = plan === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setPlan(option.id)}
                    className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      selected
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-[var(--jetic-well)] hover:border-white/25"
                    }`}
                  >
                    <span className="text-[13px] font-semibold">{option.label}</span>
                    <span className="jetic-muted mt-0.5 text-[12px]">{option.hint}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error && (
            <p role="alert" className="text-[12.5px] leading-5 text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="jetic-btn h-9 px-3.5 text-[13px] disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="jetic-btn-light h-9 px-3.5 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Creating…" : "Create workspace"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
