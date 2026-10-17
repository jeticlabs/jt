"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { validateComposerInput } from "../schemas/agent.schema";
import type { AgentMode } from "../types/agent.types";

export function AgentComposer({
  model,
  mode,
  onSubmit,
}: {
  model: string;
  mode: AgentMode;
  onSubmit: (prompt: string) => void;
}) {
  const [prompt, setPrompt] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateComposerInput({ prompt, model, mode });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    onSubmit(result.value.prompt);
    setPrompt("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl border border-black/[.08] p-3 dark:border-white/[.12]"
    >
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask the agent…"
        rows={3}
        className="bg-transparent text-sm outline-none placeholder:text-zinc-400"
      />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          Send
        </Button>
      </div>
    </form>
  );
}
