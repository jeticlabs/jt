import type { AgentComposerInput, AgentEvent } from "../types/agent.types";

/** Runtime validation at the trust boundary — types alone don't validate. */
export function validateComposerInput(
  value: unknown
): { ok: true; value: AgentComposerInput } | { ok: false; error: string } {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "Input must be an object" };
  }
  const v = value as Record<string, unknown>;
  if (typeof v.prompt !== "string" || v.prompt.trim().length === 0) {
    return { ok: false, error: "prompt is required" };
  }
  if (typeof v.model !== "string" || v.model.length === 0) {
    return { ok: false, error: "model is required" };
  }
  if (v.mode !== "fast" && v.mode !== "planning") {
    return { ok: false, error: "mode must be fast or planning" };
  }
  return {
    ok: true,
    value: { prompt: v.prompt, model: v.model, mode: v.mode },
  };
}

export function validateAgentEvent(
  value: unknown
): { ok: true; value: AgentEvent } | { ok: false; error: string } {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "Event must be an object" };
  }
  const v = value as Record<string, unknown>;
  if (typeof v.id !== "string" || typeof v.type !== "string") {
    return { ok: false, error: "Event id/type are required" };
  }
  if (
    v.type !== "message" &&
    v.type !== "tool_call" &&
    v.type !== "task_update" &&
    v.type !== "output"
  ) {
    return { ok: false, error: "Unknown event type" };
  }
  return {
    ok: true,
    value: {
      id: v.id,
      type: v.type,
      title: typeof v.title === "string" ? v.title : "",
      body: typeof v.body === "string" ? v.body : undefined,
      createdAt:
        typeof v.createdAt === "string"
          ? v.createdAt
          : new Date().toISOString(),
    },
  };
}
