"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Check, Cloud, GitBranch, Layers, PackageOpen, X } from "lucide-react";

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
    label: "Blank Sandbox",
    description: "Start with an empty sandbox and add files yourself.",
    icon: <PackageOpen size={20} strokeWidth={1.6} />,
    requiresLocation: false,
  },
  {
    id: "sandbox",
    label: "Sandbox",
    description: "Spin up an isolated runtime with Jetic's defaults.",
    icon: <Boxes size={20} strokeWidth={1.6} />,
    requiresLocation: false,
  },
  {
    id: "github",
    label: "Import from GitHub",
    description: "Clone a repository and open it in a fresh sandbox.",
    icon: <GitBranch size={20} strokeWidth={1.6} />,
    requiresLocation: true,
    locationLabel: "Repository URL",
    locationPlaceholder: "https://github.com/org/repo",
  },
  {
    id: "bucket",
    label: "Import from bucket",
    description: "Pull a snapshot from S3-compatible object storage.",
    icon: <Layers size={20} strokeWidth={1.6} />,
    requiresLocation: true,
    locationLabel: "Bucket URL",
    locationPlaceholder: "s3://bucket/path",
  }
];

const secondaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40";

const inputClass =
  "h-9 w-full rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

const previewTransform = {
  transform: "perspective(800px) rotateX(8deg) rotateZ(-1deg)",
};

