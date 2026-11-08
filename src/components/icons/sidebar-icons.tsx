import type { CSSProperties, ReactNode } from "react";

/**
 * Shared stroke-icon primitives for the product sidebars.
 *
 * The icons live here instead of inside each sidebar so the sandbox and
 * workspace navigation can share the same visual language (24×24 grid,
 * rounded caps, currentColor stroke).
 */

export interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
}

interface IconFrameProps extends IconProps {
  children: ReactNode;
}

function IconFrame({
  children,
  size = 16,
  strokeWidth = 1.7,
  className,
  style,
}: IconFrameProps) {
  return (
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
      className={className}
      style={style}
    >
      {children}
    </svg>
  );
}

/* ---------- Shared chrome ---------- */

export function SearchIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconFrame>
  );
}

export function ChevronRightIcon({
  open = false,
  size = 13,
  ...props
}: IconProps & { open?: boolean }) {
  return (
    <IconFrame
      {...props}
      size={size}
      strokeWidth={2.2}
      style={{
        transition: "transform 180ms ease",
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
      }}
    >
      <path d="m9 6 6 6-6 6" />
    </IconFrame>
  );
}

/* ---------- Sandbox navigation ---------- */

export function OverviewIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconFrame>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M3 12h4l2.2-6 4.1 12 2.2-6H21" />
    </IconFrame>
  );
}

export function ProjectIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.5h7.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5Z" />
    </IconFrame>
  );
}

export function SourceIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="m8 8-4 4 4 4" />
      <path d="m16 8 4 4-4 4" />
      <path d="m13.5 5-3 14" />
    </IconFrame>
  );
}

export function ConfigIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M4 7h9.5" />
      <circle cx="16" cy="7" r="2.5" />
      <path d="M18.5 7H20" />
      <path d="M4 17h1.5" />
      <circle cx="8" cy="17" r="2.5" />
      <path d="M10.5 17H20" />
    </IconFrame>
  );
}

export function RuntimeIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" strokeWidth={2.4} />
    </IconFrame>
  );
}

export function DeploymentsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 15V3" />
      <path d="m7.5 7.5 4.5-4.5 4.5 4.5" />
      <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </IconFrame>
  );
}

export function EnvironmentIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.7 2.4 4 5.5 4 9s-1.3 6.6-4 9c-2.7-2.4-4-5.5-4-9s1.3-6.6 4-9Z" />
    </IconFrame>
  );
}

export function ModelIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 3 4 7.5v9L12 21l8-4.5v-9Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </IconFrame>
  );
}

export function EndpointsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M8 5H7a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2 2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h1" />
      <path d="M16 5h1a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a2 2 0 0 1-2 2h-1" />
      <path d="m14 4-4 16" />
    </IconFrame>
  );
}

export function SchemaIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </IconFrame>
  );
}

export function SecurityIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 3 4 6.5V11c0 5 3.4 9.4 8 10.5 4.6-1.1 8-5.5 8-10.5V6.5Z" />
      <path d="m9 11.5 2 2 4-4" />
    </IconFrame>
  );
}

export function DependencyIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M6 8.5v1a6 6 0 0 0 6 6M18 8.5v1a6 6 0 0 1-6 6" />
    </IconFrame>
  );
}

export function JenkinsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M12 2 20 7v10l-8 5-8-5V7Z" />
      <path d="m10 9 5 3-5 3Z" />
    </IconFrame>
  );
}

export function WorkflowIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="2" y="7" width="6" height="10" rx="1.5" />
      <rect x="16" y="7" width="6" height="10" rx="1.5" />
      <path d="M8 12h8" />
      <path d="m13 9 3 3-3 3" />
    </IconFrame>
  );
}

export function SimulationsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v5.8L4.6 17a2.5 2.5 0 0 0 2.1 3.7h10.6a2.5 2.5 0 0 0 2.1-3.7L14 8.8V3" />
      <path d="M7.6 15h8.8" />
    </IconFrame>
  );
}

export function AutomationsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13Z" />
    </IconFrame>
  );
}

export function AgentsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4" />
      <circle cx="12" cy="3" r="1" />
      <path d="M9 13h.01M15 13h.01" strokeWidth={2.4} />
      <path d="M9.5 16.5h5" />
    </IconFrame>
  );
}

export function WorkersIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="9" cy="7" r="4" />
      <path d="M2 21v-2a7 7 0 0 1 7-7" />
      <path d="m16 11 2 2 4-4" />
    </IconFrame>
  );
}

export function SchedulesIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </IconFrame>
  );
}

export function ToolsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </IconFrame>
  );
}

export function RunsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M3 12h4l3-8 4 16 3-8h4" />
    </IconFrame>
  );
}

export function ReportsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </IconFrame>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </IconFrame>
  );
}

/* ---------- Workspace navigation ---------- */

export function IntegrationsIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <path d="M9 7V3M15 7V3" />
      <path d="M6 7h12v4a6 6 0 0 1-12 0Z" />
      <path d="M12 17v4" />
    </IconFrame>
  );
}

export function MembersIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16.5 5.5a3 3 0 0 1 0 5.5" />
      <path d="M18 14.5a5 5 0 0 1 3.5 4.5" />
    </IconFrame>
  );
}

export function BillingIcon(props: IconProps) {
  return (
    <IconFrame {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </IconFrame>
  );
}
