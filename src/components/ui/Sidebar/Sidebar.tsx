"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
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
    segment: string;
    icon: ReactNode;
    permission: string;
}

interface NavItem {
    id: string;
    label: string;
    segment?: string;
    icon: ReactNode;
    permission: string;
    children?: NavChild[];
}

/* ---------- Nav data ---------- */

const NAV: NavItem[] = [
    {
        id: "overview",
        label: "Overview",
        segment: "",
        icon: <OverviewIcon />,
        permission: "sandbox.overview.view",
    },
    {
        id: "project",
        label: "Project",
        icon: <ProjectIcon />,
        permission: "sandbox.source.view",
        children: [
            { id: "source", label: "Source", segment: "source", icon: <SourceIcon />, permission: "sandbox.source.view" },
            { id: "config", label: "Config", segment: "config", icon: <ConfigIcon />, permission: "sandbox.config.view" },
        ],
    },
    {
        id: "runtime",
        label: "Runtime",
        icon: <RuntimeIcon />,
        permission: "sandbox.deployments.view",
        children: [
            { id: "deployments", label: "Deployments", segment: "deployments", icon: <DeploymentsIcon />, permission: "sandbox.deployments.view" },
            { id: "environment", label: "Environment", segment: "environments", icon: <EnvironmentIcon />, permission: "sandbox.environments.view" },
        ],
    },
    {
        id: "model",
        label: "Model",
        icon: <ModelIcon />,
        permission: "sandbox.models.view",
        children: [
            { id: "endpoints", label: "Endpoints", segment: "endpoints", icon: <EndpointsIcon />, permission: "sandbox.models.view" },
            { id: "schema", label: "Schema", segment: "schema", icon: <SchemaIcon />, permission: "sandbox.models.view" },
            { id: "security", label: "Security", segment: "security", icon: <SecurityIcon />, permission: "sandbox.security.view" },
            { id: "dependency", label: "Dependency", segment: "dependency", icon: <DependencyIcon />, permission: "sandbox.dependencies.view" },
            { id: "jenkins", label: "Jenkins", segment: "jenkins", icon: <JenkinsIcon />, permission: "sandbox.jenkins.view" },
        ],
    },
    {
        id: "workflow",
        label: "Workflow",
        segment: "workflow",
        icon: <WorkflowIcon />,
        permission: "sandbox.workflow.view",
    },
    {
        id: "simulations",
        label: "Simulations",
        segment: "simulations",
        icon: <SimulationsIcon />,
        permission: "sandbox.simulations.view",
    },
    {
        id: "automations",
        label: "Automations",
        icon: <AutomationsIcon />,
        permission: "sandbox.agents.view",
        children: [
            { id: "agents", label: "Agents", segment: "agent", icon: <AgentsIcon />, permission: "sandbox.agents.view" },
            { id: "workers", label: "Workers", segment: "workers", icon: <WorkersIcon />, permission: "sandbox.workers.view" },
            { id: "schedules", label: "Schedules", segment: "schedules", icon: <SchedulesIcon />, permission: "sandbox.schedules.view" },
        ],
    },
    {
        id: "tools",
        label: "Tools",
        segment: "tools",
        icon: <ToolsIcon />,
        permission: "sandbox.tools.view",
    },
    {
        id: "runs",
        label: "Runs & Traces",
        segment: "runs",
        icon: <RunsIcon />,
        permission: "sandbox.runs.view",
    },
    {
        id: "reports",
        label: "Reports",
        segment: "reports",
        icon: <ReportsIcon />,
        permission: "sandbox.reports.view",
    },
    {
        id: "settings",
        label: "Settings",
        segment: "settings",
        icon: <SettingsIcon />,
        permission: "sandbox.settings.view",
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
    href,
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
    href?: string;
    onToggle?: (id: string) => void;
}) {
    const className = `flex h-9 w-full items-center rounded-lg text-left text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${collapsed ? "justify-center px-0" : "gap-2.5 pr-3"
        } ${active
            ? "bg-[var(--jetic-recess)] font-semibold text-white"
            : "font-medium text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
        }`;
    const style = {
        paddingLeft: collapsed ? undefined : depth === 1 ? "2.25rem" : "0.75rem",
    };
    const content = (
        <>
            <span className={active ? "text-white" : "text-[var(--jetic-faint)]"}>{icon}</span>
            {!collapsed && <span className="flex-1 truncate">{label}</span>}
            {!collapsed && hasChildren && (
                <span className={active || open ? "text-[var(--jetic-muted)]" : "text-[var(--jetic-faint)]"}>
                    <ChevronRightIcon open={!!open} />
                </span>
            )}
        </>
    );

    return (
        <li>
            {href ? (
                <Link
                    href={href}
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={className}
                    style={style}
                >
                    {content}
                </Link>
            ) : (
                <button
                    type="button"
                    title={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    onClick={() => onToggle?.(id)}
                    className={className}
                    style={style}
                >
                    {content}
                </button>
            )}
        </li>
    );
}

/* ---------- Component ---------- */

interface SidebarProps {
    collapsed?: boolean;
    loading?: boolean;
    permissions: Readonly<Record<string, boolean>>;
}

export default function Sidebar({ collapsed = false, loading = false, permissions }: SidebarProps) {
    const params = useParams<{ workspaceId?: string | string[]; sandboxId?: string | string[] }>();
    const pathname = usePathname() ?? "";
    const workspaceSlug = Array.isArray(params?.workspaceId)
        ? (params.workspaceId[0] ?? "")
        : (params?.workspaceId ?? "");
    const sandboxSlug = Array.isArray(params?.sandboxId)
        ? (params.sandboxId[0] ?? "")
        : (params?.sandboxId ?? "");
    const base = `/app/workspace/${encodeURIComponent(workspaceSlug)}/sandbox/${encodeURIComponent(sandboxSlug)}`;
    const relative = pathname === base
        ? ""
        : pathname.startsWith(`${base}/`)
            ? pathname.slice(base.length + 1)
            : "";

    const [expanded, setExpanded] = useState<Set<string>>(new Set(["project"]));
    const [query, setQuery] = useState<string>("");

    const permittedNav = useMemo(() => {
        if (permissions["sandbox.view"] === false) return [];
        return NAV.map((item) => ({
            ...item,
            children: item.children?.filter(
                (child) => permissions[child.permission] !== false,
            ),
        })).filter(
            (item) =>
                permissions[item.permission] !== false &&
                (!item.children || item.children.length > 0),
        );
    }, [permissions]);

    const activeParentId = useMemo(
        () =>
            permittedNav.find((item) =>
                item.children?.some(
                    (child) =>
                        relative === child.segment ||
                        relative.startsWith(`${child.segment}/`),
                ),
            )?.id,
        [relative, permittedNav],
    );

    const openGroups = useMemo(() => {
        const next = new Set(expanded);
        if (activeParentId) next.add(activeParentId);
        return next;
    }, [expanded, activeParentId]);

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

    const isChildActive = (child: NavChild) =>
        relative === child.segment || relative.startsWith(`${child.segment}/`);

    const isItemActive = (item: NavItem) =>
        item.children?.length
            ? item.children.some(isChildActive)
            : item.segment === ""
                ? relative === ""
                : relative === item.segment || relative.startsWith(`${item.segment}/`);

    const filtered = query.trim().toLowerCase();

    const visibleItems = permittedNav.flatMap((item) => {
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
                        const isOpen = openGroups.has(item.id);
                        const active = isItemActive(item);
                        const firstChild = item.children?.[0];
                        const href = item.children?.length
                            ? collapsed && firstChild
                                ? `${base}/${firstChild.segment}`
                                : undefined
                            : `${base}${item.segment ? `/${item.segment}` : ""}`;

                        return (
                            <div key={item.id}>
                                <NavRow
                                    id={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                    active={active}
                                    collapsed={collapsed}
                                    hasChildren={!!item.children?.length}
                                    open={isOpen}
                                    href={href}
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
                                                active={isChildActive(child)}
                                                depth={1}
                                                href={`${base}/${child.segment}`}
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
