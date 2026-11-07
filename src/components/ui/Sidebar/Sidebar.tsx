"use client";
import { useState } from "react";
import type { ReactNode } from "react";
import { SidebarSkeleton } from "@/components/ui/skeleton";
import {
    AgentsIcon,
    AutomationsIcon,
    ChevronRightIcon,
    ConfigIcon,
    DependencyIcon,
    DeploymentsIcon,
    EndpointsIcon,
    EnvironmentIcon,
    JenkinsIcon,
    ModelIcon,
    OverviewIcon,
    ProjectIcon,
    ReportsIcon,
    RunsIcon,
    RuntimeIcon,
    SchedulesIcon,
    SchemaIcon,
    SearchIcon,
    SecurityIcon,
    SettingsIcon,
    SimulationsIcon,
    SourceIcon,
    ToolsIcon,
    WorkflowIcon,
    WorkersIcon,
} from "@/components/icons/sidebar-icons";

import { SidebarShell } from "./sidebar-shell";

/* ---------- Types ---------- */

interface NavChild {
    id: string;
    label: string;
    icon: ReactNode;
}

interface NavItem {
    id: string;
    label: string;
    icon: ReactNode;
    children?: NavChild[];
}

/* ---------- Nav data ---------- */

const NAV: NavItem[] = [
    {
        id: "overview",
        label: "Overview",
        icon: <OverviewIcon />,
    },
    {
        id: "project",
        label: "Project",
        icon: <ProjectIcon />,
        children: [
            { id: "source", label: "Source", icon: <SourceIcon /> },
            { id: "config", label: "Config", icon: <ConfigIcon /> }
        ],
    },
    {
        id: "runtime",
        label: "Runtime",
        icon: <RuntimeIcon />,
        children: [
            { id: "deployments", label: "Deployments", icon: <DeploymentsIcon /> },
            { id: "environment", label: "Enviroment", icon: <EnvironmentIcon /> }
        ],
    },
    {
        id: "model",
        label: "Model",
        icon: <ModelIcon />,
        children: [
            { id: "endpoints", label: "Endpoints", icon: <EndpointsIcon /> },
            { id: "schema", label: "Schema", icon: <SchemaIcon /> },
            { id: "security", label: "Security", icon: <SecurityIcon /> },
            { id: "dependency", label: "Dependency", icon: <DependencyIcon /> },
            { id: "jenkins", label: "Jenkins", icon: <JenkinsIcon /> },
        ],
    },
    {
        id: "workflow",
        label: "Workflow",
        icon: <WorkflowIcon />,
    },
    {
        id: "simulations",
        label: "Simulations",
        icon: <SimulationsIcon />,
    },
    {
        id: "automations",
        label: "Automations",
        icon: <AutomationsIcon />,
        children: [
            { id: "agents", label: "Agents", icon: <AgentsIcon /> },
            { id: "workers", label: "Workers", icon: <WorkersIcon /> },
            { id: "schedules", label: "Schedules", icon: <SchedulesIcon /> },
        ],
    },
    {
        id: "tools",
        label: "Tools",
        icon: <ToolsIcon />,
    },
    {
        id: "runs",
        label: "Runs & Traces",
        icon: <RunsIcon />,
    },
    {
        id: "reports",
        label: "Reports",
        icon: <ReportsIcon />,
    },
    {
        id: "settings",
        label: "Settings",
        icon: <SettingsIcon />,
    },
];

/* ---------- Sub-components ---------- */