function SourcePreview({
  sourceId,
  selected,
}: {
  sourceId: SourceId;
  selected: boolean;
}) {
  const panelClass =
    "absolute inset-x-4 -bottom-8 block h-[118px] overflow-hidden rounded-xl border p-3 shadow-[0_24px_50px_rgba(0,0,0,0.55)]";
  const toneClass = selected ? "border-white/20" : "border-white/10";

  if (sourceId === "blank") {
    return (
      <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
        <span
          className={`${panelClass} border-white/30 bg-white`}
          style={previewTransform}
        >
          <span className="flex items-center justify-between">
            <span className="h-1.5 w-14 rounded-full bg-black/20" />
            <span className="flex gap-1">
              <span className="h-1 w-1 rounded-full bg-black/15" />
              <span className="h-1 w-1 rounded-full bg-black/15" />
              <span className="h-1 w-1 rounded-full bg-black/15" />
            </span>
          </span>
          <span className="mt-3 grid grid-cols-[1fr_58px] gap-2">
            <span className="flex flex-col gap-1.5">
              <span className="h-1.5 w-24 rounded-full bg-black/15" />
              <span className="h-1.5 w-16 rounded-full bg-black/10" />
              <span className="h-1.5 w-20 rounded-full bg-black/10" />
            </span>
            <span className="flex items-center justify-center rounded-md border border-dashed border-black/20 text-black/30">
              <PackageOpen size={16} strokeWidth={1.6} />
            </span>
          </span>
          <span className="mt-3 block h-1.5 w-28 rounded-full bg-black/[0.06]" />
        </span>
      </span>
    );
  }

  if (sourceId === "sandbox") {
    return (
      <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
        <span
          className={`${panelClass} ${toneClass} bg-[#070707]`}
          style={previewTransform}
        >
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300/70" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
          </span>
          <span className="mt-2.5 block font-mono text-[8.5px] leading-[1.7] text-white/40">
            <span className="block">
              <span className="text-white/80">$</span> jetic sandbox create
            </span>
            <span className="block text-emerald-300/70">✓ runtime ready</span>
            <span className="block text-white/25">isolated environment</span>
          </span>
          <Boxes size={24} className="absolute bottom-4 right-4 text-white/10" />
        </span>
      </span>
    );
  }

  if (sourceId === "github") {
    const files = ["README.md", "src", "package.json"];

    return (
      <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
        <span
          className={`${panelClass} ${toneClass} bg-[#0d1117]`}
          style={previewTransform}
        >
          <span className="flex items-center gap-1.5 text-[8.5px] text-white/50">
            <GitBranch size={10} />
            main
            <span className="ml-auto rounded-full border border-white/10 px-1.5 py-0.5 text-[7.5px]">
              Public
            </span>
          </span>
          <span className="mt-2.5 block space-y-1">
            {files.map((file) => (
              <span
                key={file}
                className="flex items-center gap-1.5 rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-1 text-[8px] text-white/45"
              >
                <span className="h-1 w-1 rounded-full bg-white/25" />
                {file}
              </span>
            ))}
          </span>
        </span>
      </span>
    );
  }

  if (sourceId === "bucket") {
    return (
      <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
        <span
          className={`${panelClass} ${toneClass} bg-[#080d12]`}
          style={previewTransform}
        >
          <span className="flex items-center gap-1.5 text-[8.5px] text-white/50">
            <Layers size={10} />
            object storage
          </span>
          <span className="mt-3 flex items-end justify-center gap-1.5">
            <span className="h-8 w-12 rounded-lg border border-white/10 bg-white/[0.04]" />
            <span className="h-11 w-16 rounded-lg border border-white/15 bg-white/[0.06]" />
            <span className="h-8 w-12 rounded-lg border border-white/10 bg-white/[0.04]" />
          </span>
          <span className="absolute inset-x-0 bottom-2 block text-center font-mono text-[7.5px] text-white/25">
            s3://bucket/path
          </span>
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="relative block h-[96px] overflow-hidden">
      <span
        className={`${panelClass} ${toneClass} bg-[#0d1117]`}
        style={previewTransform}
      >
        <span className="flex items-center gap-1.5 text-[8.5px] text-white/50">
          <Cloud size={10} />
          AWS resource
        </span>
        <span className="relative mt-1 flex h-14 items-center justify-center">
          <span className="absolute h-10 w-20 rounded-full border border-white/10" />
          <span className="absolute h-6 w-12 rounded-full border border-white/10" />
          <Cloud size={26} className="relative text-amber-300/80" />
        </span>
        <span className="absolute bottom-2 left-3 block font-mono text-[7.5px] text-white/25">
          arn:aws
        </span>
      </span>
    </span>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-sandbox-title"
        className="jetic-surface flex max-h-[min(880px,calc(100dvh_-_2rem))] w-full max-w-4xl flex-col overflow-hidden rounded border border-white/10 bg-[var(--jetic-bg)] text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5">
          <div>
            <h2
              id="create-sandbox-title"
              className="text-[20px] font-semibold tracking-tight"
            >
              Create a sandbox
            </h2>
            <p className="jetic-muted mt-1 text-[13px]">
              Start from nothing, or bring in a repository from your provider.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div
              role="radiogroup"
              aria-label="Sandbox source"
              className="grid gap-2 sm:grid-cols-2"
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
                    className={`relative flex flex-col overflow-hidden rounded-lg border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${selected
                      ? "border-white/40 bg-[var(--jetic-recess)] ring-1 ring-white/10"
                      : "border-white/10 bg-[var(--jetic-recess)] hover:border-white/25"
                      }`}
                  >
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute right-3 top-3 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white text-black shadow"
                      >
                        <Check size={11} strokeWidth={2.5} />
                      </span>
                    )}

                    <span className="block p-3.5 pr-9">
                      <span className="block text-[13.5px] font-semibold">
                        {option.label}
                      </span>
                      <span className="jetic-muted mt-1 block text-[11.5px] leading-5">
                        {option.description}
                      </span>
                    </span>

                    <SourcePreview sourceId={option.id} selected={selected} />
                  </button>
                );
              })}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="sandbox-name"
                  className="jetic-muted mb-1.5 block text-[11px]"
                >
                  Sandbox name
                </label>
                <input
                  id="sandbox-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputClass}
                  placeholder="untitled-sandbox"
                />
                <p className="jetic-muted mt-1.5 truncate font-mono text-[11px]">
                  jetic.space/{workspaceSlug}/{slug || "…"}
                </p>
              </div>

              {source.requiresLocation && (
                <div>
                  <label
                    htmlFor="sandbox-location"
                    className="jetic-muted mb-1.5 block text-[11px]"
                  >
                    {source.locationLabel}
                  </label>
                  <input
                    id="sandbox-location"
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className={inputClass}
                    placeholder={source.locationPlaceholder}
                  />
                  <p className="jetic-muted mt-1.5 text-[11px]">
                    Credentials are requested on the next step.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3">
            <p className="jetic-muted min-w-0 flex-1 text-[11.5px]">
              {source.requiresLocation
                ? "You can review the source before the sandbox starts."
                : "You can add files and configure the runtime after creation."}
            </p>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={onClose} className={secondaryButton}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="jetic-btn-light h-8 w-auto shrink-0 rounded-md px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Create sandbox
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
