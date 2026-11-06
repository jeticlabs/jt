"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Cloud, GitBranch, Layers, PackageOpen, X } from "lucide-react";

import { slugify } from "@/features/workspace/slug";

type SourceId = "blank" | "sandbox" | "github" | "bucket" | "aws";

interface Source {
  id: SourceId;
  label: string;
  description: string;
  icon: ReactNode;
  requiresLocation: boolean;
  locationLabel?: string;
  locationPlaceholder?: string;
}

const SOURCES: Source[] = [
  {
    id: "blank",
    label: "Blank workspace",
    description: "Start with an empty sandbox and add files yourself.",
    icon: <PackageOpen size={26} strokeWidth={1.5} />,
    requiresLocation: false,
  },
  {
    id: "sandbox",
    label: "Sandbox",
    description: "Spin up an isolated runtime with Jetic's defaults.",
    icon: <Boxes size={26} strokeWidth={1.5} />,
    requiresLocation: false,
  },
  {
    id: "github",
    label: "Import from GitHub",
    description: "Clone a repository and open it in a fresh sandbox.",
    icon: <GitBranch size={26} strokeWidth={1.5} />,
    requiresLocation: true,
    locationLabel: "Repository URL",
    locationPlaceholder: "https://github.com/org/repo",
  },
  {
    id: "bucket",
    label: "Import from bucket",
    description: "Pull a snapshot from S3-compatible object storage.",
    icon: <Layers size={26} strokeWidth={1.5} />,
    requiresLocation: true,
    locationLabel: "Bucket URL",
    locationPlaceholder: "s3://bucket/path",
  },
  {
    id: "aws",
    label: "Import from AWS",
    description: "Connect an AWS resource using its ARN.",
    icon: <Cloud size={26} strokeWidth={1.5} />,
    requiresLocation: true,
    locationLabel: "AWS resource ARN",
    locationPlaceholder: "arn:aws:ec2:region:account:instance/id",
  },
];

/**
 * Large, source-first sandbox creation dialog. Selecting a source reveals the
 * minimum fields needed to open the workspace; the sandbox route owns the
 * actual runtime UI.
 */
export function CreateSandboxDialog({
  workspaceSlug,
  onClose,
}: {
  workspaceSlug: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [sourceId, setSourceId] = useState<SourceId>("blank");
  const [name, setName] = useState("untitled-sandbox");
  const [location, setLocation] = useState("");

  const source = useMemo(
    () => SOURCES.find((candidate) => candidate.id === sourceId) ?? SOURCES[0],
    [sourceId],
  );
  const slug = slugify(name.trim());
  const canSubmit =
    slug.length > 0 && (!source.requiresLocation || location.trim().length > 0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    onClose();
    router.push(
      `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(slug)}`,
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-sandbox-title"
        className="flex max-h-[min(760px,calc(100vh-2rem))] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
          <div>
            <h2 id="create-sandbox-title" className="text-xl font-semibold">
              Create a sandbox
            </h2>
            <p className="jetic-muted mt-1 text-[13.5px]">
              Start from nothing, or bring in a repository from your provider.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            <div
              role="radiogroup"
              aria-label="Sandbox source"
              className="grid gap-3 sm:grid-cols-2"
            >
              {SOURCES.map((option) => {
                const selected = option.id === sourceId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setSourceId(option.id);
                      setName((current) =>
                        current === "untitled-sandbox" || current.trim() === ""
                          ? slugify(option.label) || "untitled-sandbox"
                          : current,
                      );
                    }}
                    className={`flex min-h-[116px] items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                      selected
                        ? "border-white/40 bg-white/10"
                        : "border-white/10 bg-[var(--jetic-well)] hover:border-white/25 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${
                        selected
                          ? "border-white/25 bg-white/10 text-white"
                          : "border-white/10 bg-[var(--jetic-recess)] text-[var(--jetic-muted)]"
                      }`}
                    >
                      {option.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-semibold">{option.label}</span>
                      <span className="jetic-muted mt-1 block text-[12.5px] leading-5">
                        {option.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sandbox-name" className="jetic-muted mb-2 block text-[12px]">
                  Sandbox name
                </label>
                <input
                  id="sandbox-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="jetic-input"
                  placeholder="untitled-sandbox"
                />
                <p className="jetic-muted mt-1.5 truncate font-mono text-[11.5px]">
                  jetic.space/{workspaceSlug}/{slug || "…"}
                </p>
              </div>

              {source.requiresLocation && (
                <div>
                  <label htmlFor="sandbox-location" className="jetic-muted mb-2 block text-[12px]">
                    {source.locationLabel}
                  </label>
                  <input
                    id="sandbox-location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="jetic-input"
                    placeholder={source.locationPlaceholder}
                  />
                  <p className="jetic-muted mt-1.5 text-[11.5px]">
                    Credentials are requested on the next step.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-white/10 p-5">
            <button
              type="button"
              onClick={onClose}
              className="jetic-btn h-9 px-3.5 text-[13px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="jetic-btn-light h-9 px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create sandbox
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
