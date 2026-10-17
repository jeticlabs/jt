"use client"
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Icons ---------- */

const Svg = ({
  children,
  size = 16,
  strokeWidth = 1.8,
  className,
}: {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ChevronDown = () => (
  <Svg size={12} strokeWidth={2}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
const ChevronRight = ({ open }: { open: boolean }) => (
  <Svg size={14} strokeWidth={2} className={`transition-transform ${open ? "rotate-90" : ""}`}>
    <path d="m9 6 6 6-6 6" />
  </Svg>
);
const Folder = () => (
  <Svg size={15}>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
  </Svg>
);
const Branch = () => (
  <Svg size={15}>
    <circle cx="6" cy="5" r="2" />
    <circle cx="6" cy="19" r="2" />
    <circle cx="18" cy="7" r="2" />
    <path d="M6 7v10M18 9c0 5-12 3-12 8" />
  </Svg>
);
const GitHubMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);
const ViteMark = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" aria-hidden="true">
    <defs>
      <linearGradient id="vite-a" x1="6" y1="4" x2="19" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41d1ff" />
        <stop offset="1" stopColor="#bd34fe" />
      </linearGradient>
      <linearGradient id="vite-b" x1="14" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffea83" />
        <stop offset=".08" stopColor="#ffdd35" />
        <stop offset="1" stopColor="#ffa800" />
      </linearGradient>
    </defs>
    <path d="M29.9 5.8 16.7 29.4a.7.7 0 0 1-1.2 0L2.1 5.8A.7.7 0 0 1 2.7 4.8l13.2 2.4a.7.7 0 0 0 .2 0l12.9-2.4a.7.7 0 0 1 .9 1Z" fill="url(#vite-a)" />
    <path d="M22.3 2 12.4 3.9a.4.4 0 0 0-.3.4l-.6 10.3a.4.4 0 0 0 .5.4l2.8-.6a.4.4 0 0 1 .5.5l-.8 4a.4.4 0 0 0 .5.5l1.7-.5a.4.4 0 0 1 .5.5l-1.3 6.2c-.1.4.4.6.7.3l.2-.3 8.1-16.3a.4.4 0 0 0-.4-.6l-2.9.6a.4.4 0 0 1-.5-.5l1.9-6.7a.4.4 0 0 0-.4-.5Z" fill="url(#vite-b)" />
  </svg>
);
const TeamAvatar = () => (
  <span
    aria-hidden="true"
    className="h-4 w-4 shrink-0 rounded-full bg-white"
  />
);

/* ---------- Data ---------- */

interface Option {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: string;
}

const TEAMS: Option[] = [
  { value: "pruto", label: "Pruto Technolgies' proje…", icon: <TeamAvatar />, badge: "Hobby" },
];

const PRESETS: Option[] = [
  { value: "vite", label: "Vite", icon: <ViteMark /> },
  {
    value: "nextjs",
    label: "Next.js",
    icon: (
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
        N
      </span>
    ),
  },
  {
    value: "other",
    label: "Other",
    icon: <span className="h-[18px] w-[18px] rounded-full border border-[#4a4a4a]" />,
  },
];

/* ---------- Sub-components ---------- */

function Select({
  options,
  value,
  onChange,
  label,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className="jetic-select"
      >
        {current.icon}
        <span className="min-w-0 flex-1 truncate">{current.label}</span>
        {current.badge && (
          <span className="jetic-pill jetic-pill-hobby text-[11px]">
            {current.badge}
          </span>
        )}
        <span className="jetic-muted shrink-0">
          <ChevronDown />
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="jetic-menu absolute left-0 right-0 top-[49px] z-20"
        >
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="jetic-menu-item"
              >
                {o.icon}
                <span className="flex-1 truncate">{o.label}</span>
                {o.badge && (
                  <span className="jetic-pill jetic-pill-hobby text-[11px]">
                    {o.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a]">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center gap-2.5 px-3.5 text-left text-[13px] font-semibold text-[#ededed] transition-colors hover:bg-[#1e1e1e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/30"
      >
        <ChevronRight open={open} />
        {title}
      </button>
      {open && <div className="border-t border-white/10 p-4">{children}</div>}
    </div>
  );
}

const fieldLabel = "jetic-muted mb-2 block text-[12px]";
const inputClass = "jetic-input";

/* ---------- Page ---------- */

export default function NewProjectPage() {
  const [team, setTeam] = useState<string>(TEAMS[0].value);
  const [name, setName] = useState<string>("simulsol-electron");
  const [rootDir, setRootDir] = useState<string>("./");
  const [preset, setPreset] = useState<string>("vite");
  const [buildCmd, setBuildCmd] = useState<string>("");
  const [outDir, setOutDir] = useState<string>("");
  const [envVars, setEnvVars] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);
  const [deploying, setDeploying] = useState<boolean>(false);

  const updateEnv = (i: number, field: "key" | "value", v: string) =>
    setEnvVars((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)));

  const handleDeploy = async () => {
    if (!name.trim() || deploying) return;
    setDeploying(true);
    // TODO: call your deploy endpoint
    console.log("Deploy:", { team, name, rootDir, preset, buildCmd, outDir, envVars });
    await new Promise((r) => setTimeout(r, 1200));
    setDeploying(false);
  };

  return (
    <main className="jetic-surface h-full w-full px-6 pb-16 pt-5 lg:px-14">
      {/* Header */}
      <h1 className="text-[18px] font-semibold tracking-tight">New Sandbox</h1>

      <hr className="mt-5 border-white/10" />

      {/* Two columns */}
      <div className="grid lg:grid-cols-2">
        {/* Project details */}
        <section className="py-8 lg:pr-6">
          <h2 className="text-[18px] font-semibold tracking-tight">Project Details</h2>

          {/* Import source */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3">
            <p className="jetic-muted text-[12px]">Importing from GitHub</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
                <GitHubMark />
                SIMULSOL/SIMULSOL-ELECTRON
              </span>
              <span className="jetic-muted flex items-center gap-1.5 font-mono text-[12px]">
                <Branch />
                main
              </span>
            </div>
          </div>

          <p className="jetic-muted mt-6 max-w-[360px] text-[12px]">
            Choose where you want to create the project and give it a name.
          </p>

          {/* Team + name */}
          <div className="mt-4 flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <span className={fieldLabel}>Jetic Team</span>
              <Select options={TEAMS} value={team} onChange={setTeam} label="Jetic Team" />
            </div>

            <span aria-hidden="true" className="pb-1.5 text-[22px] font-light text-[#4a4a4a]">
              /
            </span>

            <div className="min-w-0 flex-1">
              <label htmlFor="project-name" className={fieldLabel}>
                Sandbox Name
              </label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Root dir + preset */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="root-dir" className={fieldLabel}>
                Root Directory
              </label>
              <div className="relative">
                <span className="jetic-muted pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <Folder />
                </span>
                <input
                  id="root-dir"
                  type="text"
                  value={rootDir}
                  onChange={(e) => setRootDir(e.target.value)}
                  className={`${inputClass} pl-9 font-mono`}
                />
              </div>
            </div>

            <div>
              <span className={fieldLabel}>Language</span>
              <Select options={PRESETS} value={preset} onChange={setPreset} label="Language" />
            </div>
          </div>
        </section>

        {/* Configuration */}
        <section className="py-8 lg:border-l lg:border-white/10 lg:pl-6">
          <h2 className="text-[18px] font-semibold tracking-tight">Configuration</h2>

          <div className="mt-6 flex flex-col gap-2.5">
            <Accordion title="Build and Output Settings">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="build-cmd" className={fieldLabel}>
                    Build Command
                  </label>
                  <input
                    id="build-cmd"
                    type="text"
                    value={buildCmd}
                    onChange={(e) => setBuildCmd(e.target.value)}
                    placeholder="npm run build"
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div>
                  <label htmlFor="out-dir" className={fieldLabel}>
                    Output Directory
                  </label>
                  <input
                    id="out-dir"
                    type="text"
                    value={outDir}
                    onChange={(e) => setOutDir(e.target.value)}
                    placeholder="dist"
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            </Accordion>

            <Accordion title="Environment Variables">
              <div className="flex flex-col gap-2">
                {envVars.map((row, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      aria-label="Key"
                      value={row.key}
                      onChange={(e) => updateEnv(i, "key", e.target.value)}
                      placeholder="EXAMPLE_NAME"
                      className={`${inputClass} font-mono`}
                    />
                    <input
                      type="text"
                      aria-label="Value"
                      value={row.value}
                      onChange={(e) => updateEnv(i, "value", e.target.value)}
                      placeholder="I9JU23NF394R6HH"
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEnvVars((r) => [...r, { key: "", value: "" }])}
                  className="mt-1 self-start text-[12px] font-semibold text-white hover:underline"
                >
                  Add another
                </button>
              </div>
            </Accordion>
          </div>

          {/* Start */}
          <button
            type="button"
            onClick={handleDeploy}
            disabled={!name.trim() || deploying}
            className="jetic-btn mt-6 flex w-full items-center justify-center gap-2 text-[13px] font-semibold focus-visible:ring-white/40"
          >
            {deploying ? "Starting…" : "Start"}
          </button>
        </section>
      </div>
    </main>
  );
}