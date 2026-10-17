import { describe, it, expect } from "vitest";
import { validateComposerInput } from "@/features/agent/schemas/agent.schema";

describe("repository-connection flow", () => {
  it("rejects empty prompts at the boundary", () => {
    const r = validateComposerInput({
      prompt: "",
      model: "default",
      mode: "fast",
    });
    expect(r.ok).toBe(false);
  });
});
