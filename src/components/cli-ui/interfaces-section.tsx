"use client";

import { useState } from "react";

/* The cursor layer finds this section by id="interfaces", reads its first
   .grid for the cards, and clicks the last <button> of card index 2. */

const CARDS = [
  {
    id: "terminal", name: "Terminal", tagline: "Everything from the CLI",
    cmd: "npm install -g jetic-cli", btn: "Copy install command",
    panel: ["$ jetic scan", "$ jetic inspect", "$ jetic simulate endpoint --all", "$ jetic doctor"],
    features: ["Static scan of Express + TypeScript", "Single-endpoint or full-model simulation", "Deterministic agents: model-watcher, workflow-impact", "Memory get, set and clear from the shell"],
  },
  {
    id: "studio", name: "Jetic Studio", tagline: "A local web IDE",
    cmd: "jetic dev", btn: "Copy jetic dev",
    panel: ["Model", "Inspect", "Simulations", "Memory", "Traces", "Changes"],
    features: ["Served at localhost:8787", "Every run as an interactive step graph", "Edit the behavioral model by hand", "Custom port with --port"],
  },
  {
    id: "mcp", name: "AI IDE (MCP)", tagline: "Your editor's model drives Jetic",
    cmd: "jetic mcp", btn: "Copy jetic mcp",
    panel: ["Claude Code", "Cursor", "opencode", "Antigravity", "Windsurf", "VS Code"],
    features: ["Typed tools to inspect, author and validate", "Live-test endpoints and workflows", "No Jetic AI key: the editor's model is used", "Works for stacks the scanner can't parse yet"],
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setDone(true); window.setTimeout(() => setDone(false), 1500); } catch { /* blocked */ }
      }}
      className={`flex w-full items-center justify-center rounded-[7px] px-4 py-[9px] text-[13px] font-medium transition-colors ${done ? "bg-white text-black" : "bg-white/[0.13] text-white hover:bg-white/[0.2]"}`}
    >
      {done ? "Copied" : label}
    </button>
  );
}

export default function InterfacesSection() {
  return (
    <section id="interfaces" className="w-full bg-black px-5 py-14 font-['Inter',system-ui,sans-serif] text-white antialiased">
      <style>{`@keyframes jt-sel{0%,16%{background:rgba(255,255,255,.12);color:#fff}20%,100%{background:transparent;color:rgba(255,255,255,.6)}}`}</style>
      <div className="mx-auto">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[48px]">
            Stay in the terminal,
            <br />
            or let your editor drive
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-white/[0.12] bg-white/[0.12] md:grid-cols-3">
          {CARDS.map((c) => (
            <div key={c.id} className="flex flex-col bg-black p-6">
              <div className="text-[15px] font-semibold leading-tight">{c.name}</div>
              <div className="mt-[3px] text-[14px] leading-tight text-white/55">{c.tagline}</div>
              <hr className="my-5 border-0 border-t border-white/10" />

              <div className="rounded-[7px] border border-white/[0.14] bg-white/[0.03] p-2 font-['JetBrains_Mono',ui-monospace,monospace] text-[11.5px] text-white/60">
                {c.panel.map((r, i) => (
                  <div
                    key={r}
                    className="rounded-[4px] px-2 py-[3px]"
                    style={{ animation: `jt-sel ${c.panel.length * 1.2}s steps(1) infinite`, animationDelay: `${i * 1.2}s` }}
                  >
                    {r}
                  </div>
                ))}
              </div>

              <hr className="my-5 border-0 border-t border-white/10" />
              <ul className="space-y-[11px]">
                {c.features.map((f) => (
                  <li key={f} className="flex items-start gap-[10px] text-[13px] leading-[18px] text-white/75">
                    <svg className="mt-[3px] shrink-0 text-white/40" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 6.4 5 8.8l4.5-5" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7"><CopyButton text={c.cmd} label={c.btn} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
