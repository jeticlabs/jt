import type { ReactNode } from "react";

const GithubMark = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

const LetterMark = ({ children }: { children: ReactNode }) => (
  <span className="text-[13px] font-semibold text-white">{children}</span>
);

interface Integration {
  name: string;
  description: string;
  icon: ReactNode;
  connected?: boolean;
}

const INTEGRATIONS: Integration[] = [
  {
    name: "GitHub",
    description: "Sync repositories, branches, and pull requests.",
    icon: <GithubMark />,
    connected: true,
  },
  {
    name: "Slack",
    description: "Send run results and alerts to a channel.",
    icon: <LetterMark>S</LetterMark>,
  },
  {
    name: "Linear",
    description: "Create issues from failed simulations.",
    icon: <LetterMark>L</LetterMark>,
  },
  {
    name: "PagerDuty",
    description: "Page on-call when a monitor fails.",
    icon: <LetterMark>P</LetterMark>,
  },
  {
    name: "Datadog",
    description: "Stream metrics and traces to your dashboard.",
    icon: <LetterMark>D</LetterMark>,
  },
  {
    name: "Webhooks",
    description: "Deliver signed events to your own endpoint.",
    icon: <LetterMark>{"{ }"}</LetterMark>,
  },
];

const secondaryButton =
  "inline-flex h-8 items-center justify-center rounded-lg border border-white/10 px-3 text-[12px] font-medium text-[var(--jetic-emphasis)] transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

function IntegrationCard({ integration }: { integration: Integration }) {
  return (
    <article className="jetic-card flex flex-col gap-4 bg-[var(--jetic-recess)] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--jetic-well)]">
          {integration.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[13.5px] font-semibold text-white">{integration.name}</h2>
          <p className="jetic-muted mt-0.5 text-[12px] leading-relaxed">
            {integration.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
        <span
          className={`flex items-center gap-1.5 text-[12px] ${
            integration.connected ? "text-[var(--jetic-emphasis)]" : "jetic-muted"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              integration.connected ? "bg-white" : "bg-[var(--jetic-faint)]"
            }`}
          />
          {integration.connected ? "Connected" : "Not connected"}
        </span>
        <button type="button" className={secondaryButton}>
          {integration.connected ? "Manage" : "Connect"}
        </button>
      </div>
    </article>
  );
}

export default function IntegrationsPage() {
  return (
    <div className="jetic-surface min-h-full w-full px-6 pb-16 pt-6 lg:px-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-[20px] font-semibold tracking-tight text-white">Integrations</h1>
        <p className="jetic-muted text-[13px]">
          Connect the tools your team already uses to your Jetic workspace.
        </p>
      </header>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {INTEGRATIONS.map((integration) => (
          <IntegrationCard key={integration.name} integration={integration} />
        ))}
      </div>
    </div>
  );
}
