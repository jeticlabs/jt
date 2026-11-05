"use client"
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Check, ChevronsUpDown, Plus, PlusIcon, X } from "lucide-react";
import { inter } from "@/app/fonts";

type Tab = "Manual" | "Agentic Mode";
type SettingsSection =
    | "Profile"
    | "Devices & sessions"
    | "Notifications"
    | "Support"
    | "Data & privacy";

const TABS: { id: Tab; locked?: boolean }[] = [
    { id: "Manual" },
    { id: "Agentic Mode" }
];

const MENUS = ["Overview", "Integrations", "Members", "Billing & Usage", "Settings"] as const;
const SETTINGS_SECTIONS: SettingsSection[] = [
    "Profile",
    "Devices & sessions",
    "Notifications",
    "Support",
    "Data & privacy",
];

/* ---------- Icons (inline, 24x24 stroke icons) ---------- */

const Icon = ({ children, size = 16 }: { children: ReactNode; size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const PanelLeft = () => (
    <Icon>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" />
    </Icon>
);
const PanelRight = () => (
    <Icon>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M15 3v18" />
    </Icon>
);
const SplitView = () => (
    <Icon>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M12 3v18" />
    </Icon>
);
const Undo = () => (
    <Icon>
        <path d="M9 14L4 9l5-5" />
        <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
    </Icon>
);
const Redo = () => (
    <Icon>
        <path d="M15 14l5-5-5-5" />
        <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" />
    </Icon>
);
const History = () => (
    <Icon>
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
        <path d="M12 7v5l4 2" />
    </Icon>
);
const Refresh = () => (
    <Icon>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
    </Icon>
);
const Search = () => (
    <Icon>
        <circle cx="11" cy="11" r="7.5" />
        <path d="m21 21-4.3-4.3" />
    </Icon>
);
const Download = () => (
    <Icon>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <path d="m7 10 5 5 5-5" />
        <path d="M12 15V3" />
    </Icon>
);
const Share = () => (
    <Icon>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98" />
        <path d="m15.41 6.51-6.82 3.98" />
    </Icon>
);
const Lock = () => (
    <Icon size={12}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Icon>
);
const ChevronDown = () => (
    <Icon size={14}>
        <path d="m6 9 6 6 6-6" />
    </Icon>
);

/* ---------- Small building blocks ---------- */

interface IconButtonProps {
    label: string;
    children: ReactNode;
    bordered?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

const IconButton = ({ label, children, bordered, disabled, onClick }: IconButtonProps) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
        className={`flex h-7 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${bordered ? "border border-white/10" : ""
            } ${disabled
                ? "cursor-not-allowed text-[var(--jetic-faint)]"
                : "text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
            }`}
    >
        {children}
    </button>
);

/* ---------- View tabs + product menus (rendered in row 1 or the overflow strip) ---------- */

function ViewTabs({
    tab,
    onTabChange,
    className = "",
}: {
    tab: Tab;
    onTabChange: (t: Tab) => void;
    className?: string;
}) {
    return (
        <div
            role="tablist"
            aria-label="Editor view"
            className={`shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-[var(--jetic-recess)] p-[3px] ${className}`}
        >
            {TABS.map(({ id, locked }) => {
                const active = tab === id;
                return (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        disabled={locked}
                        onClick={() => onTabChange(id)}
                        className={`flex h-[26px] items-center gap-1.5 rounded-full px-3.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${active
                            ? "bg-white font-medium text-black"
                            : locked
                                ? "cursor-not-allowed text-[var(--jetic-faint)]"
                                : "text-[var(--jetic-muted)] hover:text-white"
                            }`}
                    >
                        {id}
                        {locked && (
                            <span className="flex items-center gap-1 text-[var(--jetic-faint)]">
                                <Lock />
                                Paid
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

function ProductMenus({ className = "" }: { className?: string }) {
    return (
        <div className={className}>
            {MENUS.map((m) => (
                <button
                    key={m}
                    type="button"
                    className="whitespace-nowrap rounded-xl px-2 py-1 text-[var(--jetic-emphasis)] transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                    {m}
                </button>
            ))}
        </div>
    );
}

function SettingsDialog({
    open,
    section,
    userName,
    onSectionChange,
    onClose,
}: {
    open: boolean;
    section: SettingsSection;
    userName: string;
    onSectionChange: (section: SettingsSection) => void;
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const descriptions: Record<SettingsSection, string> = {
        Profile: "Manage your personal details and account information.",
        "Devices & sessions": "Review the devices and active sessions connected to your account.",
        Notifications: "Choose how you receive account and product updates.",
        Support: "Find help and contact the Jetic support team.",
        "Data & privacy": "Manage your data, privacy, and account preferences.",
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="account-settings-title"
                className="flex h-[min(620px,calc(100vh-2rem))] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl"
            >
                <aside className="w-56 shrink-0 border-r border-white/10 bg-[#0c0c0c] p-4 max-sm:w-40 max-sm:p-2">
                    <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-[var(--jetic-muted)]">
                        Account settings
                    </p>
                    <nav aria-label="Settings sections" className="mt-2 space-y-1">
                        {SETTINGS_SECTIONS.map((item) => (
                            <button
                                key={item}
                                type="button"
                                aria-current={section === item ? "page" : undefined}
                                onClick={() => onSectionChange(item)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                    section === item
                                        ? "bg-white/10 font-medium text-white"
                                        : "text-[var(--jetic-muted)] hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>
                </aside>
                <div className="min-w-0 flex-1 overflow-y-auto p-6 max-sm:p-4">
                    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                        <div>
                            <h2 id="account-settings-title" className="text-xl font-semibold">
                                {section}
                            </h2>
                            <p className="mt-1 text-sm text-[var(--jetic-muted)]">
                                {descriptions[section]}
                            </p>
                        </div>
                        <button
                            type="button"
                            aria-label="Close settings"
                            onClick={onClose}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] hover:bg-white/10 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    {section === "Profile" && (
                        <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                            <p className="text-sm font-medium">Name</p>
                            <p className="mt-1 text-sm text-[var(--jetic-muted)]">{userName}</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

/* ---------- Switcher (searchable popover: list + create) ---------- */

interface SwitcherProps {
    label: string;
    value: string;
    items: string[];
    onSelect: (v: string) => void;
    onCreate: () => void;
    createLabel: string;
    searchPlaceholder: string;
}

function Switcher({ label, value, items, onSelect, onCreate, createLabel, searchPlaceholder }: SwitcherProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const q = query.trim().toLowerCase();
    const filtered = q ? items.filter((i) => i.toLowerCase().includes(q)) : items;

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={label}
                onClick={() => {
                    setQuery("");
                    setOpen((o) => !o);
                }}
                className="flex items-center gap-1 rounded-lg px-1 py-0.5 font-semibold text-white transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
                <span className="max-w-[80px] truncate sm:max-w-[140px]">{value}</span>
                <ChevronsUpDown size={14} className="shrink-0 text-[var(--jetic-muted)]" />
            </button>

            {open && (
                <div className="jetic-menu absolute left-0 top-[calc(100%+6px)] z-30 w-64 max-w-[calc(100vw-2rem)] p-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        autoFocus
                        aria-label={searchPlaceholder}
                        className="h-9 w-full rounded-xl bg-[var(--jetic-well)] px-3 text-[13px] text-white placeholder:text-[var(--jetic-muted)] focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                    <ul role="listbox" aria-label={label} className="mt-1 max-h-56 overflow-y-auto">
                        {filtered.map((item) => (
                            <li key={item} role="option" aria-selected={item === value}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(item);
                                        setOpen(false);
                                    }}
                                    className="jetic-menu-item"
                                >
                                    <span className="flex-1 truncate">{item}</span>
                                    {item === value && <Check size={14} className="shrink-0" />}
                                </button>
                            </li>
                        ))}
                        {filtered.length === 0 && (
                            <li className="jetic-muted px-2.5 py-2 text-[13px]">
                                No matches for &ldquo;{query.trim()}&rdquo;
                            </li>
                        )}
                    </ul>
                    <div className="mt-1 border-t border-white/10 pt-1">
                        <button
                            type="button"
                            onClick={() => {
                                onCreate();
                                setOpen(false);
                            }}
                            className="jetic-menu-item font-medium text-[var(--jetic-emphasis)]"
                        >
                            <Plus size={14} className="shrink-0" />
                            {createLabel}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ---------- Component ---------- */

interface EditorTopBarProps {
    workspace?: string;
    project?: string;
    userName?: string;
    isSandboxRoute?: boolean;
    isAgenticMode?: boolean;
    workspaces?: string[];
    sandboxes?: string[];
    onSelectWorkspace?: (v: string) => void;
    onSelectSandbox?: (v: string) => void;
    onCreateWorkspace?: () => void;
    onCreateSandbox?: () => void;
    onModeChange?: (tab: Tab) => void;
    /** When true the product sidebar is collapsed; the toggle shows "expand". */
    sidebarCollapsed?: boolean;
    onToggleSidebar?: () => void;
}

export default function Toolbar({
    workspace: initialWorkspace = "prutotechnologies",
    project: initialProject = "test-sandbox",
    userName = "Oyewale Prudence",
    isSandboxRoute = false,
    isAgenticMode = false,
    workspaces = ["prutotechnologies", "acme", "sandbox-lab"],
    sandboxes = ["test-sandbox", "api-playground", "prod-mirror"],
    onSelectWorkspace,
    onSelectSandbox,
    onCreateWorkspace,
    onCreateSandbox,
    onModeChange,
    sidebarCollapsed = false,
    onToggleSidebar,
}: EditorTopBarProps) {
    const tab: Tab = isAgenticMode ? "Agentic Mode" : "Manual";
    const [currentWorkspace, setCurrentWorkspace] = useState(initialWorkspace);
    const [currentProject, setCurrentProject] = useState(initialProject);
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsSection, setSettingsSection] = useState<SettingsSection>("Profile");
    const accountMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!accountMenuOpen) return;
        const onDown = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setAccountMenuOpen(false);
            }
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setAccountMenuOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [accountMenuOpen]);

    const pickWorkspace = (v: string) => {
        setCurrentWorkspace(v);
        onSelectWorkspace?.(v);
    };
    const pickSandbox = (v: string) => {
        setCurrentProject(v);
        onSelectSandbox?.(v);
    };
    const createWorkspace = () => {
        if (onCreateWorkspace) onCreateWorkspace();
        else console.log("TODO: hook up workspace creation");
    };
    const createSandbox = () => {
        if (onCreateSandbox) onCreateSandbox();
        else console.log("TODO: hook up sandbox creation");
    };

    return (
        <div className={`${inter.className} text-white antialiased`}>
            <header className="border-b border-white/10 bg-[#0a0a0a] text-[13px]">
                {/* Row 1 — always visible */}
                <div className="flex items-center gap-2 px-2 py-1.5 sm:gap-4 sm:px-3">
                    <IconButton
                        label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                        onClick={onToggleSidebar}
                    >
                        {sidebarCollapsed ? <PanelRight /> : <PanelLeft />}
                    </IconButton>

                    <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap xl:flex-none">
                        <span className="hidden font-semibold text-[var(--jetic-muted)] sm:inline">jetic</span>
                        <span className="hidden text-[var(--jetic-ring)] sm:inline">/</span>
                        <Switcher
                            label="Switch workspace"
                            value={currentWorkspace}
                            items={workspaces}
                            onSelect={pickWorkspace}
                            onCreate={createWorkspace}
                            createLabel="Create new workspace"
                            searchPlaceholder="Search workspaces…"
                        />
                        {isSandboxRoute && (
                            <>
                                <span className="text-[var(--jetic-ring)]">/</span>
                                <Switcher
                                    label="Switch sandbox"
                                    value={currentProject}
                                    items={sandboxes}
                                    onSelect={pickSandbox}
                                    onCreate={createSandbox}
                                    createLabel="Create new sandbox"
                                    searchPlaceholder="Search sandboxes…"
                                />
                            </>
                        )}
                    </nav>

                    {/* Center tabs — roomy screens */}
                    {isSandboxRoute && (
                        <div className="flex-1 visible justify-center lg:flex">
                            <ViewTabs tab={tab} onTabChange={(value) => onModeChange?.(value)} className="hidden flex w-fit justify-center lg:flex" />
                        </div>
                    )}
                    {/* Inline menus — wide screens */}
                   

                    <div className={`flex shrink-0 items-center gap-2 ${!isSandboxRoute ? "ml-auto" : ""}`}>
                        {!isSandboxRoute && (
                            <button
                                type="button"
                                onClick={createSandbox}
                                className="flex h-8 items-center gap-1.5 rounded-lg bg-white px-3 text-[13px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            >
                                <PlusIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">New Sandbox</span>
                            </button>
                        )}

                        <div ref={accountMenuRef} className="relative">
                            <button
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={accountMenuOpen}
                                onClick={() => setAccountMenuOpen((open) => !open)}
                                className="flex h-7 items-center gap-2 rounded-full border border-white/10 pl-1 pr-2 transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-black">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                                <span className="hidden max-w-[120px] truncate text-[var(--jetic-emphasis)] sm:inline">{userName}</span>
                                <span className="text-[var(--jetic-muted)]">
                                    <ChevronDown />
                                </span>
                            </button>
                            {accountMenuOpen && (
                                <div
                                    role="menu"
                                    className="jetic-menu absolute right-0 top-[calc(100%+8px)] z-40 w-48 p-1"
                                >
                                    {(["Profile", "Settings"] as const).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            role="menuitem"
                                            onClick={() => {
                                                if (item === "Profile") setSettingsSection("Profile");
                                                setSettingsOpen(true);
                                                setAccountMenuOpen(false);
                                            }}
                                            className="jetic-menu-item"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2 — scrollable overflow strip for smaller screens */}
                <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:hidden">
                    {isSandboxRoute && (
                        <ViewTabs tab={tab} onTabChange={(value) => onModeChange?.(value)} className="flex lg:hidden" />
                    )}
                    <ProductMenus className="flex shrink-0 items-center gap-1" />
                </div>
            </header>
            <SettingsDialog
                open={settingsOpen}
                section={settingsSection}
                userName={userName}
                onSectionChange={setSettingsSection}
                onClose={() => setSettingsOpen(false)}
            />
        </div>
    );
}