/**
 * Public API of the agent feature.
 * Other features may only import from here — never deep internals.
 */
export { AgentWorkspace } from "./components/agent-workspace";
export { AgentSidebar } from "./components/agent-sidebar";
export { AgentConversation } from "./components/agent-conversation";
export { AgentComposer } from "./components/agent-composer";
export { ModelSelector } from "./components/model-selector";
export { AgentModeSelector } from "./components/agent-mode-selector";
export { TaskTimeline } from "./components/task-timeline";
export { ToolInvocationCard } from "./components/tool-invocation-card";
export { ExecutionApprovalDialog } from "./components/execution-approval-dialog";
export { GeneratedOutputCard } from "./components/generated-output-card";
export { useAgentSession } from "./hooks/use-agent-session";
export { useAgentEvents } from "./hooks/use-agent-events";
export * from "./types/agent.types";
export * from "./utils/normalize-agent-event";
