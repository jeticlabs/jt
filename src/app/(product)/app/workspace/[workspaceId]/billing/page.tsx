"use client";

import type { ReactNode } from "react";

/* ------------------------------- Icons ---------------------------------- */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons = {
  credit: (
    <Svg>
      <ellipse cx="9" cy="4.5" rx="4.5" ry="2" />
      <path d="M4.5 4.5v3c0 1.1 2 2 4.5 2s4.5-.9 4.5-2v-3" />
      <path d="M2 8.5c0 .9 1.2 1.6 2.8 1.9M2 8.5v3c0 1.1 2 2 4.5 2 1 0 1.9-.15 2.7-.4" />
    </Svg>
  ),
  cdn: (
    <Svg>
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c2 1.8 2.8 3.8 2.8 6S10 12.2 8 14c-2-1.8-2.8-3.8-2.8-6S6 3.8 8 2Z" />
    </Svg>
  ),
  team: (
    <Svg>
      <circle cx="6" cy="5.5" r="2.5" />
      <path d="M1.5 13c.4-2.3 2.2-3.5 4.5-3.5s4.1 1.2 4.5 3.5" />
      <path d="M10.5 3.3a2.4 2.4 0 0 1 0 4.4M12 9.8c1.3.4 2.2 1.4 2.5 3.2" />
    </Svg>
  ),
  domain: (
    <Svg>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 5.5h12" />
      <circle cx="10.5" cy="10" r="2.2" />
      <path d="M8.3 10h4.4" />
    </Svg>
  ),
  viewer: (
    <Svg>
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
      <path d="m3 13.5 10-11" />
    </Svg>
  ),
  network: (
    <Svg>
      <path d="m5 2 3 1.7v3.1L5 8.5 2 6.8V3.7L5 2Z" />
      <path d="m11 7 3 1.7v3.1L11 13.5 8 11.8V8.7L11 7Z" />
      <path d="m5 9.5 2 1.1v2L5 13.7 3 12.6v-2L5 9.5Z" />
    </Svg>
  ),
  observability: (
    <Svg>
      <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </Svg>
  ),
  waf: (
    <Svg>
      <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
      <path d="M2 6.5h12M6.5 6.5v7M10 2.5v4" />
    </Svg>
  ),
  elastic: (
    <Svg>
      <path d="M2.5 11.5a5.5 5.5 0 1 1 11 0" />
      <path d="m8 11 2.5-3.5" />
      <circle cx="8" cy="11" r=".6" />
    </Svg>
  ),
  concurrent: (
    <Svg>
      <rect x="2" y="2.5" width="12" height="4" rx="1" />
      <rect x="2" y="9.5" width="12" height="4" rx="1" />
      <path d="M4.5 4.5h.01M4.5 11.5h.01" />
    </Svg>
  ),
  addons: (
    <Svg>
      <path d="M2 6.5 3.2 2.5h9.6L14 6.5" />
      <path d="M2 6.5c0 1 .8 1.7 1.7 1.7S5.3 7.5 5.3 6.5c0 1 .8 1.7 1.8 1.7s1.8-.7 1.8-1.7c0 1 .8 1.7 1.8 1.7s1.7-.7 1.7-1.7" />
      <path d="M3 8.5v5h10v-5M6.5 13.5v-3h3v3" />
    </Svg>
  ),
  spend: (
    <Svg>
      <circle cx="8" cy="8" r="6" />
      <path d="M9.8 6.2c-.3-.7-1-1-1.8-1-1 0-1.8.5-1.8 1.3s.7 1.1 1.8 1.4c1.1.3 1.8.6 1.8 1.4S9 10.6 8 10.6c-.9 0-1.6-.4-1.9-1.1M8 4v1.2M8 10.6V12" />
    </Svg>
  ),
};

function CheckCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-label="Included">
      <circle cx="8" cy="8" r="8" fill="#ffffff" />
      <path
        d="m4.6 8.2 2.2 2.2 4.6-4.8"
        fill="none"
        stroke="#111111"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 2h5v5M14 2 7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5" />
    </svg>
  );
}

/* ------------------------------ Primitives ------------------------------ */

