import type { AgentEvent } from "../types/agent.types";

export function ToolInvocationCard({ event }: { event: AgentEvent }) {
  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[.05] p-4 text-sm">
      <p className="font-medium">Tool: {event.title}</p>
      {event.body ? (
        <pre className="mt-2 overflow-auto text-xs whitespace-pre-wrap">
          {event.body}
        </pre>
      ) : null}
    </div>
  );
}
