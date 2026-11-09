"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  GitBranch,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { GitHubIcon } from "@/components/icons/github-icon";
import { useUserStore } from "@/context";
import { needsGithubReconnectMessage } from "@/features/github/errors";

import { getSandboxSource, getSandboxSourceFile } from "@/features/sandbox/sandbox.api";
import type {
  SandboxSource,
  SandboxSourceFile,
} from "@/features/sandbox/types";
import { useSandboxContext } from "@/features/sandbox/use-sandbox-context";
import { errorMessage } from "@/lib/api/browser";
import { SourceEditor } from "./source-editor";
import { SourceFileTree } from "./source-file-tree";

type LoadStatus = "loading" | "ready" | "error";

function formatBytes(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function ancestorsOf(path: string): string[] {
  const segments = path.split("/");
  segments.pop();
  const result: string[] = [];
  let current = "";
  for (const segment of segments) {
    current = current ? `${current}/${segment}` : segment;
    result.push(current);
  }
  return result;
}

function connectGithub() {
  const next = window.location.pathname;
  window.location.assign(
    new URL(
      `/api/auth/github/connect?next=${encodeURIComponent(next)}`,
      window.location.origin,
    ).toString(),
  );
}

export default function SandboxSourcePage() {
  const { organizationId, sandbox, status, error, reload, workspaceSlug } =
    useSandboxContext();
  const loadUser = useUserStore((state) => state.load);
  const [source, setSource] = useState<SandboxSource | null>(null);
  const [sourceStatus, setSourceStatus] = useState<LoadStatus>("loading");
  const [sourceError, setSourceError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<Record<string, SandboxSourceFile>>({});
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRequest = useRef(0);

  const repository = sandbox?.repository;
  const branch = sandbox?.defaultBranch ?? repository?.defaultBranch ?? "main";

  useEffect(() => {
    void loadUser({ force: true });
  }, [loadUser]);

  useEffect(() => {
    if (!organizationId || !sandbox) return;
    let cancelled = false;

    void (async () => {
      setSourceStatus("loading");
      setSourceError(null);
      try {
        const result = await getSandboxSource(organizationId, sandbox.id);
        if (cancelled) return;
        setSource(result);
        setSourceStatus("ready");

        const rootFolders = new Set(
          result.entries
            .filter((entry) => entry.type === "tree" && !entry.path.includes("/"))
            .map((entry) => entry.path),
        );
        setExpanded(rootFolders);

        if (!selectedPath) {
          const readme = result.entries.find(
            (entry) => entry.type === "blob" && /^readme\.mdx?$/i.test(entry.path),
          );
          const firstFile = result.entries.find((entry) => entry.type === "blob");
          const initial = readme ?? firstFile;
          if (initial) {
            setSelectedPath(initial.path);
            setExpanded((current) => {
              const next = new Set(current);
              for (const ancestor of ancestorsOf(initial.path)) next.add(ancestor);
              return next;
            });
          }
        }
      } catch (cause) {
        if (cancelled) return;
        setSourceStatus("error");
        setSourceError(errorMessage(cause));
      }
    })();

    return () => {
      cancelled = true;
    };
    // selectedPath is intentionally read once per load; selecting a file must
    // not refetch the whole tree.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, sandbox, reloadKey]);

  const loadFile = useCallback(
    async (path: string, force = false) => {
      if (!organizationId || !sandbox) return;
      const request = fileRequest.current + 1;
      fileRequest.current = request;
      setFileError(null);

      if (!force && files[path]) {
        setFileLoading(false);
        return;
      }

      setFileLoading(true);
      try {
        const file = await getSandboxSourceFile(organizationId, sandbox.id, path);
        if (fileRequest.current !== request) return;
        setFiles((current) => ({ ...current, [path]: file }));
      } catch (cause) {
        if (fileRequest.current !== request) return;
        setFileError(errorMessage(cause));
      } finally {
        if (fileRequest.current === request) setFileLoading(false);
      }
    },
    [organizationId, sandbox, files],
  );

  useEffect(() => {
    if (!selectedPath) return;
    const timer = window.setTimeout(() => {
      void loadFile(selectedPath);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [selectedPath, loadFile]);

  const selectPath = (path: string) => {
    setSelectedPath(path);
    setExpanded((current) => {
      const next = new Set(current);
      for (const ancestor of ancestorsOf(path)) next.add(ancestor);
      return next;
    });
  };

  const selectedFile = selectedPath ? (files[selectedPath] ?? null) : null;
  const effectiveFileLoading = Boolean(selectedPath) && fileLoading;
  const fileCount = useMemo(
    () => (source ? source.entries.filter((entry) => entry.type === "blob").length : 0),
    [source],
  );

  const toggleFolder = (path: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const refresh = () => {
    setFiles({});
    setSelectedPath(null);
    setSource(null);
    setReloadKey((value) => value + 1);
  };

  const copyPath = async () => {
    if (!selectedPath) return;
    try {
      await navigator.clipboard.writeText(selectedPath);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_500);
    } catch {
      // Clipboard access is optional.
    }
  };

  if (status === "loading" || (status === "ready" && sourceStatus === "loading")) {
    return (
      <main className="jetic-surface flex h-full min-h-0 w-full flex-col bg-[var(--jetic-well)] p-4">
        <div className="jetic-card flex min-h-0 flex-1 overflow-hidden rounded-lg bg-[var(--jetic-bg)]">
          <div className="hidden w-[300px] shrink-0 flex-col gap-2 border-r border-white/10 p-3 md:flex">
            <span className="jetic-shimmer h-8 w-full rounded-md" />
            {Array.from({ length: 14 }).map((_, index) => (
              <span
                key={index}
                className="jetic-shimmer h-6 rounded-md"
                style={{ width: `${60 + ((index * 13) % 35)}%`, marginLeft: (index % 3) * 12 }}
              />
            ))}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="jetic-shimmer h-3 w-52 rounded-full" />
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                className="jetic-shimmer h-2.5 rounded-full"
                style={{ width: `${35 + ((index * 19) % 60)}%` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (status === "error" || !sandbox) {
    return (
      <main className="jetic-surface flex h-full min-h-0 items-center justify-center bg-[var(--jetic-well)] px-5">
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

  if (!repository) {
    return (
      <main className="jetic-surface flex h-full min-h-0 items-center justify-center bg-[var(--jetic-well)] px-5">
        <div className="jetic-card flex w-full max-w-md flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-10 text-center">
          <GitHubIcon size={22} />
          <h1 className="text-[15px] font-semibold">No repository connected</h1>
          <p className="jetic-muted text-[12.5px] leading-5">
            Connect a GitHub repository to this sandbox to browse its source.
          </p>
          <Link
            href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}/settings`}
            className="mt-1 inline-flex h-8 items-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
          >
            Open sandbox settings
          </Link>
        </div>
      </main>
    );
  }

  if (sourceStatus === "error" || !source) {
    const githubProblem = needsGithubReconnectMessage(sourceError);
    return (
      <main className="jetic-surface flex h-full min-h-0 items-center justify-center bg-[var(--jetic-well)] px-5">
        <div className="jetic-card flex w-full max-w-lg flex-col items-center gap-3 rounded-lg bg-[var(--jetic-bg)] px-6 py-10 text-center">
          <AlertCircle size={22} className="text-red-300" />
          <h1 className="text-[15px] font-semibold">Source could not be loaded</h1>
          <p className="jetic-muted text-[12.5px] leading-5">
            {sourceError ??
              "Jetic could not read this repository. Check that your GitHub connection still has access."}
          </p>
          <div className="mt-1 flex items-center gap-2">
            {githubProblem && (
              <button
                type="button"
                onClick={connectGithub}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[12px] font-medium text-black transition-colors hover:bg-white/90"
              >
                <GitHubIcon size={13} />
                Reconnect GitHub
              </button>
            )}
            <button
              type="button"
              onClick={() => setReloadKey((value) => value + 1)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              <RefreshCw size={13} />
              Retry
            </button>
            <Link
              href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`}
              className="inline-flex h-8 items-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04]"
            >
              Back to overview
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="jetic-surface flex h-full min-h-0 w-full flex-col overflow-hidden bg-[var(--jetic-well)] p-4 text-white antialiased">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandbox.slug)}`}
              aria-label="Back to sandbox overview"
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft size={15} />
            </Link>
            <h1 className="text-[18px] font-semibold tracking-tight">Source</h1>
            <span className="inline-flex h-5 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 text-[10px] font-medium text-[var(--jetic-muted)]">
              <Lock size={10} />
              Read only
            </span>
          </div>
          <p className="jetic-muted mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 pl-9 text-[12px]">
            <span className="flex items-center gap-1.5">
              <GitHubIcon size={12} />
              {repository.fullName}
            </span>
            <span className="text-[var(--jetic-faint)]">·</span>
            <span className="flex items-center gap-1.5 font-mono">
              <GitBranch size={11} />
              {branch}
            </span>
            <span className="text-[var(--jetic-faint)]">·</span>
            <span>{fileCount} files</span>
            {source.truncated && (
              <>
                <span className="text-[var(--jetic-faint)]">·</span>
                <span className="text-amber-300">Tree truncated by GitHub</span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </header>

      <div className="jetic-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-[var(--jetic-bg)] md:flex-row">
        <aside className="flex max-h-[42vh] w-full shrink-0 flex-col border-b border-white/10 md:max-h-none md:w-[300px] md:border-b-0 md:border-r">
          <div className="border-b border-white/10 p-2.5">
            <label className="flex h-8 items-center gap-2 rounded-md border border-white/10 bg-[var(--jetic-recess)] px-2.5 text-[var(--jetic-faint)] transition-colors focus-within:border-white/20">
              <Search size={13} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter files"
                aria-label="Filter files"
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-[var(--jetic-faint)]"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear filter"
                  onClick={() => setQuery("")}
                  className="rounded p-0.5 hover:text-white"
                >
                  <X size={11} />
                </button>
              )}
            </label>
          </div>
          <div className="min-h-0 flex-1 overflow-auto p-1.5 [scrollbar-color:#2a2a2a_transparent] [scrollbar-width:thin]">
            {source.entries.length === 0 ? (
              <p className="jetic-muted px-3 py-6 text-center text-[11.5px]">
                This repository has no files on {branch}.
              </p>
            ) : (
              <SourceFileTree
                entries={source.entries}
                selectedPath={selectedPath}
                onSelect={selectPath}
                expanded={expanded}
                onToggle={toggleFolder}
                query={query}
              />
            )}
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex h-9 shrink-0 items-center gap-2 border-b border-white/10 px-3">
            {selectedPath ? (
              <>
                <span className="min-w-0 flex-1 truncate font-mono text-[11.5px] text-[var(--jetic-emphasis)]">
                  {selectedPath}
                </span>
                {selectedFile && (
                  <span className="jetic-muted hidden shrink-0 text-[10.5px] sm:block">
                    {formatBytes(selectedFile.size)}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => void copyPath()}
                  aria-label="Copy file path"
                  title="Copy file path"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {copied ? <Check size={12} className="text-emerald-300" /> : <Copy size={12} />}
                </button>
              </>
            ) : (
              <span className="jetic-muted text-[11.5px]">No file selected</span>
            )}
            {fileLoading && (
              <Loader2 size={12} className="shrink-0 animate-spin text-[var(--jetic-muted)]" />
            )}
          </div>
          <div className="min-h-0 flex-1">
            <SourceEditor
              file={selectedFile}
              loading={effectiveFileLoading && !selectedFile}
              error={fileError}
              onRetry={() => {
                if (selectedPath) void loadFile(selectedPath, true);
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