function OutlineButton({
  children,
  disabled,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex h-8 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
        disabled
          ? "cursor-not-allowed border-white/10 bg-white/[0.04] text-[var(--jetic-faint)]"
          : "border-white/10 bg-[var(--jetic-recess)] text-white hover:bg-[var(--jetic-well)]"
      }`}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 items-center justify-center rounded-lg bg-white px-3 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      {children}
    </button>
  );
}

/* ------------------------------- Data ----------------------------------- */

type Feature = { icon: ReactNode; label: string; note?: string };

const leftFeatures: Feature[] = [
  { icon: icons.credit, label: "Flexible usage credit", note: "$20 /month included" },
  { icon: icons.cdn, label: "Flat Rate CDN with traffic spike protection" },
  { icon: icons.team, label: "Team Collaboration" },
  { icon: icons.domain, label: "Free domain" },
  { icon: icons.viewer, label: "Free Viewer Seats" },
  { icon: icons.network, label: "Global network" },
];

const rightFeatures: Feature[] = [
  { icon: icons.observability, label: "Observability tools" },
  { icon: icons.waf, label: "Advanced WAF Protection" },
  { icon: icons.elastic, label: "Elastic Build Machines" },
  { icon: icons.concurrent, label: "On-demand concurrent builds" },
  { icon: icons.addons, label: "Enterprise-grade paid add-ons" },
  { icon: icons.spend, label: "Spend Management" },
];

function FeatureColumn({ items }: { items: Feature[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((f, i) => (
        <li
          key={f.label}
          className={`flex h-9 items-center justify-between gap-3 rounded-lg px-3 text-[13px] font-medium text-[var(--jetic-emphasis)] ${
            i % 2 === 0 ? "bg-white/[0.03]" : ""
          }`}
        >
          <span className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 text-[var(--jetic-muted)]">{f.icon}</span>
            <span className="truncate">{f.label}</span>
          </span>
          {f.note ? (
            <span className="shrink-0 text-xs font-medium text-white">
              {f.note}
            </span>
          ) : (
            <CheckCircle />
          )}
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------- Page ---------------------------------- */

export default function BillingPage() {
  return (
    <main className="jetic-surface min-h-full w-full px-4 py-6 text-white antialiased">
      <div className="mx-auto flex w-full max-w-[916px] flex-col gap-4">
        {/* Hobby Plan */}
        <section className="jetic-card bg-[var(--jetic-recess)]">
          <div className="p-5">
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold tracking-tight">
                  Hobby Plan
                </h1>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-[var(--jetic-emphasis)]">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <OutlineButton>Invoices</OutlineButton>
                <OutlineButton>Usage</OutlineButton>
              </div>
            </header>

            <div className="mt-6 flex flex-col items-center text-center">
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-black">
                Pro
              </span>
              <h2 className="mt-3 text-base font-semibold">Upgrade to Pro</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--jetic-muted)]">
                Unlock on-demand usage, collaboration, and faster builds.
                <br />
                Get started with $20 in credit.
              </p>
            </div>

            <div className="mt-6 grid gap-x-2 md:grid-cols-2">
              <FeatureColumn items={leftFeatures} />
              <FeatureColumn items={rightFeatures} />
            </div>

            <p className="mt-6 text-[13px] leading-5 text-[var(--jetic-muted)]">
              Upgrading to paid Pro enables Elastic for eligible projects by
              default. Machine size is selected automatically. Build CPU-minute
              usage can vary and may incur charges.{" "}
              <a
                href="#"
                className="text-[var(--jetic-emphasis)] underline underline-offset-2 hover:text-white"
              >
                Learn more about Elastic Build Machines
              </a>
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-3 text-sm text-[var(--jetic-muted)]">
            <span className="inline-flex items-center gap-1.5">
              Learn more about{" "}
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-white hover:underline hover:underline-offset-2"
              >
                Pricing and Plans
                <ExternalIcon />
              </a>
            </span>
            <PrimaryButton>Upgrade</PrimaryButton>
          </div>
        </section>

        {/* Spend Management */}
        <section className="jetic-card bg-[var(--jetic-recess)] p-5">
          <header className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Spend Management
              </h2>
              <p className="mt-3 max-w-[560px] text-[13px] leading-5 text-[var(--jetic-muted)]">
                Manage budgets for on-demand charges once the included credit is
                spent. Alerts fire at 50%, 75%, and 100%. Spend resets at the
                end of each billing period.{" "}
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-[var(--jetic-emphasis)] hover:text-white hover:underline hover:underline-offset-2"
                >
                  Learn more
                  <ExternalIcon />
                </a>
              </p>
            </div>
            <OutlineButton disabled>Add Budget</OutlineButton>
          </header>

          <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[560px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-white/10 text-[var(--jetic-faint)]">
                  <th className="w-[30%] px-4 py-3 font-normal">Name</th>
                  <th className="px-4 py-3 font-normal">Budget</th>
                  <th className="px-4 py-3 font-normal">Pause</th>
                  <th className="px-4 py-3 font-normal">Webhook</th>
                  <th className="w-[24%] px-4 py-3 font-normal">
                    Current spend
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-[var(--jetic-muted)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-b from-white/60 to-white/10 ring-1 ring-white/10" />
                      <div className="leading-4">
                        <div className="text-[var(--jetic-emphasis)]">
                          No team budget
                        </div>
                        <div className="text-xs text-[var(--jetic-faint)]">
                          Team
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">—</td>
                  <td className="px-4 py-3">
                    <div>—</div>
                    <div className="mt-1 h-[3px] w-full rounded-full bg-white/10" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}