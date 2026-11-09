"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Plus, PlusIcon } from "lucide-react";

import { inter } from "@/app/fonts";
import { useSandboxList } from "@/cache";
import type { OrganizationRole, Plan } from "@/features/workspace/types";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch, errorMessage } from "@/lib/api/browser";
import { AccountDialog } from "./account-dialog";
import { CreateSandboxDialog } from "./create-sandbox-dialog";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

type Tab = "Manual" | "Agentic Mode";

const TABS: { id: Tab; locked?: boolean }[] = [{ id: "Manual" }, { id: "Agentic Mode" }];

const MENUS: { label: string; segment: string }[] = [
    { label: "Overview", segment: "" },
    { label: "Integrations", segment: "integrations" },
    { label: "Members", segment: "members" },
    { label: "Billing & Usage", segment: "billing" },
    { label: "Settings", segment: "settings" },
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
    disabled?: boolean;
    onClick?: () => void;
}

const IconButton = ({ label, children, disabled, onClick }: IconButtonProps) => (
    <button
        type="button"
        aria-label={label}
        title={label}
        disabled={disabled}
        onClick={onClick}
        className={`flex h-7 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${disabled
            ? "cursor-not-allowed text-[var(--jetic-faint)]"
            : "text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
            }`}
    >
        {children}
    </button>
);

/** Small badge that shows which plan the active workspace is on. */
function PlanChip({ plan }: { plan: Plan }) {
    const isPro = plan === "pro";
    return (
        <span
            title={`${isPro ? "Pro" : "Hobby"} plan`}
            className={`inline-flex h-5 shrink-0 items-center rounded-full border px-2 text-[10px] font-semibold uppercase tracking-[0.08em] ${isPro
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-[var(--jetic-recess)] text-[var(--jetic-muted)]"
                }`}
        >
            {isPro ? "Pro" : "Hobby"}
        </span>
    );
}

/* ---------- View tabs + workspace menus ---------- */

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

