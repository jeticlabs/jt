"use client"
import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { JeticIcon } from "@/components/jetic-icon";


type Plan = "pro" | "hobby";

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

export default function OnboardingPage() {
  const [plan, setPlan] = useState<Plan>("pro");
  const [teamName, setTeamName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(true);

  const canContinue = teamName.trim().length > 0;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canContinue) return;
    // TODO: hook up team creation
    console.log({ plan, teamName });
  };

  return (
    <main className="jetic-surface flex flex-col h-full w-full items-center px-4">
      <div className="flex flex-col h-full  w-full max-w-[400px]  items-center justify-center overflow-y-auto">
        <JeticIcon />

        <h1 className="mt-12 text-center text-[28px] font-semibold leading-[1.15] tracking-tight">
          Choose a plan
          <span className="jetic-muted block">
            Set up your first Jetic team
          </span>
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 flex w-full flex-col">
          {/* Plan selector */}
          <div
            role="radiogroup"
            aria-label="Plan"
            className="jetic-card"
          >
            {PLANS.map((option, i) => {
              const selected = plan === option.id;
              const isPro = option.id === "pro";
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPlan(option.id)}
                  className={`flex min-h-[45px] w-full items-center gap-2.5 px-3 py-2 text-left text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30 ${i > 0 ? "border-t border-white/10" : ""
                    } ${selected ? "text-white" : "jetic-muted hover:text-white"}`}
                >
                  <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                    {selected ? <CheckCircle /> : <RadioRing />}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  <span
                    className={`jetic-pill ${isPro ? "jetic-pill-pro" : "jetic-pill-hobby"}`
                    }
                  >
                    {option.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Team name */}
          <label
            htmlFor="team-name"
            className="jetic-muted mt-5 block text-[14px]"
          >
            Workspace name
          </label>
          <input
            id="team-name"
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="ACME"
            autoComplete="organization"
            className="jetic-input mt-2"
          />

          {/* Trial info */}
          <div className="mt-5 text-[13px]">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
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

          {/* Continue */}
          <button
            type="submit"
            disabled={!canContinue}
            className="jetic-btn mt-5"
          >
            Continue
          </button>
        </form>
      </div>
    </main>
  );
}
