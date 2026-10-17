import type { AgentEvent } from "../types/agent.types";

export function TaskTimeline({ events }: { events: AgentEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="text-xs text-zinc-500">
        No tasks yet. Planning mode will show steps here.
      </div>
    );
  }
  return (
    <ol className="flex flex-col gap-2 text-xs">
      {events.map((e) => (
        <li
          key={e.id}
          className="rounded-lg border border-black/[.06] px-2 py-1.5 dark:border-white/[.08]"
        >
          {e.title}
        </li>
      ))}
    </ol>
  );
}
