"use client";

import { useState, type ReactNode } from "react";

/* ------------------------------ Primitives ------------------------------ */

function Card({
  title,
  description,
  children,
  footer,
  aside,
  danger,
}: {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  aside?: ReactNode;
  danger?: boolean;
}) {
  return (
    <section
      className={`jetic-card bg-[var(--jetic-recess)] ${
        danger ? "border-red-500/25" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-6 p-5">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {title}
          </h2>
          {description && (
            <div className="mt-3 text-sm leading-6 text-[var(--jetic-muted)]">
              {description}
            </div>
          )}
          {children && <div className="mt-5">{children}</div>}
        </div>
        {aside}
      </div>
      {footer && (
        <div className="flex min-h-[3.5rem] items-center justify-between gap-4 border-t border-white/10 px-5 py-3 text-sm text-[var(--jetic-muted)]">
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
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
        disabled
          ? "cursor-not-allowed bg-white/[0.06] text-[var(--jetic-faint)]"
          : "bg-white text-black hover:bg-white/90"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-[var(--jetic-emphasis)]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-8 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
          checked ? "bg-white" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full shadow transition-transform ${
            checked ? "translate-x-3 bg-[var(--jetic-bg)]" : "translate-x-0 bg-[var(--jetic-muted)]"
          }`}
        />
      </button>
      <span onClick={() => onChange(!checked)}>{label}</span>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm text-[var(--jetic-muted)]">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-[var(--jetic-well)] px-3 pr-9 text-sm text-white outline-none transition-colors hover:border-white/20 focus:border-white/40"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[var(--jetic-muted)]"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </div>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="inline-block"
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 2h5v5M14 2 7.5 8.5M12 9.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3.5" />
    </svg>
  );
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-[var(--jetic-emphasis)] underline underline-offset-2 hover:text-white"
    >
      {children}
      <ExternalIcon />
    </a>
  );
}

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-[var(--jetic-emphasis)] underline underline-offset-2 hover:text-white"
    >
      {children}
    </a>
  );
}

function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-[var(--jetic-well)] px-4 py-3 text-sm leading-6 text-[var(--jetic-muted)]">
      <svg
        className="mt-1 shrink-0 text-[var(--jetic-muted)]"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.25V11M8 4.75v.01" />
      </svg>
      <div>{children}</div>
    </div>
  );
}

/* ------------------------------- Avatar --------------------------------- */

function TeamAvatar() {
  return (
    <button
      type="button"
      aria-label="Upload team avatar"
      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        background:
          "linear-gradient(180deg, #ededed 0%, #b9b9b9 35%, #6f6f6f 70%, #2c2c2c 100%)",
      }}
    >
      {/* pixel / dither texture */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 0.8px, transparent 1.2px)",
          backgroundSize: "4px 4px",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.25) 100%)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      <span
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.7) 0.8px, transparent 1.2px)",
          backgroundSize: "4px 4px",
          backgroundPosition: "2px 2px",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,1) 100%)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,1) 100%)",
        }}
      />
    </button>
  );
}

/* -------------------------------- Page ---------------------------------- */

const INITIAL_NAME = "Pruto Technolgies' projects";
const INITIAL_SLUG = "pruto-technolgies-projects";
const TEAM_ID = "team_kK1TX5aPVgxETpWzkzBFTcYH";
const TOOLBAR_OPTIONS = ["Default (on)", "On", "Off"];

