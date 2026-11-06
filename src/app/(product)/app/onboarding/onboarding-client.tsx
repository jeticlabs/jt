"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { JeticIcon } from "@/components/jetic-icon";
import { completeOnboarding } from "@/features/onboarding/onboarding.api";
import { slugify, isValidSlug } from "@/features/workspace/slug";
import { useSlugAvailability } from "@/features/workspace/use-slug-availability";
import type { Plan } from "@/features/workspace/types";
import { errorMessage } from "@/lib/api/browser";

interface PlanOption {
  id: Plan;
  label: string;
  badge: string;
}

const PLANS: PlanOption[] = [
  { id: "pro", label: "I'm working on commercial projects", badge: "Pro" },
  { id: "hobby", label: "I'm working on personal projects", badge: "Hobby" },
];

const CheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <circle cx="9" cy="9" r="9" fill="#ffffff" />
    <path
      d="M5.2 9.2l2.5 2.5 5-5.2"
      fill="none"
      stroke="#111111"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RadioRing = () => (
  <span
    className="block h-[18px] w-[18px] rounded-full border border-[#4a4a4a]"
    aria-hidden="true"
  />
);

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`transition-transform ${open ? "" : "-rotate-90"}`}
    aria-hidden="true"
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

function SlugStatus({
  slug,
  status,
}: {
  slug: string;
  status: "idle" | "invalid" | "checking" | "available" | "taken" | "error";
}) {
  if (slug.length === 0) {
    return <span className="jetic-muted shrink-0 text-[12px]">Choose a name</span>;
  }

  if (status === "checking") {
    return (
      <span className="jetic-muted flex shrink-0 items-center gap-1.5 text-[12px]">
        <span
          className="h-3 w-3 animate-spin rounded-full border border-white/25 border-t-white"
          aria-hidden="true"
        />
        Checking…
      </span>
    );
  }

  if (status === "available") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-[var(--jetic-emphasis)]">
        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
        Available
      </span>
    );
  }

  if (status === "taken") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-hidden="true" />
        Already taken
      </span>
    );
  }

  if (status === "error") {
    return <span className="shrink-0 text-[12px] text-red-400">Couldn&apos;t check</span>;
  }

  return <span className="jetic-muted shrink-0 text-[12px]">Too short</span>;
}

export function OnboardingClient() {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan>("pro");
  const [teamName, setTeamName] = useState("");
  const [open, setOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const slug = slugify(teamName.trim());
  const availability = useSlugAvailability(slug);
  const slugStatus = availability.slug === slug ? availability.status : slug.length > 0 ? "checking" : "idle";

  const canContinue =
    teamName.trim().length > 0 &&
    isValidSlug(slug) &&
    slugStatus !== "taken" &&
    slugStatus !== "checking" &&
    !submitting;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await completeOnboarding({
        plan,
        name: teamName.trim(),
        slug,
      });
      router.push(`/app/workspace/${encodeURIComponent(result.organization.slug)}`);
    } catch (error) {
      setSubmitError(errorMessage(error));
      setSubmitting(false);
    }
  };

  return (
    <main className="jetic-surface flex h-full w-full flex-col items-center px-4">
      <div className="flex h-full w-full max-w-[400px] flex-col items-center justify-center overflow-y-auto">
        <JeticIcon />

        <h1 className="mt-12 text-center text-[28px] font-semibold leading-[1.15] tracking-tight">
          Choose a plan
          <span className="jetic-muted block">Set up your first Jetic team</span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 flex w-full flex-col">
          <div role="radiogroup" aria-label="Plan" className="jetic-card">
            {PLANS.map((option, index) => {
              const selected = plan === option.id;
              const isPro = option.id === "pro";
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPlan(option.id)}
                  className={`flex min-h-[45px] w-full items-center gap-2.5 px-3 py-2 text-left text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30 ${
                    index > 0 ? "border-t border-white/10" : ""
                  } ${selected ? "text-white" : "jetic-muted hover:text-white"}`}
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    {selected ? <CheckCircle /> : <RadioRing />}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  <span className={`jetic-pill ${isPro ? "jetic-pill-pro" : "jetic-pill-hobby"}`}>
                    {option.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <label htmlFor="team-name" className="jetic-muted mt-5 block text-[14px]">
            Workspace name
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(event) => {
              setTeamName(event.target.value);
              setSubmitError(null);
            }}
            placeholder="ACME"
            autoComplete="organization"
            className="jetic-input mt-2"
            aria-describedby="workspace-slug"
          />

          <div
            id="workspace-slug"
            className="mt-2 flex min-h-[42px] items-center justify-between gap-3 rounded-xl border border-white/10 bg-[var(--jetic-well)] px-3 py-2.5"
          >
            <span className="min-w-0 truncate font-mono text-[13px] text-[var(--jetic-muted)]">
              jetic.space/
              <span className={slug.length > 0 ? "text-white" : "text-[var(--jetic-faint)]"}>
                {slug.length > 0 ? slug : "your-workspace"}
              </span>
            </span>
            <SlugStatus slug={slug} status={slugStatus} />
          </div>

          {slugStatus === "taken" && (
            <p className="mt-2 text-[12.5px] leading-5 text-red-400">
              That workspace URL is already in use. Try a different name.
            </p>
          )}

          <div className="mt-5 text-[13px]">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="flex w-full items-center gap-2 text-left font-medium text-[#ededed]"
            >
              <span className="text-[#8a8a8a]">
                <Chevron open={open} />
              </span>
              {plan === "pro"
                ? "Continuing will start a 14-day Pro plan trial."
                : "Continuing will create a free Hobby team."}
            </button>

            {open && (
              <div className="pl-6">
                <p className="jetic-muted mt-3 text-[14px] leading-[22px]">
                  {plan === "pro"
                    ? "Once the trial ends, you can continue on the Pro plan or switch to Hobby."
                    : "The Hobby plan is free and intended for personal, non-commercial projects."}
                </p>
                <Link
                  href="/pricing"
                  className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white hover:underline"
                >
                  Learn more
                </Link>
              </div>
            )}
          </div>

          {submitError && (
            <p role="alert" className="mt-4 text-[13px] text-red-400">
              {submitError}
            </p>
          )}

          <button type="submit" disabled={!canContinue} className="jetic-btn mt-5">
            {submitting ? "Creating workspace…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
