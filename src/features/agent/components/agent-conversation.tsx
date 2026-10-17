"use client";

import { EmptyState } from "@/components/feedback/empty-state";
import { ToolInvocationCard } from "./tool-invocation-card";
import { GeneratedOutputCard } from "./generated-output-card";
import type { AgentEvent } from "../types/agent.types";

export function AgentConversation({ events }: { events: AgentEvent[] }) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Start a session"
        body="Ask the agent to draft a simulation, explain an API, or plan an integration."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {events.map((e) =>
        e.type === "tool_call" ? (
          <ToolInvocationCard key={e.id} event={e} />
        ) : e.type === "output" ? (
          <GeneratedOutputCard key={e.id} event={e} />
        ) : (
          <div
            key={e.id}
            className="rounded-2xl border border-black/[.08] p-4 text-sm dark:border-white/[.08]"
          >
            <p className="font-medium">{e.title}</p>
            {e.body ? (
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{e.body}</p>
            ) : null}
          </div>
        )
      )}
    </div>
  );
}