export default function TeamSettingsPage() {
  const [teamName, setTeamName] = useState(INITIAL_NAME);
  const [savedName, setSavedName] = useState(INITIAL_NAME);

  const [teamSlug, setTeamSlug] = useState(INITIAL_SLUG);
  const [savedSlug, setSavedSlug] = useState(INITIAL_SLUG);

  const [copied, setCopied] = useState(false);

  const [preProd, setPreProd] = useState("Default (on)");
  const [prod, setProd] = useState("Default (on)");
  const [allowOverride, setAllowOverride] = useState(true);
  const [toolbarSaved, setToolbarSaved] = useState({
    preProd: "Default (on)",
    prod: "Default (on)",
    allowOverride: true,
  });
  const toolbarDirty =
    preProd !== toolbarSaved.preProd ||
    prod !== toolbarSaved.prod ||
    allowOverride !== toolbarSaved.allowOverride;

  const [improveModels, setImproveModels] = useState(true);
  const [savedImproveModels, setSavedImproveModels] = useState(true);

  const copyTeamId = async () => {
    try {
      await navigator.clipboard.writeText(TEAM_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <main className="jetic-surface min-h-full w-full px-4 py-6 text-white antialiased">
      <div className="mx-auto flex w-full max-w-[916px] flex-col gap-[30px]">
        {/* Team Name */}
        <Card
          title="Team Name"
          description="This is your team's visible name within Jetic. For example, the name of your company or department."
          footer={
            <>
              <span>Please use 32 characters at maximum.</span>
              <Button
                disabled={teamName === savedName || teamName.trim() === ""}
                onClick={() => setSavedName(teamName)}
              >
                Save
              </Button>
            </>
          }
        >
          <input
            value={teamName}
            maxLength={32}
            onChange={(e) => setTeamName(e.target.value)}
            aria-label="Team name"
            className="h-10 w-full max-w-[302px] rounded-xl border border-white/10 bg-[var(--jetic-well)] px-3 text-sm text-white outline-none transition-colors placeholder:text-[var(--jetic-faint)] hover:border-white/20 focus:border-white/40"
          />
        </Card>

        {/* Team URL */}
        <Card
          title="Team URL"
          description="This is your team's URL namespace on Jetic. Within it, your team can inspect their projects, check out any recent activity, or configure settings to their liking."
          footer={
            <>
              <span>Please use 48 characters at maximum.</span>
              <Button
                disabled={teamSlug === savedSlug || teamSlug.trim() === ""}
                onClick={() => setSavedSlug(teamSlug)}
              >
                Save
              </Button>
            </>
          }
        >
          <div className="flex h-10 w-full max-w-[302px] overflow-hidden rounded-xl border border-white/10 bg-[var(--jetic-well)] focus-within:border-white/40">
            <span className="flex items-center border-r border-white/10 bg-[var(--jetic-bg)] px-3 text-sm text-[var(--jetic-muted)]">
              jetic.space/
            </span>
            <input
              value={teamSlug}
              maxLength={48}
              onChange={(e) =>
                setTeamSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              aria-label="Team URL"
              className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none"
            />
          </div>
        </Card>

        {/* Team Avatar */}
        <Card
          title="Team Avatar"
          description={
            <>
              <p>This is your team&apos;s avatar.</p>
              <p>Upload a custom avatar from your files.</p>
            </>
          }
          aside={<TeamAvatar />}
          footer={<span>An avatar is optional but strongly recommended.</span>}
        />

        {/* Preview Deployment Suffix */}
        <Card
          title="Preview Deployment Suffix"
          description={
            <>
              By default, the URL of every new Preview Deployment ends with{" "}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[13px] text-[var(--jetic-emphasis)]">
                .jetic.app
              </code>
              . This setting allows you to choose your own custom domain in
              place of this suffix.
            </>
          }
          footer={
            <>
              <span>
                This feature is available on the{" "}
                <ExtLink href="https://jetic.space/pricing">Pro plan</ExtLink>{" "}
                for <strong className="font-semibold text-white">$100 per month</strong>.
              </span>
              <Button>Upgrade</Button>
            </>
          }
        >
          <div className="flex h-10 w-full overflow-hidden rounded-xl border border-white/10 bg-[var(--jetic-well)]">
            <span className="flex items-center border-r border-white/10 bg-[var(--jetic-bg)] px-3 text-sm text-[var(--jetic-muted)]">
              my-deployment.
            </span>
            <input
              disabled
              placeholder="jetic.app"
              className="min-w-0 flex-1 cursor-not-allowed bg-transparent px-3 text-sm text-[var(--jetic-faint)] outline-none placeholder:text-[var(--jetic-faint)]"
            />
          </div>
        </Card>

        {/* Team ID */}
        <Card
          title="Team ID"
          description="This is your team's ID within Jetic."
          footer={<span>Used when interacting with the Jetic API.</span>}
        >
          <div className="inline-flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-[var(--jetic-well)] px-3">
            <code className="font-mono text-sm text-white">{TEAM_ID}</code>
            <button
              type="button"
              onClick={copyTeamId}
              aria-label="Copy team ID"
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

        {/* Jetic Toolbar */}
        <Card
          title="Jetic Toolbar"
          description="Enable the Jetic Toolbar on your deployments."
          footer={
            <>
              <span>
                Learn more about the{" "}
                <ExtLink href="https://jetic.space/docs/toolbar">
                  Jetic Toolbar
                </ExtLink>
              </span>
              <Button
                disabled={!toolbarDirty}
                onClick={() =>
                  setToolbarSaved({ preProd, prod, allowOverride })
                }
              >
                Save
              </Button>
            </>
          }
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select
              label="Pre-Production Deployments"
              value={preProd}
              onChange={setPreProd}
              options={TOOLBAR_OPTIONS}
            />
            <Select
              label="Production Deployments"
              value={prod}
              onChange={setProd}
              options={TOOLBAR_OPTIONS}
            />
          </div>

          <div className="mt-4">
            <InfoBox>
              To use the toolbar in production your team members need the{" "}
              <InlineLink href="https://chrome.google.com/webstore">
                Chrome extension
              </InlineLink>{" "}
              or to enable the toolbar for that domain in the toolbar menu.
              Learn more about using the{" "}
              <InlineLink href="https://jetic.space/docs/toolbar">
                toolbar in production
              </InlineLink>
              .
            </InfoBox>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="mb-3 text-xs text-[var(--jetic-muted)]">
              Allow this setting to be overridden on the{" "}
              <InlineLink href="#">project</InlineLink> level.
            </p>
            <Toggle
              checked={allowOverride}
              onChange={setAllowOverride}
              label={allowOverride ? "Enabled" : "Disabled"}
            />
          </div>
        </Card>

        {/* Data Preferences */}
        <Card
          title="Data Preferences"
          description="Jetic may train on and share code and chat data with AI model providers for training purposes only. If you turn this off, we will not share data going forward for projects owned by this team."
          footer={
            <>
              <span>
                Learn more about Jetic&apos;s{" "}
                <ExtLink href="https://jetic.space/legal/privacy-policy">
                  data sharing practices
                </ExtLink>
                .
              </span>
              <Button
                disabled={improveModels === savedImproveModels}
                onClick={() => setSavedImproveModels(improveModels)}
              >
                Save
              </Button>
            </>
          }
        >
          <Toggle
            checked={improveModels}
            onChange={setImproveModels}
            label="Improve models with my data"
          />
        </Card>

        {/* Transfer */}
        <Card
          title="Transfer"
          description="Transfer your projects to another team without downtime or workflow interruptions."
          footer={
            <>
              <span>
                Learn more about{" "}
                <ExtLink href="https://jetic.space/docs/projects/transferring-projects">
                  Transferring Projects
                </ExtLink>
              </span>
              <Button>Transfer</Button>
            </>
          }
        />

        {/* Leave Team */}
        <Card
          title="Leave Team"
          description="Revoke your access to this Team. Any resources you've added to the Team will remain."
          footer={
            <span>
              To leave this Team, ensure at least one more Member has the Owner
              role.
            </span>
          }
        />

        {/* Delete Team */}
        <Card
          title="Delete Team"
          description="Permanently remove your team and all of its contents from the Jetic platform. This action is not reversible — please continue with caution."
          footer={
            <>
              <span>
                To delete your account, visit{" "}
                <InlineLink href="#">Account Settings</InlineLink>.
              </span>
              <Button disabled>Delete Team</Button>
            </>
          }
        >
          <InfoBox>You cannot delete your last Hobby team.</InfoBox>
        </Card>
      </div>
    </main>
  );
}