function NavRow({
    id,
    label,
    icon,
    active,
    collapsed = false,
    depth = 0,
    hasChildren,
    open,
    onSelect,
    onToggle,
}: {
    id: string;
    label: string;
    icon: ReactNode;
    active: boolean;
    collapsed?: boolean;
    depth?: number;
    hasChildren?: boolean;
    open?: boolean;
    onSelect: (id: string) => void;
    onToggle?: (id: string) => void;
}) {
    const handleClick = () => {
        if (hasChildren && onToggle) onToggle(id);
        else onSelect(id);
    };

    return (
        <li>
            <button
                type="button"
                title={collapsed ? label : undefined}
                aria-current={active ? "page" : undefined}
                onClick={handleClick}
                style={{
                    paddingLeft: collapsed ? undefined : depth === 1 ? "2.25rem" : "0.75rem",
                }}
                className={`flex h-9 w-full items-center rounded-lg text-left text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${collapsed ? "justify-center px-0" : "gap-2.5 pr-3"
                    } ${active
                        ? "bg-[var(--jetic-recess)] font-semibold text-white"
                        : "font-medium text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
                    }`}
            >
                <span className={active ? "text-white" : "text-[var(--jetic-faint)]"}>{icon}</span>
                {!collapsed && <span className="flex-1 truncate">{label}</span>}
                {!collapsed && hasChildren && (
                    <span className={active || open ? "text-[var(--jetic-muted)]" : "text-[var(--jetic-faint)]"}>
                        <ChevronRightIcon open={!!open} />
                    </span>
                )}
            </button>
        </li>
    );
}

/* ---------- Component ---------- */

interface SidebarProps {
    collapsed?: boolean;
    loading?: boolean;
}

export default function Sidebar({ collapsed = false, loading = false }: SidebarProps) {
    const [active, setActive] = useState<string>("overview");
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["model"]));
    const [query, setQuery] = useState<string>("");

    if (loading) {
        return <SidebarSkeleton collapsed={collapsed} />;
    }

    const toggle = (id: string) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const filtered = query.trim().toLowerCase();

    const visibleItems = NAV.flatMap((item) => {
        if (!filtered) return [item];
        const matchParent = item.label.toLowerCase().includes(filtered);
        const matchedChildren = item.children?.filter((c) =>
            c.label.toLowerCase().includes(filtered)
        );
        if (matchParent) return [item];
        if (matchedChildren?.length) return [{ ...item, children: matchedChildren }];
        return [];
    });

    return (
        <SidebarShell collapsed={collapsed} aria-label="Sandbox">
            {/* Search */}
            {!collapsed && (
                <div className="p-2 pb-2">
                    <label className="flex h-9 items-center gap-2.5 rounded-lg border border-white/10 bg-[var(--jetic-recess)] pl-3 pr-2 text-[var(--jetic-faint)] transition-colors focus-within:border-[var(--jetic-ring)]">
                        <SearchIcon />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Find"
                            aria-label="Find"
                            className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-[var(--jetic-faint)] focus:outline-none"
                        />
                        {!query && (
                            <kbd className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-white/10 bg-[var(--jetic-bg)] text-[11px] font-semibold text-[var(--jetic-muted)]">
                                F
                            </kbd>
                        )}
                    </label>
                </div>
            )}

            {/* Nav */}
            <nav
                aria-label="Main"
                className={`flex-1 overflow-y-auto pb-4 [scrollbar-color:#2a2a2a_transparent] [scrollbar-width:thin]  ${collapsed ? "px-1.5 pt-2" : "px-2"
                    }`}
            >
                <ul className="flex flex-col gap-0.5">
                    {visibleItems.map((item) => {
                        const isOpen = expanded.has(item.id);
                        return (
                            <div key={item.id}>
                                <NavRow
                                    id={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                    active={active === item.id}
                                    collapsed={collapsed}
                                    hasChildren={!!item.children?.length}
                                    open={isOpen}
                                    onSelect={setActive}
                                    onToggle={toggle}
                                />
                                {/* Children */}
                                {!collapsed && item.children && isOpen && (
                                    <ul className="mt-0.5 flex flex-col gap-0.5">
                                        {item.children.map((child) => (
                                            <NavRow
                                                key={child.id}
                                                id={child.id}
                                                label={child.label}
                                                icon={child.icon}
                                                active={active === child.id}
                                                depth={1}
                                                onSelect={setActive}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </nav>
        </SidebarShell>
    );
}