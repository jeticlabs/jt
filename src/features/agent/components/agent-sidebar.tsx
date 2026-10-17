"use client";

import { ModelSelector } from "./model-selector";
import { AgentModeSelector } from "./agent-mode-selector";
import { TaskTimeline } from "./task-timeline";
import type { AgentMode } from "../types/agent.types";

export function AgentSidebar({
  model,
  onModelChange,
  mode,
  onModeChange,
}: {
  model: string;
  onModelChange: (m: string) => void;
  mode: AgentMode;
  onModeChange: (m: AgentMode) => void;
}) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-4 rounded-2xl border border-black/[.08] p-4 dark:border-white/[.08] md:flex">
      <ModelSelector value={model} onChange={onModelChange} />
      <AgentModeSelector value={mode} onChange={onModeChange} />
      <TaskTimeline events={[]} />
    </aside>
  );
}
