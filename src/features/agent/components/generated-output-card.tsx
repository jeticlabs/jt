import Link from "next/link";
import type { AgentEvent } from "../types/agent.types";

export function GeneratedOutputCard({ event }: { event: AgentEvent }) {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[.05] p-4 text-sm">
      <p className="font-medium">{event.title}</p>
      {event.body ? (
        <p className="mt-1 text-zinc-600">{event.body}</p>
      ) : null}
      <p className="mt-3 text-xs text-zinc-500">
        Rendered via `features/simulation` result components when the output is
        a simulation. <Link href="#" className="underline">View</Link>
      </p>
    </div>
  );
}
