"use client";

import type { ReactNode } from "react";

/** Expanded / collapsed sidebar widths, in pixels. */
export const SIDEBAR_WIDTH = 240;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

interface SidebarShellProps {
  collapsed: boolean;
  children: ReactNode;
  "aria-label"?: string;
  className?: string;
}

/**
 * Shared frame for every product sidebar.
 *
 * Owns the width animation so the workspace and sandbox sidebars collapse
 * identically. Content is responsible for hiding labels at narrow widths.
 */
export function SidebarShell({
  collapsed,
  children,
  className = "",
  ...rest
}: SidebarShellProps) {
  return (
    <aside
      aria-label={rest["aria-label"]}
      data-collapsed={collapsed}
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
      className={`flex h-full shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[var(--jetic-well)] text-white antialiased transition-[width] duration-200 ease-out motion-reduce:transition-none ${className}`}
    >
      {children}
    </aside>
  );
}
