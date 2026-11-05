"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SidebarShell } from "./sidebar-shell";

/* ---------- Icons ---------- */

const Svg = ({
  children,
  size = 16,
  strokeWidth = 1.7,
}: {
  children: ReactNode;
  size?: number;
  strokeWidth?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconOverview = () => (
  <Svg>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </Svg>
);
const IconIntegrations = () => (
  <Svg>
    <path d="M9 7V4a3 3 0 0 1 6 0v3" />
    <rect x="4" y="7" width="16" height="13" rx="3" />
    <path d="M9 13h6" />
  </Svg>
);
const IconMembers = () => (
  <Svg>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16.5 5.5a3 3 0 0 1 0 5.5" />
    <path d="M18 14.5a5 5 0 0 1 3.5 4.5" />
  </Svg>
);
const IconBilling = () => (
  <Svg>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 10h18" />
    <path d="M7 15h3" />
  </Svg>
);
const IconSettings = () => (
  <Svg>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </Svg>
);

/* ---------- Nav data ---------- */

interface WorkspaceNavItem {
  label: string;
  segment: string;
  icon: ReactNode;
  exact?: boolean;
}

const NAV: WorkspaceNavItem[] = [
  { label: "Overview", segment: "", icon: <IconOverview />, exact: true },
  { label: "Integrations", segment: "integrations", icon: <IconIntegrations /> },
  { label: "Members", segment: "members", icon: <IconMembers /> },
  { label: "Billing & Usage", segment: "billing", icon: <IconBilling /> },
  { label: "Settings", segment: "settings", icon: <IconSettings /> },
];

/* ---------- Component ---------- */

interface WorkspaceSidebarProps {
  workspaceId: string;
  collapsed?: boolean;
}

export default function WorkspaceSidebar({
  workspaceId,
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
            Workspace
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
