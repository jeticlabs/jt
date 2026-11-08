"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import {
  ActivityIcon,
  BillingIcon,
  IntegrationsIcon,
  MembersIcon,
  OverviewIcon,
  SettingsIcon,
} from "@/components/icons/sidebar-icons";

import { SidebarShell } from "./sidebar-shell";

/* ---------- Nav data ---------- */

interface WorkspaceNavItem {
  label: string;
  segment: string;
  icon: ReactNode;
  exact?: boolean;
}

const NAV: WorkspaceNavItem[] = [
  { label: "Overview", segment: "", icon: <OverviewIcon />, exact: true },
  { label: "Activity", segment: "activity", icon: <ActivityIcon /> },
  { label: "Integrations", segment: "integrations", icon: <IntegrationsIcon /> },
  { label: "Members", segment: "members", icon: <MembersIcon /> },
  { label: "Billing & Usage", segment: "billing", icon: <BillingIcon /> },
  { label: "Settings", segment: "settings", icon: <SettingsIcon /> },
];

/* ---------- Component ---------- */

interface WorkspaceSidebarProps {
  workspaceId: string;
  workspaceName?: string;
  collapsed?: boolean;
}

export default function WorkspaceSidebar({
  workspaceId,
  workspaceName,
  collapsed = false,
}: WorkspaceSidebarProps) {
  const pathname = usePathname() ?? "";
  const base = `/app/workspace/${workspaceId}`;

  return (
    <SidebarShell collapsed={collapsed} aria-label="Workspace">
      <div
        className={`hidden  h-11 shrink-0 items-center border-b border-white/10 ${
          collapsed ? "justify-center px-0" : "px-3"
        }`}
      >
        {collapsed ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--jetic-well)] text-[11px] font-semibold text-white"
            aria-hidden="true"
          >
            {workspaceId.slice(0, 1).toUpperCase()}
          </span>
        ) : (
          <span className="min-w-0 truncate text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--jetic-faint)]">
            {workspaceName ?? "Workspace"}
          </span>
        )}
      </div>

      <nav
        aria-label="Workspace"
        className={`bg-[#0a0a0a] flex-1 overflow-y-auto py-2 [scrollbar-color:#2a2a2a_transparent] [scrollbar-width:thin] ${
          collapsed ? "px-1.5" : "px-2"
        }`}
      >
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const href = item.segment ? `${base}/${item.segment}` : base;
            const active = item.exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={item.label}>
                <Link
                  href={href}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-9 w-full items-center rounded-lg text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
                    collapsed ? "justify-center px-0" : "gap-2.5 px-3"
                  } ${
                    active
                      ? "bg-[var(--jetic-recess)] font-semibold text-white"
                      : "font-medium text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
                  }`}
                >
                  <span className={active ? "text-white" : "text-[var(--jetic-faint)]"}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </SidebarShell>
  );
}
