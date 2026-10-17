import type { AgentEvent, AgentEventType } from "../types/agent.types";

/** Pure helper — safe to unit test in isolation. */
export function normalizeAgentEvent(raw: unknown): AgentEvent {
  const fallback: AgentEvent = {
    id: `evt_${Date.now()}`,
    type: "message",
    title: "Unknown event",
    createdAt: new Date().toISOString(),
  };
  if (typeof raw !== "object" || raw === null) return fallback;
  const v = raw as Record<string, unknown>;
  const type: AgentEventType =
    v.type === "tool_call" ||
    v.type === "task_update" ||
    v.type === "output" ||
    v.type === "message"
      ? v.type
      : "message";
  return {
    id: typeof v.id === "string" ? v.id : fallback.id,
    type,
    title: typeof v.title === "string" ? v.title : fallback.title,
    body: typeof v.body === "string" ? v.body : undefined,
    createdAt:
      typeof v.createdAt === "string" ? v.createdAt : fallback.createdAt,
  };
}
