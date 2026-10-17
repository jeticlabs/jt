import { apiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AgentEvent, AgentSession } from "../types/agent.types";

/** Typed functions for talking to the agent backend. */
export async function createAgentSession(
  workspaceId: string,
  input: { model: string; mode: "fast" | "planning" }
): Promise<AgentSession> {
  return apiClient.post<AgentSession>(
    endpoints.agentSessions(workspaceId),
    input
  );
}

export async function listAgentEvents(
  workspaceId: string,
  sessionId: string
): Promise<AgentEvent[]> {
  return apiClient.get<AgentEvent[]>(
    endpoints.agentEvents(workspaceId, sessionId)
  );
}
