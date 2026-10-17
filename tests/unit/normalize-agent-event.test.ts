import { describe, it, expect } from "vitest";
import { normalizeAgentEvent } from "@/features/agent/utils/normalize-agent-event";

describe("normalizeAgentEvent", () => {
  it("normalizes unknown input to a message event", () => {
    const e = normalizeAgentEvent(null);
    expect(e.type).toBe("message");
    expect(e.id.length).toBeGreaterThan(0);
  });

  it("keeps known tool_call events", () => {
    const e = normalizeAgentEvent({
      id: "1",
      type: "tool_call",
      title: "run-sim",
      createdAt: new Date().toISOString(),
    });
    expect(e.type).toBe("tool_call");
    expect(e.title).toBe("run-sim");
  });
});
