"use client";

import type { AgentMode } from "../types/agent.types";

export function AgentModeSelector({
  value,
  onChange,
}: {
  value: AgentMode;
  onChange: (v: AgentMode) => void;
}) {
  return (
    <div className="flex flex-col gap-1 text-sm">
      <span className="font-medium">Mode</span>
      <div className="flex gap-2">
        {(["fast", "planning"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={
              value === m
                ? "rounded-full bg-zinc-900 px-3 py-1.5 text-xs text-white dark:bg-white dark:text-black"
                : "rounded-full border border-black/[.08] px-3 py-1.5 text-xs dark:border-white/[.15]"
            }
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
