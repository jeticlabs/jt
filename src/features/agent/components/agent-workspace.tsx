"use client";

import { useAgentSession } from "../hooks/use-agent-session";
import { useAgentEvents } from "../hooks/use-agent-events";
import { AgentSidebar } from "./agent-sidebar";
import { AgentConversation } from "./agent-conversation";
import { AgentComposer } from "./agent-composer";
import { Button } from "@/components/ui/button";

export function AgentWorkspace({ workspaceId }: { workspaceId: string }) {
  const session = useAgentSession(workspaceId);
  const { events, append } = useAgentEvents(session.sessionId);

  if (!session.sessionId) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Agent workspace
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Start a local session. Production sessions are created
            backend-side with approvals.
          </p>
        </div>
        <Button onClick={session.start}>Start session</Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] gap-4">
      <AgentSidebar
        model={session.model}
        onModelChange={session.setModel}
        mode={session.mode}
        onModeChange={session.setMode}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <AgentConversation events={events} />
        <AgentComposer
          model={session.model}
          mode={session.mode}
          onSubmit={(prompt) =>
            append({
              id: `evt_${Date.now()}`,
              type: "message",
              title: prompt,
              createdAt: new Date().toISOString(),
            })
          }
        />
      </div>
    </div>
  );
}
