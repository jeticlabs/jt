/**
 * Central route table for the Jetic backend API.
 * Pages and features import from here instead of hardcoding strings.
 */
export const endpoints = {
  health: "/health",
  workspaces: "/workspaces",
  workspace: (workspaceId: string) => `/workspaces/${workspaceId}`,
  repositories: (workspaceId: string) =>
    `/workspaces/${workspaceId}/repositories`,
  simulations: (workspaceId: string) =>
    `/workspaces/${workspaceId}/simulations`,
  simulation: (workspaceId: string, simulationId: string) =>
    `/workspaces/${workspaceId}/simulations/${simulationId}`,
  agentSessions: (workspaceId: string) =>
    `/workspaces/${workspaceId}/agent/sessions`,
  agentEvents: (workspaceId: string, sessionId: string) =>
    `/workspaces/${workspaceId}/agent/sessions/${sessionId}/events`,
} as const;
