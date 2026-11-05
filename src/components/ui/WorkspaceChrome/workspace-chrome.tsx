"use client";

import {
  createContext,
  Suspense,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { useParams, usePathname } from "next/navigation";

import Sidebar from "@/components/ui/Sidebar/Sidebar";
import { SidebarShell } from "@/components/ui/Sidebar/sidebar-shell";
import WorkspaceSidebar from "@/components/ui/Sidebar/workspace-sidebar";
import Toolbar from "@/components/ui/Toolbar/toolbar";

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

/**
 * Shared shell for every `/app/workspace/[workspaceId]` route.
 *
 * Holds the sidebar collapse state so the toolbar and the sidebar stay in
 * sync, then picks the right sidebar for the active route:
 *   - workspace routes → workspace nav (Overview / Integrations / …)
 *   - sandbox routes   → sandbox editor nav
 */
export function WorkspaceChrome({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ChromeContext.Provider
      value={{ collapsed, toggleSidebar: () => setCollapsed((value) => !value) }}
    >
      <div className="jetic-surface flex h-full min-h-0 w-full flex-col">
        <Suspense fallback={<ToolbarFallback />}>
          <ChromeToolbar />
        </Suspense>

        <div className="flex min-h-0 w-full flex-1">
          <Suspense fallback={<SidebarFallback />}>
            <SidebarOutlet />
          </Suspense>

          <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </div>
    </ChromeContext.Provider>
  );
}

function ChromeToolbar() {
  const workspaceId = useWorkspaceId();
  const { collapsed, toggleSidebar } = useChrome();

  return (
    <Toolbar
      workspace={workspaceId}
      sidebarCollapsed={collapsed}
      onToggleSidebar={toggleSidebar}
    />
  );
}

function SidebarOutlet() {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname() ?? "";
  const { collapsed } = useChrome();

  const isSandbox = /^\/app\/workspace\/[^/]+\/sandbox(\/|$)/.test(pathname);

  return isSandbox ? (
    <Sidebar collapsed={collapsed} />
  ) : (
    <WorkspaceSidebar workspaceId={workspaceId} collapsed={collapsed} />
  );
}

function useWorkspaceId(): string {
  const params = useParams<{ workspaceId?: string | string[] }>();
  const value = params?.workspaceId;
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function ToolbarFallback() {
  return (
    <div
      aria-hidden="true"
      className="h-[74px] w-full shrink-0 border-b border-white/10 bg-[var(--jetic-bg)]"
    />
  );
}

function SidebarFallback() {
  const { collapsed } = useChrome();
  return (
    <SidebarShell collapsed={collapsed} aria-label="Loading sidebar">
      <div className="h-full w-full" />
    </SidebarShell>
  );
}
