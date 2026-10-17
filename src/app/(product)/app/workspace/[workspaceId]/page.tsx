"use client"
import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";

/* ---------- Types & data ---------- */

type Provider = "GitHub" | "GitLab" | "Bitbucket" | "Origin";

interface Chip {
  label: string;
  icon: ReactNode;
}

interface Template {
  id: string;
  title: string;
  description: string;
  tilt: "up" | "down";
  light?: boolean;
  glyph: ReactNode;
}

/* ---------- Icons ---------- */

const Svg = ({
  children,
  size = 14,
  strokeWidth = 1.8,
}: {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
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
    aria-hidden="true"
  >
    {children}
  </svg>
);

const UserPlus = () => (
  <Svg>
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <path d="M19 8v6M22 11h-6" />
  </Svg>
);
const Plus = () => (
  <Svg size={16}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
const Mail = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);
const ImageIcon = () => (
  <Svg>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="1.5" />
    <path d="m21 15-5-5L5 21" />
  </Svg>
);
const Nodes = () => (
  <Svg>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="8" r="2.5" />
    <circle cx="8" cy="18" r="2.5" />
    <path d="m8 7.5 8 .5M7.2 8.4 7.8 15.5M16.5 10l-6.8 6.5" />
  </Svg>
);
const Activity = () => (
  <Svg>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);
const Refresh = () => (
  <Svg>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </Svg>
);
const ChevronDown = () => (
  <Svg size={12} strokeWidth={2}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);
const External = () => (
  <Svg size={12} strokeWidth={2}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6M10 14 21 3" />
  </Svg>
);
const Lock = () => (
  <Svg size={22} strokeWidth={1.8}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </Svg>
);

/* Brand marks (simplified approximations) */
const GitHubMark = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);
const GitLabMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 22 2.5 14.6 5 4.5l3 6.5h8l3-6.5 2.5 10.1L12 22Z" opacity="0.9" />
  </svg>
);
const BitbucketMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M2.5 4h19l-2.6 15.8a1.2 1.2 0 0 1-1.2 1H6.3a1.2 1.2 0 0 1-1.2-1L2.5 4Zm6.7 10.3h5.6l.9-5.1H8.3l.9 5.1Z" />
  </svg>
);
const OriginMark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
    <path d="M3.5 7.2 12 12l8.5-4.8M12 12v10" fill="none" stroke="#0a0a0a" strokeWidth="1.6" />
  </svg>
);

/* Template preview glyphs */
const AgentGlyph = () => (
  <svg width="48" height="28" viewBox="0 0 48 28" fill="none" stroke="#111" strokeWidth="4" aria-hidden="true">
    <path d="M2 4h16M2 14h16M2 24h16M30 4h16M30 14h16M30 24h16M14 24 24 4" />
  </svg>
);
const SparklesGlyph = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
    <path d="M10 3l1.8 5.2L17 10l-5.2 1.8L10 17l-1.8-5.2L3 10l5.2-1.8L10 3Zm9 9 .9 2.6 2.6.9-2.6.9L19 19l-.9-2.6-2.6-.9 2.6-.9L19 12Z" />
  </svg>
);
const NextGlyph = () => (
  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[13px] font-bold text-black">
    N
  </span>
);
const PythonGlyph = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C8 2 8 3.7 8 5v2h4v1H6.2C4.3 8 3 9.8 3 12.2s1.2 4.2 3 4.2H8v-2.5C8 12 9.7 11 11.5 11h3c1.4 0 2.5-1.1 2.5-2.5V5c0-1.5-2-3-5-3Z" fill="#3776ab" />
    <path d="M12 22c4 0 4-1.7 4-3v-2h-4v-1h5.8c1.9 0 3.2-1.8 3.2-4.2s-1.2-4.2-3-4.2H16v2.5c0 1.9-1.7 2.9-3.5 2.9h-3C8.1 13 7 14.1 7 15.5V19c0 1.5 2 3 5 3Z" fill="#ffd43b" />
  </svg>
);

const CHIPS: Chip[] = [
  { label: "Contact Form", icon: <Mail /> },
  { label: "Image Editor", icon: <ImageIcon /> },
  { label: "Mini Game", icon: <Nodes /> },
  { label: "Finance Calculator", icon: <Activity /> },
];

const TEMPLATES: Template[] = [
  {
    id: "agent",
    title: "Build an agent",
    description: "Deploy an agent in a minute on Vercel.",
    tilt: "up",
    light: true,
    glyph: <AgentGlyph />,
  },
  {
    id: "ticket-router",
    title: "Ticket router with Jev",
    description: "Route ticket submissions by context using Jev and AI SDK.",
    tilt: "down",
    glyph: <SparklesGlyph />,
  },
  {
    id: "nextjs",
    title: "Next.js Boilerplate",
    description: "Get started with Next.js and React in seconds.",
    tilt: "down",
    glyph: <NextGlyph />,
  },
  {
    id: "flask",
    title: "Flask Python Boilerplate",
    description: "Deploy Python Flask applications with zero configuration.",
    tilt: "down",
    glyph: <PythonGlyph />,
  },
];

