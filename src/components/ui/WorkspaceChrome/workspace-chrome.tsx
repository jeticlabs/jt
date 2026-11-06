"use client";

import {
  createContext,
  Suspense,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useParams, usePathname, useRouter } from "next/navigation";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import WorkspaceSidebar from "@/components/ui/Sidebar/workspace-sidebar";
import { ToolbarSkeleton } from "@/components/ui/skeleton";
import Toolbar, {
  type ToolbarUser,
  type ToolbarWorkspace,
} from "@/components/ui/Toolbar/toolbar";

interface ChromeState {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const ChromeContext = createContext<ChromeState | null>(null);

function useChrome(): ChromeState {
  const value = useContext(ChromeContext);
  if (!value) {
    throw new Error("Workspace chrome components must render inside WorkspaceChrome");
  }
  return value;
}

interface WorkspaceChromeProps {
  user: ToolbarUser;
  workspace: ToolbarWorkspace;
  workspaces: ToolbarWorkspace[];
  children: ReactNode;
}

/**
 * Shared shell for every `/app/workspace/[workspaceId]` route.
 *
 * Holds the sidebar collapse state so the toolbar and the sidebar stay in
 * sync, then picks the right sidebar for the active route:
 *   - workspace routes → workspace nav (Overview / Integrations / …)
 *   - sandbox routes   → sandbox editor nav
 */
export function WorkspaceChrome({
  user,
  workspace,
  workspaces,
  children,
}: WorkspaceChromeProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ChromeContext.Provider
      value={{ collapsed, toggleSidebar: () => setCollapsed((value) => !value) }}
    >
      <div className="jetic-surface flex h-full min-h-0 w-full flex-col">
        <Suspense fallback={<ToolbarFallback />}>
          <ChromeToolbar user={user} workspace={workspace} workspaces={workspaces} />
        </Suspense>

        <div className="flex min-h-0 w-full flex-1">
          <Suspense fallback={<SidebarFallback />}>
            <SidebarOutlet workspaceName={workspace.name} />
          </Suspense>

          <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </ChromeContext.Provider>
  );
}

function ChromeToolbar({
  user,
  workspace,
  workspaces,
}: {
  user: ToolbarUser;
  workspace: ToolbarWorkspace;
  workspaces: ToolbarWorkspace[];
}) {
  const params = useParams<{ workspaceId?: string | string[]; sandboxId?: string | string[] }>();
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { collapsed, toggleSidebar } = useChrome();
  const workspaceSlug = Array.isArray(params?.workspaceId)
    ? params.workspaceId[0] ?? workspace.slug
    : params?.workspaceId ?? workspace.slug;
  const sandboxId = Array.isArray(params?.sandboxId)
    ? params.sandboxId[0] ?? ""
    : params?.sandboxId ?? "";
  const isSandboxRoute = /^\/app\/workspace\/[^/]+\/sandbox\/[^/]+(?:\/|$)/.test(pathname);
  const isAgenticMode = /\/chat(?:\/|$)/.test(pathname);

  const openSandbox = (id: string) => {
    if (!id || id === sandboxId) return;
    const basePath = `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(id)}`;
    router.push(isAgenticMode ? `${basePath}/chat` : basePath);
  };

  return (
    <Toolbar
      key={`${workspace.id}:${sandboxId}`}
      user={user}
      workspace={workspace}
      workspaces={workspaces}
      project={sandboxId}
      isSandboxRoute={isSandboxRoute}
      isAgenticMode={isAgenticMode}
      onSelectSandbox={openSandbox}
      onModeChange={(mode) => {
        if (!sandboxId) return;
        const basePath = `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandboxId)}`;
        router.push(mode === "Agentic Mode" ? `${basePath}/chat` : basePath);
      }}
      sidebarCollapsed={collapsed}
      onToggleSidebar={toggleSidebar}
    />
  );
}

function SidebarOutlet({ workspaceName }: { workspaceName: string }) {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname() ?? "";
  const { collapsed } = useChrome();

  const isSandbox = /^\/app\/workspace\/[^/]+\/sandbox(\/|$)/.test(pathname);

  return isSandbox ? (
    <Sidebar collapsed={collapsed} />
  ) : (
    <WorkspaceSidebar
      workspaceId={workspaceId}
      workspaceName={workspaceName}
      collapsed={collapsed}
    />
  );
}

function useWorkspaceId(): string {
  const params = useParams<{ workspaceId?: string | string[] }>();
  const value = params?.workspaceId;
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function ToolbarFallback() {
  return <ToolbarSkeleton className="shrink-0" />;
}

function SidebarFallback() {
  const { collapsed } = useChrome();
  return <Sidebar loading collapsed={collapsed} />;
}
