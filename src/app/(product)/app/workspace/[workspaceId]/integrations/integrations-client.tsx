"use client";

import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { useGithubAppConnection } from "@/cache";
import { queryKeys } from "@/cache/query-keys";
import { useGithubStore } from "@/context";
import {
  disconnectGithubAppInstallation,
  startGithubAppInstallation,
  syncGithubAppInstallations,
} from "@/features/github/github.api";
import type { GitHubAppConnection } from "@/features/github/types";
import { errorMessage } from "@/lib/api/browser";

const secondaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-[var(--jetic-emphasis)] transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40";

const primaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-md bg-white px-3 text-[12px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-40";

function GithubMark() {
  return <GitHubIcon size={18} />;
}

function LetterMark({ children }: { children: ReactNode }) {
  return <span className="text-[13px] font-semibold text-white">{children}</span>;
}

interface StaticIntegration {
  name: string;
  description: string;
  icon: ReactNode;
}

const OTHER_INTEGRATIONS: StaticIntegration[] = [
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

export function IntegrationsClient({
  workspaceId,
  workspaceSlug,
  initialConnection,
  canManage,
  githubStatus,
}: {
  workspaceId: string;
  workspaceSlug: string;
  initialConnection: GitHubAppConnection;
  canManage: boolean;
  githubStatus?: string | undefined;
}) {
  const queryClient = useQueryClient();
  const query = useGithubAppConnection(workspaceId, initialConnection);
  const connection = query.data ?? initialConnection;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(
    githubStatus === "connected"
      ? "GitHub App connected."
      : githubStatus === "error"
        ? "GitHub App connection could not be completed. Try again."
        : null,
  );

  const activeInstallation =
    connection.installations.find((installation) => !installation.suspended) ??
    null;
  const connected = Boolean(activeInstallation);
  const suspended = connection.connected && !connected;
  const configured = connection.appConfigured;

  const refresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.githubAppConnection(workspaceId),
    });
  };

  const connect = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await startGithubAppInstallation(workspaceId);
      window.location.assign(result.url);
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(false);
    }
  };

  const disconnect = async () => {
    if (!activeInstallation || !canManage) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await disconnectGithubAppInstallation(
        workspaceId,
        activeInstallation.installationId,
      );
      useGithubStore.getState().reset();
      setNotice("GitHub App disconnected. Existing sandboxes are unchanged.");
      await refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const sync = async () => {
    if (!canManage) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await syncGithubAppInstallations(workspaceId);
      await refresh();
      if (result.connected > 0) {
        useGithubStore.getState().reset();
        setNotice(
          `Connected ${result.connected} existing GitHub App installation${result.connected === 1 ? "" : "s"}.`,
        );
      } else {
        setError(
          "No matching GitHub App installation was found for your GitHub account. Install the App first, or make sure the installation was created from this workspace.",
        );
      }
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <header>
          <h1 className="text-[24px] font-semibold tracking-tight text-white">
            Integrations
          </h1>
          <p className="jetic-muted mt-1 text-[13px]">
            Connect the tools your team already uses to your Jetic workspace.
          </p>
        </header>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-4 text-[12.5px] ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
          >
            {error ?? notice}
          </p>
        )}

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <article className="jetic-card flex flex-col gap-4 rounded-lg bg-[var(--jetic-bg)] p-4 md:col-span-2 xl:col-span-1">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--jetic-recess)]">
                <GithubMark />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[13.5px] font-semibold text-white">
                    GitHub
                  </h2>
                  <span
                    className={`inline-flex h-5 items-center gap-1.5 rounded-full border px-2 text-[9.5px] font-medium uppercase tracking-[0.06em] ${
                      connected
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : suspended
                          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                          : "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        connected
                          ? "bg-emerald-300"
                          : suspended
                            ? "bg-amber-300"
                            : "bg-[var(--jetic-faint)]"
                      }`}
                    />
                    {connected
                      ? "Connected"
                      : suspended
                        ? "Suspended"
                        : "Not connected"}
                  </span>
                </div>
                <p className="jetic-muted mt-0.5 text-[12px] leading-relaxed">
                  Install the Jetic GitHub App to import private and public
                  repositories into sandboxes. Installation tokens refresh
                  automatically.
                </p>
              </div>
            </div>

            {connected && activeInstallation ? (
              <div className="flex flex-col gap-2 rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 py-2.5 text-[11.5px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="jetic-muted">Account</span>
                  <span className="flex min-w-0 items-center gap-1.5 text-white">
                    <ShieldCheck size={12} className="text-emerald-300" />
                    <span className="truncate">
                      {activeInstallation.accountLogin}
                    </span>
                    <span className="jetic-muted capitalize">
                      ({activeInstallation.accountType.toLowerCase()})
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="jetic-muted">Repository access</span>
                  <span className="text-white capitalize">
                    {activeInstallation.repositorySelection ?? "All repositories"}
                  </span>
                </div>
              </div>
            ) : suspended ? (
              <p className="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[11.5px] leading-5 text-amber-200">
                The GitHub App installation is suspended or was revoked. Reinstall
                it to restore repository access.
              </p>
            ) : (
              <p className="jetic-muted text-[11.5px] leading-5">
                Jetic never stores a personal access token. Repository access is
                granted through a GitHub App installation.
              </p>
            )}

            {!configured && (
              <p className="rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-[11.5px] leading-5 text-amber-200">
                The GitHub App is not configured on this API deployment. Add{" "}
                <code className="font-mono">GITHUB_APP_ID</code>,{" "}
                <code className="font-mono">GITHUB_APP_PRIVATE_KEY</code>, and{" "}
                <code className="font-mono">GITHUB_APP_SLUG</code> to the API
                environment, then restart it.
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
              <span className="jetic-muted text-[11.5px]">
                {connected
                  ? `Installation ${activeInstallation?.installationId}`
                  : suspended
                    ? "Reconnect to resume repository imports."
                    : "No GitHub App installation for this workspace."}
              </span>
              <div className="flex shrink-0 items-center gap-2">
                {connected && activeInstallation && (
                  <a
                    href={`https://github.com/settings/installations/${encodeURIComponent(activeInstallation.installationId)}`}
                    target="_blank"
                    rel="noreferrer"
                    className={secondaryButton}
                  >
                    Manage
                    <ExternalLink size={12} className="ml-1" />
                  </a>
                )}
                {canManage && !connected && (
                  <button
                    type="button"
                    onClick={() => void sync()}
                    disabled={busy || !configured}
                    className={secondaryButton}
                  >
                    {busy ? "Working…" : "Sync existing installation"}
                  </button>
                )}
                {canManage && (
                  <button
                    type="button"
                    onClick={() =>
                      connected ? void disconnect() : void connect()
                    }
                    disabled={busy || (!connected && !configured)}
                    className={connected ? secondaryButton : primaryButton}
                  >
                    {busy
                      ? "Working…"
                      : connected
                        ? "Disconnect"
                        : suspended
                          ? "Reconnect GitHub App"
                          : "Install GitHub App"}
                  </button>
                )}
              </div>
            </div>
          </article>

          {OTHER_INTEGRATIONS.map((integration) => (
            <article
              key={integration.name}
              className="jetic-card flex flex-col gap-4 rounded-lg bg-[var(--jetic-bg)] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--jetic-recess)]">
                  {integration.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[13.5px] font-semibold text-white">
                    {integration.name}
                  </h2>
                  <p className="jetic-muted mt-0.5 text-[12px] leading-relaxed">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                <span className="jetic-muted flex items-center gap-1.5 text-[12px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--jetic-faint)]" />
                  Not connected
                </span>
                <button type="button" className={secondaryButton} disabled>
                  Coming soon
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="jetic-muted mt-4 text-[11.5px]">
          GitHub repository access for workspace{" "}
          <span className="font-mono text-[var(--jetic-emphasis)]">
            {workspaceSlug}
          </span>
          .
        </p>
      </div>
    </div>
  );
}