const PROVIDERS: { id: Provider; icon: ReactNode }[] = [
  { id: "GitHub", icon: <GitHubMark /> },
  { id: "GitLab", icon: <GitLabMark /> },
  { id: "Bitbucket", icon: <BitbucketMark /> },
  { id: "Origin", icon: <OriginMark /> },
];

/* ---------- Sub-components ---------- */

function TemplateCard({ t }: { t: Template }) {
  return (
    <a
      href="#"
      tabIndex={-1}
      onClick={(e) => e.preventDefault()}
      className="group relative block h-[230px] overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a] transition-colors hover:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <div className="p-4">
        <h3 className="text-[14px] font-semibold text-white">{t.title}</h3>
        <p className="jetic-muted mt-2 max-w-[240px] text-[13px] leading-[18px]">
          {t.description}
        </p>
      </div>

      {/* Tilted preview panel, cropped by the card */}
      <div
        className={`absolute left-[12%] top-[62%] h-[180px] w-[120%] origin-top-left rounded-xl border ${t.light ? "border-[#d4d4d4] bg-white" : "border-white/10 bg-[#0a0a0a]"
          } ${t.tilt === "up" ? "-rotate-[5deg]" : "rotate-[3deg]"} transition-transform duration-300 group-hover:-translate-y-1`}
      >
        <div
          className={`absolute left-[26%] top-[14%] flex h-[120px] w-[48%] items-start justify-center rounded-2xl border pt-5 ${t.light ? "border-[#e5e5e5] bg-[#f4f4f4]" : "border-white/10 bg-[#111111]"
            }`}
        >
          {t.glyph}
        </div>
      </div>
    </a>
  );
}

/* ---------- Page ---------- */

export default function DashboardPage() {
  const [prompt, setPrompt] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    // TODO: send prompt / Git URL to your backend
    console.log("Submit:", prompt);
  };

  const pickChip = (label: string) => {
    setPrompt(label);
    inputRef.current?.focus();
  };

  const resetPrompt = () => {
    setPrompt("");
    inputRef.current?.focus();
  };

  const connect = (provider: Provider) => {
    // TODO: start OAuth flow for the provider
    console.log("Connect:", provider);
  };

  return (
    <main className="jetic-surface h-full w-full px-6 pb-16 pt-5 lg:px-14">
      {/* Header */}





      <hr className="mt-8 border-white/10" />

      {/* Two columns */}
      <div className="grid lg:grid-cols-2">
        {/* Import Git Repository */}
        <section className="py-8 lg:pr-6">
          <h2 className="text-[18px] font-semibold tracking-tight">Import Git Repository</h2>

          <div className="mt-6 flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-white/10 bg-[#1a1a1a] px-6 py-8">
            <p className="jetic-muted max-w-[320px] text-center text-[12px]">
              Select a Git provider to import an existing project from a Git Repository.
            </p>

            <div className="mt-6 flex w-full max-w-[260px] flex-col gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => connect(p.id)}
                  className="jetic-btn flex items-center justify-center gap-2 text-[13px] font-semibold focus-visible:ring-white/40"
                >
                  {p.icon}
                  {p.id}
                </button>
              ))}
            </div>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-semibold text-white hover:underline"
            >
              Manage Login Connections
              <External />
            </a>
          </div>
        </section>

        {/* Build your solution (locked) */}
        <section className="group/locked relative py-8 lg:border-l lg:border-white/10 lg:pl-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold tracking-tight">Build your solution</h2>
            <div className="flex items-center gap-5 text-[12px] font-semibold">
              <button
                type="button"
                tabIndex={-1}
                className="flex items-center gap-1.5 text-[#ededed] hover:text-white"
              >
                Filter
                <ChevronDown />
              </button>
              <a
                href="#"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1.5 text-[#ededed] hover:text-white"
              >
                Browse All
                <External />
              </a>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <TemplateCard key={t.id} t={t} />
            ))}
          </div>

          {/* Locked overlay */}
          <div
            role="group"
            aria-label="Coming soon"
            className="absolute inset-0 z-10 flex cursor-not-allowed flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-[6px]"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#1a1a1a] text-white transition-transform duration-200 group-hover/locked:scale-110">
              <Lock />
            </span>
            <span className="translate-y-1 text-[13px] font-medium text-white opacity-0 transition-all duration-200 group-hover/locked:translate-y-0 group-hover/locked:opacity-100">
              Coming soon
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}