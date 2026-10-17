export type AgentMode = "fast" | "planning";

export type AgentEventType =
  | "message"
  | "tool_call"
  | "task_update"
  | "output";

export interface AgentEvent {
  id: string;
  type: AgentEventType;
  title: string;
  body?: string;
  createdAt: string;
}

export interface AgentSession {
  id: string;
  workspaceId: string;
  model: string;
  mode: AgentMode;
}

export interface AgentComposerInput {
  prompt: string;
  model: string;
  mode: AgentMode;
}
