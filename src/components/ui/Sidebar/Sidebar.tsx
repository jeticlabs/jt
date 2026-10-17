"use client";
import { useState } from "react";
import type { ReactNode } from "react";

/* ---------- Icons ---------- */

const Svg = ({
    children,
    size = 16,
    strokeWidth = 1.6,
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

const Search = () => <Svg size={16}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
const IconOverview = () => <Svg><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></Svg>;
const IconModel = () => <Svg><path d="M12 3 4 7.5v9L12 21l8-4.5v-9Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></Svg>;
const IconEndpoints = () => <Svg><path d="M4 6h16M4 12h16M4 18h7" /><circle cx="17" cy="18" r="3" /><path d="m19.5 15.5-5 5" /></Svg>;
const IconSchema = () => <Svg><rect x="3" y="3" width="7" height="5" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="8" y="16" width="8" height="5" rx="1" /><path d="M6.5 8v4h11V8" /><path d="M12 12v4" /></Svg>;
const IconSecurity = () => <Svg><path d="M12 3 4 7v5c0 5.25 3.6 10.15 8 11 4.4-.85 8-5.75 8-11V7Z" /></Svg>;
const IconDependency = () => <Svg><circle cx="6" cy="6" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="12" cy="18" r="3" /><path d="M6 9v1a6 6 0 0 0 6 6M18 9v1a6 6 0 0 1-6 6" /></Svg>;
const IconJenkins = () => <Svg><circle cx="12" cy="8" r="4" /><path d="M8 14c-3 1-5 3-5 5h18c0-2-2-4-5-5" /><path d="M12 12v4" /></Svg>;
const IconWorkflow = () => <Svg><rect x="2" y="7" width="6" height="10" rx="1" /><rect x="16" y="7" width="6" height="10" rx="1" /><path d="M8 12h8" /><path d="m13 9 3 3-3 3" /></Svg>;
const IconSim = () => <Svg><path d="M3 3v18h18" /><path d="m7 16 4-6 4 4 4-8" /></Svg>;
const IconAutomation = () => <Svg><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" /></Svg>;
const IconAgents = () => <Svg><path d="M12 4h.01M8 8h.01M16 8h.01M4 12h.01M20 12h.01M8 16h.01M16 16h.01M12 20h.01" strokeWidth={2.2} /></Svg>;
const IconWorkers = () => <Svg><circle cx="9" cy="7" r="4" /><path d="M2 21v-2a7 7 0 0 1 7-7" /><path d="m16 11 2 2 4-4" /></Svg>;
const IconSchedule = () => <Svg><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Svg>;
const IconTools = () => <Svg><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" /></Svg>;
const IconRuns = () => <Svg><polygon points="5 3 19 12 5 21 5 3" /></Svg>;
const IconReports = () => <Svg><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></Svg>;
const IconSettings = () => <Svg><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></Svg>;

const ChevronRight = ({ open }: { open: boolean }) => (
    <svg
        width={13}
        height={13}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transition: "transform 180ms ease", transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
        <path d="m9 6 6 6-6 6" />
    </svg>
);

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
        icon: <IconOverview />,
    },
    {
        id: "model",
        label: "Model",
        icon: <IconModel />,
        children: [
            { id: "endpoints", label: "Endpoints", icon: <IconEndpoints /> },
            { id: "schema", label: "Schema", icon: <IconSchema /> },
            { id: "security", label: "Security", icon: <IconSecurity /> },
            { id: "dependency", label: "Dependency", icon: <IconDependency /> },
            { id: "jenkins", label: "Jenkins", icon: <IconJenkins /> },
        ],
    },
    {
        id: "workflow",
        label: "Workflow",
        icon: <IconWorkflow />,
    },
    {
        id: "simulations",
        label: "Simulations",
        icon: <IconSim />,
    },
    {
        id: "automations",
        label: "Automations",
        icon: <IconAutomation />,
        children: [
            { id: "agents", label: "Agents", icon: <IconAgents /> },
            { id: "workers", label: "Workers", icon: <IconWorkers /> },
            { id: "schedules", label: "Schedules", icon: <IconSchedule /> },
        ],
    },
    {
        id: "tools",
        label: "Tools",
        icon: <IconTools />,
    },
    {
        id: "runs",
        label: "Runs",
        icon: <IconRuns />,
    },
    {
        id: "reports",
        label: "Reports",
        icon: <IconReports />,
    },
    {
        id: "settings",
        label: "Settings",
        icon: <IconSettings />,
    },
];

/* ---------- Sub-components ---------- */

function NavRow({
    id,
    label,
    icon,
    active,
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
                aria-current={active ? "page" : undefined}
                onClick={handleClick}
                style={{ paddingLeft: depth === 1 ? "2.25rem" : "0.75rem" }}
                className={`flex h-9 w-full items-center gap-2.5 rounded-lg pr-3 text-left text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${active
                    ? "bg-[#1a1a1a] font-semibold text-white"
                    : "font-medium text-[#a1a1a1] hover:bg-[#141414] hover:text-white"
                    }`}
            >
                <span className={active ? "text-white" : "text-[#666]"}>{icon}</span>
                <span className="flex-1 truncate">{label}</span>
                {hasChildren && (
                    <span className={active || open ? "text-[#888]" : "text-[#555]"}>
                        <ChevronRight open={!!open} />
                    </span>
                )}
            </button>
        </li>
    );
}

/* ---------- Component ---------- */

/** Single source of truth for sidebar width — consumed by the layout via `var(--sidebar-w)`. */
export const SIDEBAR_WIDTH = "240px";

export default function Sidebar() {
    const [active, setActive] = useState<string>("overview");
    const [expanded, setExpanded] = useState<Set<string>>(new Set(["model"]));
    const [query, setQuery] = useState<string>("");

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
        <aside
            style={{ "--sidebar-w": SIDEBAR_WIDTH } as React.CSSProperties}
            className="fixed flex h-full flex-col text-white antialiased border-r border-[#1e1e1e] bg-[#0a0a0a] w-[var(--sidebar-w)]"
        >
            {/* Search */}
            <div className="p-2 pb-2">
                <label className="flex h-9 items-center gap-2.5 rounded-lg border border-[#222] bg-[#0d0d0d] pl-3 pr-2 text-[#666] transition-colors focus-within:border-[#3a3a3a]">
                    <Search />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find"
                        aria-label="Find"
                        className="min-w-0 flex-1 bg-transparent text-[13px] text-white placeholder:text-[#555] focus:outline-none"
                    />
                    {!query && (
                        <kbd className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#333] bg-[#111] text-[11px] font-semibold text-[#888]">
                            F
                        </kbd>
                    )}
                </label>
            </div>

            {/* Nav */}
            <nav
                aria-label="Main"
                className="flex-1 overflow-y-auto px-2 pb-4 [scrollbar-color:#2a2a2a_transparent] [scrollbar-width:thin]"
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
                                    hasChildren={!!item.children?.length}
                                    open={isOpen}
                                    onSelect={setActive}
                                    onToggle={toggle}
                                />
                                {/* Children */}
                                {item.children && isOpen && (
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
        </aside>
    );
}