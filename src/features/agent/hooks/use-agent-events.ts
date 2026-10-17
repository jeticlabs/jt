"use client";

import * as React from "react";
import type { AgentEvent } from "../types/agent.types";

export function useAgentEvents(sessionId: string | null) {
  const [events, setEvents] = React.useState<AgentEvent[]>([]);

  const append = React.useCallback((event: AgentEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  React.useEffect(() => {
    if (!sessionId) return;
    // TODO: subscribe to SSE / polling via listAgentEvents.
  }, [sessionId]);

  return { events, append };
}