function ProductMenus({
    workspaceSlug,
    className = "",
}: {
    workspaceSlug: string;
    className?: string;
}) {
    const pathname = usePathname() ?? "";
    const base = `/app/workspace/${encodeURIComponent(workspaceSlug)}`;

    return (
        <div className={className}>
            {MENUS.map((item) => {
                const href = item.segment ? `${base}/${item.segment}` : base;
                const active = item.segment
                    ? pathname === href || pathname.startsWith(`${href}/`)
                    : pathname === base;
                return (
                    <Link
                        key={item.label}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`whitespace-nowrap rounded-xl px-2 py-1 transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${active
                            ? "font-medium text-white"
                            : "text-[var(--jetic-emphasis)]"
                            }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}

/* ---------- Switcher (searchable popover: list + create) ---------- */

interface SwitcherItem {
    id: string;
    label: string;
    plan?: Plan;
}

interface SwitcherProps {
    label: string;
    valueId: string;
    items: SwitcherItem[];
    onSelect: (id: string) => void;
    onCreate: () => void;
    createLabel: string;
    searchPlaceholder: string;
    currentHref?: string;
    disabled?: boolean;
}

function Switcher({
    label,
    valueId,
    items,
    onSelect,
    onCreate,
    createLabel,
    searchPlaceholder,
    currentHref,
    disabled = false,
}: SwitcherProps) {
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

    const current = items.find((item) => item.id === valueId);
    const q = query.trim().toLowerCase();
    const filtered = q
        ? items.filter((item) =>
            `${item.label} ${item.id}`.toLowerCase().includes(q),
        )
        : items;

    const toggle = () => {
        setQuery("");
        setOpen((value) => !value);
    };

    return (
        <div ref={ref} className="relative">
            <div
                className={`flex items-center gap-0.5 rounded-lg px-1 py-0.5 font-semibold text-white transition-colors hover:bg-[var(--jetic-well)] ${disabled ? "opacity-50" : ""
                    }`}
            >
                {currentHref ? (
                    <Link
                        href={currentHref}
                        onClick={() => setOpen(false)}
                        className="flex min-w-0 items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        aria-label={`Open ${current?.label ?? label}`}
                    >
                        <span className="max-w-[90px] truncate sm:max-w-[160px]">
                            {current?.label ?? "Select"}
                        </span>
                        {current?.plan && <PlanChip plan={current.plan} />}
                    </Link>
                ) : (
                    <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-label={label}
                        disabled={disabled}
                        onClick={toggle}
                        className="flex min-w-0 items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed"
                    >
                        <span className="max-w-[90px] truncate sm:max-w-[160px]">
                            {current?.label ?? "Select"}
                        </span>
                        {current?.plan && <PlanChip plan={current.plan} />}
                    </button>
                )}
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-label={`${label} menu`}
                    disabled={disabled}
                    onClick={toggle}
                    className="flex h-6 w-5 shrink-0 items-center justify-center rounded text-[var(--jetic-muted)] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed"
                >
                    <ChevronsUpDown size={14} />
                </button>
            </div>

            {open && (
                <div className="jetic-menu absolute left-0 top-[calc(100%+6px)] z-30 w-64 max-w-[calc(100vw-2rem)] p-2 rounded">
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
                            <li key={item.id} role="option" aria-selected={item.id === valueId}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSelect(item.id);
                                        setOpen(false);
                                    }}
                                    className="jetic-menu-item"
                                >
                                    <span className="flex-1 truncate">{item.label}</span>
                                    {item.plan && <PlanChip plan={item.plan} />}
                                    {item.id === valueId && <Check size={14} className="shrink-0" />}
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
                                setOpen(false);
                                onCreate();
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

export interface ToolbarUser {
    name: string;
    email: string;
    image: string | null;
}

export interface ToolbarWorkspace {
    id: string;
    name: string;
    slug: string;
    plan: Plan;
    role: OrganizationRole;
}

interface EditorTopBarProps {
    workspace: ToolbarWorkspace;
    workspaces: ToolbarWorkspace[];
    user: ToolbarUser;
    project?: string;
    sandboxes?: string[];
    isSandboxRoute?: boolean;
    isAgenticMode?: boolean;
    onSelectSandbox?: (v: string) => void;
    onModeChange?: (tab: Tab) => void;
    /** When true the product sidebar is collapsed; the toggle shows "expand". */
    sidebarCollapsed?: boolean;
    onToggleSidebar?: () => void;
}

export default function Toolbar({
    workspace,
    workspaces,
    user,
    project = "",
    sandboxes = [],
    isSandboxRoute = false,
    isAgenticMode = false,
    onSelectSandbox,
    onModeChange,
    sidebarCollapsed = false,
    onToggleSidebar,
}: EditorTopBarProps) {
    const router = useRouter();
    const tab: Tab = isAgenticMode ? "Agentic Mode" : "Manual";
    const [accountMenuOpen, setAccountMenuOpen] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
    const [createSandboxOpen, setCreateSandboxOpen] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
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

    const workspaceItems = workspaces.map((item) => ({
        id: item.id,
        label: item.name,
        plan: item.plan,
    }));
    const { sandboxes: cachedSandboxes } = useSandboxList(workspace.slug);
    const sandboxOptions = cachedSandboxes.map((sandbox) => ({
        id: sandbox.slug,
        label: sandbox.name,
    }));
    if (project && !sandboxOptions.some((item) => item.id === project)) {
        sandboxOptions.unshift({ id: project, label: project });
    }
    const sandboxItems =
        sandboxOptions.length > 0
            ? sandboxOptions
            : (sandboxes.length > 0 ? sandboxes : project ? [project] : []).map(
                (item) => ({ id: item, label: item }),
            );

    const selectWorkspace = async (id: string) => {
        if (switching) return;
        if (id === workspace.id) {
            router.push(`/app/workspace/${encodeURIComponent(workspace.slug)}`);
            return;
        }
        const target = workspaces.find((item) => item.id === id);
        if (!target) return;

        setSwitching(true);
        setActionError(null);
        try {
            await apiFetch("/v1/auth/session/active-organization", {
                method: "POST",
                body: { organizationId: id },
            });
            router.push(`/app/workspace/${encodeURIComponent(target.slug)}`);
            router.refresh();
        } catch (error) {
            setActionError(errorMessage(error));
        } finally {
            setSwitching(false);
        }
    };

    const signOut = async () => {
        setAccountMenuOpen(false);
        setAccountOpen(false);
        try {
            await apiFetch("/v1/auth/sign-out", { method: "POST" });
        } catch {
            // The web-owned session cookie is cleared regardless.
        }
        await fetch("/api/auth/session", { method: "DELETE" });
        router.push("/sign-in");
        router.refresh();
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

                    <nav
                        aria-label="Breadcrumb"
                        className="flex min-w-0 flex-1 items-center gap-1.5 whitespace-nowrap xl:flex-none"
                    >
                        <span className="hidden font-semibold text-[var(--jetic-muted)] sm:inline">
                            jetic
                        </span>
                        <span className="hidden text-[var(--jetic-ring)] sm:inline">/</span>
                        <Switcher
                            label="Switch workspace"
                            valueId={workspace.id}
                            items={workspaceItems}
                            onSelect={(id) => void selectWorkspace(id)}
                            onCreate={() => setCreateWorkspaceOpen(true)}
                            createLabel="Create new workspace"
                            searchPlaceholder="Search workspaces…"
                            currentHref={`/app/workspace/${encodeURIComponent(workspace.slug)}`}
                            disabled={switching}
                        />
                        {isSandboxRoute && sandboxItems.length > 0 && (
                            <>
                                <span className="text-[var(--jetic-ring)]">/</span>
                                <Switcher
                                    label="Switch sandbox"
                                    valueId={project}
                                    items={sandboxItems}
                                    onSelect={(id) => onSelectSandbox?.(id)}
                                    onCreate={() => setCreateSandboxOpen(true)}
                                    createLabel="Create new sandbox"
                                    searchPlaceholder="Search sandboxes…"
                                    currentHref={
                                        project
                                            ? `/app/workspace/${encodeURIComponent(workspace.slug)}/sandbox/${encodeURIComponent(project)}`
                                            : undefined
                                    }
                                />
                            </>
                        )}
                        {switching && (
                            <span role="status" aria-label="Switching workspace">
                                <Skeleton className="h-3 w-14 rounded-full" />
                            </span>
                        )}
                    </nav>

                    {/* Center tabs — sandbox routes on roomy screens */}
                    {isSandboxRoute && (
                        <div className="flex-1 justify-center lg:flex">
                            <ViewTabs
                                tab={tab}
                                onTabChange={(value) => onModeChange?.(value)}
                                className="hidden lg:flex"
                            />
                        </div>
                    )}

                    {/* Workspace menus — wide screens */}
                    {!isSandboxRoute && (
                        <div

                            className="w-full visible items-center gap-1 xl:flex"
                        />
                    )}

                    <div
                        className={`flex shrink-0 items-center gap-2 ${isSandboxRoute ? "ml-auto" : ""}`}
                    >
                        {!isSandboxRoute && (
                            <button
                                type="button"
                                onClick={() => setCreateSandboxOpen(true)}
                                className="flex px-2 py-1 items-center gap-1.5 rounded-md bg-white px-3 text-[13px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
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
                                title={`${user.name} · ${user.email}`}
                                className="flex h-7 items-center gap-2 rounded-full border border-white/10 pl-1 pr-2 transition-colors hover:bg-[var(--jetic-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                            >
                                <span
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white bg-cover bg-center text-[11px] font-semibold text-black"
                                    style={
                                        user.image
                                            ? { backgroundImage: `url(${JSON.stringify(user.image)})` }
                                            : undefined
                                    }
                                >
                                    {user.image
                                        ? null
                                        : (user.name.charAt(0) || user.email.charAt(0)).toUpperCase()}
                                </span>
                                <span className="max-w-[92px] truncate text-[var(--jetic-emphasis)] sm:max-w-[180px]">
                                    {user.email}
                                </span>
                                <span className="text-[var(--jetic-muted)]">
                                    <ChevronDown />
                                </span>
                            </button>
                            {accountMenuOpen && (
                                <div
                                    role="menu"
                                    className="jetic-menu rounded absolute right-0 top-[calc(100%+8px)] z-40 w-60 p-1"
                                >
                                    <div className="flex items-center gap-2.5 border-b border-white/10 px-2.5 py-2">
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--jetic-recess)] bg-cover bg-center text-[11px] font-semibold text-white"
                                            style={
                                                user.image
                                                    ? { backgroundImage: `url(${JSON.stringify(user.image)})` }
                                                    : undefined
                                            }
                                        >
                                            {user.image
                                                ? null
                                                : (user.name.charAt(0) || user.email.charAt(0)).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[13px] font-medium text-white">
                                                {user.name}
                                            </p>
                                            <p className="jetic-muted truncate text-[12px]">{user.email}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => {
                                            setAccountOpen(true);
                                            setAccountMenuOpen(false);
                                        }}
                                        className="jetic-menu-item mt-1"
                                    >
                                        Account settings
                                    </button>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={() => void signOut()}
                                        className="jetic-menu-item"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {actionError && (
                    <div
                        role="alert"
                        className="border-t border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[12px] text-red-300"
                    >
                        {actionError}
                    </div>
                )}

                {/* Row 2 — scrollable overflow strip for smaller screens */}
                <div className="flex items-center gap-2 overflow-x-auto border-t border-white/10 px-2 py-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:hidden">
                    {isSandboxRoute && (
                        <ViewTabs
                            tab={tab}
                            onTabChange={(value) => onModeChange?.(value)}
                            className="flex lg:hidden"
                        />
                    )}
                    <ProductMenus
                        workspaceSlug={workspace.slug}
                        className="flex shrink-0 items-center gap-1"
                    />
                </div>
            </header>

            <AccountDialog
                open={accountOpen}
                user={user}
                onSignOut={() => void signOut()}
                onClose={() => setAccountOpen(false)}
            />

            {createWorkspaceOpen && (
                <CreateWorkspaceDialog onClose={() => setCreateWorkspaceOpen(false)} />
            )}

            {createSandboxOpen && (
                <CreateSandboxDialog
                    workspaceId={workspace.id}
                    workspaceSlug={workspace.slug}
                    workspaceName={workspace.name}
                    workspacePlan={workspace.plan}
                    onClose={() => setCreateSandboxOpen(false)}
                />
            )}
        </div>
    );
}
