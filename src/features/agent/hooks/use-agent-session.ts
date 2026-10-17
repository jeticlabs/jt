"use client";

import * as React from "react";
import type { AgentMode } from "../types/agent.types";

export function useAgentSession(workspaceId: string) {
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [model, setModel] = React.useState("default");
  const [mode, setMode] = React.useState<AgentMode>("fast");

  const start = React.useCallback(() => {
    // Real implementation POSTs to the backend and stores the session id.
    // Created in an event handler (not an effect) so it never runs during prerender.
    setSessionId(`local_${workspaceId}_${Date.now()}`);
  }, [workspaceId]);

  return { sessionId, model, setModel, mode, setMode, start };
}
