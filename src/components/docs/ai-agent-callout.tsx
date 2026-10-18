"use client";

import { useState } from "react";

const INSTRUCTIONS = `# Set up Jetic for this project

Jetic is a code-aware, agentic API behavior testing platform that understands an API from its source.
Follow these steps in order and do not skip any.

1. Install the CLI (package "jetic-cli", binary "jetic"):
   npm install -g jetic-cli

2. Scaffold the workspace inside this project (creates .jetic/):
   jetic init

3. Scan the source code to discover routes (Express + TypeScript):
   jetic scan

4. Verify the behavioral model and close every gap:
   - run the "jetic_verify_model" MCP tool
   - give every endpoint a description and at least one tag
   - give every parameter and every response status a description
   - fix every MISSING_FIELD_* warning before continuing

5. Connect the MCP server so you can author and test the model directly:
   npx jetic mcp

6. Author a workflow in .jetic/workflows/<slug>.json, then execute it:
   jetic simulate workflow <slug>

Ground rules: never invent endpoints or fields. Every endpoint must come from the
scanned source or from source code you have actually read.
Documentation: /docs
`;

const SparkleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden
  >
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5"
    aria-hidden
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export function AIAgentCallout() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTRUCTIONS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing to do */
    }
  };

  return (
    <div className="not-prose jetic-card my-6 bg-[var(--jetic-recess)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-[var(--jetic-muted)]">
            <SparkleIcon />
          </span>
          Using an AI agent?
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-medium text-[#0a0a0a] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {copied ? <CheckIcon /> : null}
          {copied ? "Instructions copied" : "Copy Instructions"}
        </button>
      </div>
      <p className="mt-3 text-[14px] leading-[22px] text-[var(--jetic-muted)]">
        Copy the setup instructions into your agent (Claude Code, Cursor, Codex,
        and others). It will follow the recommended way to install Jetic, scan
        your API, and build the behavioral model.
      </p>
    </div>
  );
}
