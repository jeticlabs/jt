"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Ban,
  Check,
  ChevronDown,
  Copy,
  ListFilter,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import type {
  Invitation,
  Member,
  OrganizationRole,
  Plan,
} from "@/features/workspace/types";
import { apiFetch, errorMessage } from "@/lib/api/browser";

const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

const ROLE_OPTIONS: OrganizationRole[] = ["owner", "admin", "member"];

const TWO_FACTOR_OPTIONS = [
  { value: "all", label: "2FA Status" },
  { value: "disabled", label: "Not enabled" },
];

type Tab = "members" | "pending";
type RoleFilter = "all" | OrganizationRole;

interface InviteRow {
  key: number;
  email: string;
  role: OrganizationRole;
}

function roleOptions(actor: OrganizationRole): OrganizationRole[] {
  return actor === "owner" ? ROLE_OPTIONS : ["admin", "member"];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.charAt(0) ?? "?") + (parts[1]?.charAt(0) ?? "");
}

function avatarStyle(url: string): { backgroundImage: string } {
  return { backgroundImage: `url(${JSON.stringify(url)})` };
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back to a selection-based copy for browsers that deny the
      // async clipboard API (for example when the page is not focused).
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!copied) throw new Error("Unable to copy to the clipboard.");
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[3px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
        checked
          ? "border-white bg-white text-black"
          : "border-white/20 bg-transparent text-transparent hover:border-white/40"
      }`}
    >
      <Check size={10} strokeWidth={3} />
    </button>
  );
}

function Menu({
  label,
  children,
}: {
  label: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="jetic-menu absolute right-0 top-[calc(100%+4px)] z-30 w-52"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  children,
  onClick,
  danger,
  icon,
}: {
  children: ReactNode;
  onClick: () => void;
  danger?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`jetic-menu-item ${danger ? "!text-red-400" : ""}`}
    >
      {icon}
      <span className="flex-1 text-left">{children}</span>
    </button>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  icon,
  label,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  icon?: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--jetic-muted)]">
          {icon}
        </span>
      )}
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        className={`h-9 w-full appearance-none rounded-md border border-white/10 bg-[var(--jetic-recess)] pr-8 text-[12.5px] text-white outline-none transition-colors hover:border-white/20 focus:border-white/30 ${
          icon ? "pl-8" : "pl-3"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--jetic-muted)]"
      />
    </div>
  );
}

interface MembersClientProps {
  organizationId: string;
  workspaceSlug: string;
  plan: Plan;
  currentUserId: string;
  role: OrganizationRole;
  members: Member[];
  invitations: Invitation[];
}

export function MembersClient({
  organizationId,
  workspaceSlug,
  plan,
  currentUserId,
  role,
  members,
  invitations,
}: MembersClientProps) {
  const router = useRouter();
  const base = `/v1/organizations/${encodeURIComponent(organizationId)}`;
  const canManage = role === "owner" || role === "admin";
  const availableRoles = roleOptions(role);

  const [tab, setTab] = useState<Tab>("members");
  const [rows, setRows] = useState<InviteRow[]>([
    { key: 1, email: "", role: "member" },
  ]);
  const nextRowKey = useRef(2);

  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [twoFactorFilter, setTwoFactorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("newest");
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<Member | null>(null);
  const [removing, setRemoving] = useState(false);
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable === true;
      if (event.key === "/" && !typing) {
        event.preventDefault();
        filterInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!confirmRemove) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !removing) setConfirmRemove(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [confirmRemove, removing]);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredMembers = members
    .filter((member) => roleFilter === "all" || member.role === roleFilter)
    .filter(
      (member) =>
        normalizedQuery.length === 0 ||
        `${member.user.name} ${member.user.email}`.toLowerCase().includes(normalizedQuery),
    )
    .sort((left, right) =>
      dateFilter === "oldest"
        ? new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        : new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

  const filteredInvitations = invitations
    .filter((invitation) => roleFilter === "all" || invitation.role === roleFilter)
    .filter(
      (invitation) =>
        normalizedQuery.length === 0 ||
        invitation.email.toLowerCase().includes(normalizedQuery),
    )
    .sort((left, right) =>
      dateFilter === "oldest"
        ? new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        : new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

  const allSelected =
    filteredMembers.length > 0 && filteredMembers.every((member) => selected.has(member.id));

  const hasEmails = rows.some((row) => row.email.trim().length > 0);

  const addRow = () => {
    setRows((current) => [
      ...current,
      { key: nextRowKey.current++, email: "", role: "member" },
    ]);
  };

  const removeRow = (key: number) => {
    setRows((current) =>
      current.length > 1 ? current.filter((row) => row.key !== key) : current,
    );
  };

  const updateRow = (key: number, patch: Partial<InviteRow>) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const toggleAll = () => {
    setSelected((current) => {
      const next = new Set(current);
      if (filteredMembers.every((member) => next.has(member.id))) {
        filteredMembers.forEach((member) => next.delete(member.id));
      } else {
        filteredMembers.forEach((member) => next.add(member.id));
      }
      return next;
    });
  };

  const toggleMember = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canEditMember = (member: Member): boolean =>
    canManage &&
    member.userId !== currentUserId &&
    !(member.role === "owner" && role !== "owner");

  const sendInvites = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage || inviting) return;

    const pending = rows
      .map((row) => ({ ...row, email: row.email.trim() }))
      .filter((row) => row.email.length > 0);
    if (pending.length === 0) return;

    setInviting(true);
    setError(null);
    setNotice(null);
    try {
      for (const row of pending) {
        await apiFetch(`${base}/invitations`, {
          method: "POST",
          body: { email: row.email, role: row.role },
        });
      }
      setRows([{ key: nextRowKey.current++, email: "", role: "member" }]);
      setNotice(
        pending.length === 1
          ? `Invitation sent to ${pending[0]?.email ?? "the recipient"}.`
          : `${pending.length} invitations sent.`,
      );
      setTab("pending");
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setInviting(false);
    }
  };

  const updateRole = async (member: Member, nextRole: OrganizationRole) => {
    if (!canManage || nextRole === member.role || busyId) return;
    setBusyId(member.id);
    setError(null);
    setNotice(null);
    try {
      await apiFetch(`${base}/members/${encodeURIComponent(member.id)}`, {
        method: "PATCH",
        body: { role: nextRole },
      });
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusyId(null);
    }
  };

  const removeMember = async () => {
    if (!confirmRemove || removing) return;
    setRemoving(true);
    setError(null);
    setNotice(null);
    try {
      await apiFetch(`${base}/members/${encodeURIComponent(confirmRemove.id)}`, {
        method: "DELETE",
      });
      setConfirmRemove(null);
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setRemoving(false);
    }
  };

  const cancelInvitation = async (invitation: Invitation) => {
    setBusyId(invitation.id);
    setError(null);
    setNotice(null);
    try {
      await apiFetch(`${base}/invitations/${encodeURIComponent(invitation.id)}`, {
        method: "DELETE",
      });
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusyId(null);
    }
  };

  const copyInviteLink = async (invitation: Invitation) => {
    if (!invitation.inviteUrl) return;
    try {
      await copyText(invitation.inviteUrl);
      setCopiedInviteId(invitation.id);
      window.setTimeout(() => {
        setCopiedInviteId((current) => (current === invitation.id ? null : current));
      }, 2_000);
    } catch (cause) {
      setError(errorMessage(cause));
    }
  };

  const copyEmail = async (email: string) => {
    try {
      await copyText(email);
      setNotice("Email copied.");
    } catch (cause) {
      setError(errorMessage(cause));
    }
  };

  const gridCols =
    rows.length > 1
      ? "grid-cols-[minmax(0,1fr)_140px_32px]"
      : "grid-cols-2";

  return (
    <div className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1180px]">
        <header>
          <h1 className="text-[24px] font-semibold tracking-tight text-white">Members</h1>
          <p className="jetic-muted mt-1 text-[13px]">Manage team members and invitations</p>
        </header>

        <section className="jetic-card mt-5 rounded-lg bg-[var(--jetic-bg)]">
          {canManage ? (
            <form onSubmit={sendInvites}>
              <div className="p-5">
                <h2 className="text-[18px] font-semibold tracking-tight text-white">
                  Invite Members
                </h2>
                <p className="jetic-muted mt-1 text-[12px] leading-5">
                  Add new members to your team by entering their email address and assigning a
                  role
                </p>

                <div className="mt-5">
                  <div className={`grid gap-3 ${gridCols}`}>
                    <label className="jetic-muted text-[11px]">Email Address</label>
                    <label className="jetic-muted text-[11px]">Role</label>
                    {rows.length > 1 && <span aria-hidden="true" />}
                  </div>

                  <div className="mt-1.5 flex flex-col gap-2">
                    {rows.map((row, index) => (
                      <div key={row.key} className={`grid gap-3 ${gridCols}`}>
                        <input
                          type="email"
                          value={row.email}
                          onChange={(event) =>
                            updateRow(row.key, { email: event.target.value })
                          }
                          placeholder="jane@example.com"
                          aria-label={
                            index === 0 ? "Email Address" : `Email address ${index + 1}`
                          }
                          disabled={inviting}
                          className="h-9 w-full rounded-md border border-white/10 bg-[var(--jetic-recess)] px-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                        />
                        <div className="relative">
                          <select
                            value={row.role}
                            onChange={(event) =>
                              updateRow(row.key, {
                                role: event.target.value as OrganizationRole,
                              })
                            }
                            aria-label={
                              index === 0 ? "Role" : `Role for invite ${index + 1}`
                            }
                            disabled={inviting}
                            className="h-9 w-full appearance-none rounded-md border border-white/10 bg-[var(--jetic-recess)] pl-3 pr-8 text-[12.5px] text-white outline-none transition-colors hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {availableRoles.map((option) => (
                              <option key={option} value={option}>
                                {ROLE_LABELS[option]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={13}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--jetic-muted)]"
                          />
                        </div>
                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRow(row.key)}
                            disabled={inviting}
                            aria-label={`Remove invite row ${index + 1}`}
                            className="flex h-9 w-8 items-center justify-center self-end rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addRow}
                    disabled={inviting}
                    className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="flex h-4 w-4 items-center justify-center rounded-full border border-white/25">
                      <Plus size={10} />
                    </span>
                    Add more
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-5 py-3">
                {plan === "hobby" ? (
                  <p className="jetic-muted min-w-0 flex-1 text-[12px]">
                    Upgrade to the{" "}
                    <Link
                      href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/settings`}
                      className="inline-flex items-center gap-0.5 align-baseline text-[var(--jetic-link)] hover:underline"
                    >
                      Pro plan
                      <ArrowUpRight size={11} />
                    </Link>{" "}
                    to invite Team Members.
                  </p>
                ) : (
                  <p className="jetic-muted min-w-0 flex-1 text-[12px]">
                    Invite teammates to collaborate in this workspace.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!hasEmails || inviting}
                  className="jetic-btn-light h-8 w-auto shrink-0 rounded-md px-4 text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {inviting ? "Inviting…" : "Invite"}
                </button>
              </div>
            </form>
          ) : (
            <div className="p-5">
              <h2 className="text-[18px] font-semibold tracking-tight text-white">
                Invite Members
              </h2>
              <p className="jetic-muted mt-1 text-[12px]">
                Only admins and owners can invite or manage members.
              </p>
            </div>
          )}
        </section>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-3 text-[12.5px] ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
          >
            {error ?? notice}
          </p>
        )}

        <div className="mt-6 flex items-center gap-6 border-b border-white/10">
          {(
            [
              { id: "members", label: "Team Members" },
              { id: "pending", label: "Pending Invitations" },
            ] as const
          ).map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`relative flex h-9 items-center text-[13px] font-medium transition-colors ${
                  active ? "text-white" : "jetic-muted hover:text-white"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-0.5 rounded-full ${
                    active ? "bg-white" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[150px] flex-1">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--jetic-muted)]"
            />
            <input
              ref={filterInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter"
              aria-label="Filter members and invitations"
              className="h-9 w-full rounded-md border border-white/10 bg-[var(--jetic-recess)] pl-8 pr-9 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-[var(--jetic-faint)]">
              /
            </kbd>
          </div>

          <FilterSelect
            value={roleFilter}
            onChange={(value) => setRoleFilter(value as RoleFilter)}
            options={[
              { value: "all", label: "All Team Roles" },
              { value: "owner", label: "Owner" },
              { value: "admin", label: "Admin" },
              { value: "member", label: "Member" },
            ]}
            label="Filter by team role"
            className="w-[125px] xl:w-[150px]"
          />
          <FilterSelect
            value={twoFactorFilter}
            onChange={setTwoFactorFilter}
            options={TWO_FACTOR_OPTIONS}
            label="Filter by 2FA status"
            className="w-[110px] xl:w-[130px]"
          />
          <FilterSelect
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: "newest", label: "Date" },
              { value: "oldest", label: "Oldest first" },
            ]}
            icon={<ListFilter size={13} />}
            label="Sort by date"
            className="w-[110px] xl:w-[124px]"
          />
        </div>

        {tab === "members" ? (
          <section className="jetic-card mt-3 overflow-visible rounded-lg bg-[var(--jetic-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  checked={allSelected}
                  onChange={toggleAll}
                  label="Select all members"
                />
                <button
                  type="button"
                  onClick={toggleAll}
                  className="jetic-muted text-[12px] transition-colors hover:text-white"
                >
                  Select all ({filteredMembers.length})
                </button>
              </div>
              <Menu label="Member list actions">
                {(close) => (
                  <>
                    <MenuItem
                      icon={<Check size={14} />}
                      onClick={() => {
                        setSelected(new Set(filteredMembers.map((member) => member.id)));
                        close();
                      }}
                    >
                      Select all
                    </MenuItem>
                    <MenuItem
                      icon={<X size={14} />}
                      onClick={() => {
                        setSelected(new Set());
                        close();
                      }}
                    >
                      Clear selection
                    </MenuItem>
                  </>
                )}
              </Menu>
            </div>

            {filteredMembers.length === 0 ? (
              <p className="jetic-muted px-4 py-10 text-center text-[12.5px]">
                No members match your filters.
              </p>
            ) : (
              filteredMembers.map((member) => {
                const editable = canEditMember(member);
                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 hover:bg-white/[0.015]"
                  >
                    <Checkbox
                      checked={selected.has(member.id)}
                      onChange={() => toggleMember(member.id)}
                      label={`Select ${member.user.name}`}
                    />
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--jetic-recess)] bg-cover bg-center text-[11px] font-semibold uppercase text-white"
                      style={member.user.image ? avatarStyle(member.user.image) : undefined}
                    >
                      {member.user.image ? "" : initials(member.user.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-white">
                        {member.user.name}
                      </p>
                      <p className="jetic-muted truncate text-[12px]">{member.user.email}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] font-medium text-[var(--jetic-emphasis)]">
                        {ROLE_LABELS[member.role]}
                      </span>
                      <span
                        title="Two-factor authentication is not enabled"
                        className="jetic-muted inline-flex items-center gap-1 text-[11.5px]"
                      >
                        <Ban size={13} strokeWidth={1.6} />
                        2FA
                      </span>
                      <Menu label={`Actions for ${member.user.name}`}>
                        {(close) => (
                          <>
                            {editable &&
                              availableRoles
                                .filter((option) => option !== member.role)
                                .map((option) => (
                                  <MenuItem
                                    key={option}
                                    onClick={() => {
                                      void updateRole(member, option);
                                      close();
                                    }}
                                  >
                                    Make {ROLE_LABELS[option].toLowerCase()}
                                  </MenuItem>
                                ))}
                            {editable && <div className="my-1 h-px bg-white/10" />}
                            <MenuItem
                              icon={<Copy size={14} />}
                              onClick={() => {
                                void copyEmail(member.user.email);
                                close();
                              }}
                            >
                              Copy email
                            </MenuItem>
                            {editable && (
                              <MenuItem
                                danger
                                icon={<Trash2 size={14} />}
                                onClick={() => {
                                  setConfirmRemove(member);
                                  close();
                                }}
                              >
                                Remove member
                              </MenuItem>
                            )}
                          </>
                        )}
                      </Menu>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        ) : (
          <section className="jetic-card mt-3 overflow-visible rounded-lg bg-[var(--jetic-bg)]">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
              <span className="jetic-muted text-[12px]">
                Pending invitations ({filteredInvitations.length})
              </span>
              <Menu label="Pending invitation actions">
                {(close) => (
                  <MenuItem
                    icon={<ListFilter size={14} />}
                    onClick={() => {
                      setQuery("");
                      setRoleFilter("all");
                      close();
                    }}
                  >
                    Clear filters
                  </MenuItem>
                )}
              </Menu>
            </div>

            {filteredInvitations.length === 0 ? (
              <p className="jetic-muted px-4 py-10 text-center text-[12.5px]">
                No pending invitations match your filters.
              </p>
            ) : (
              filteredInvitations.map((invitation) => {
                return (
                  <div
                    key={invitation.id}
                    className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5 last:border-b-0 hover:bg-white/[0.015]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 text-[10px] font-semibold uppercase text-[var(--jetic-muted)]"
                    >
                      {initials(invitation.email)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-white">
                        {invitation.email}
                      </p>
                      <p className="jetic-muted text-[11.5px]">
                        Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                      </p>
                      {invitation.inviteUrl && (
                        <button
                          type="button"
                          onClick={() => void copyInviteLink(invitation)}
                          title={invitation.inviteUrl}
                          className="mt-1 flex max-w-full items-center gap-1.5 text-left text-[11px] text-[var(--jetic-muted)] transition-colors hover:text-white"
                        >
                          <Copy size={11} className="shrink-0" />
                          <span className="max-w-[420px] truncate font-mono">
                            {invitation.inviteUrl}
                          </span>
                          <span className="shrink-0 text-[10px] font-semibold text-[var(--jetic-link)]">
                            {copiedInviteId === invitation.id ? "Copied" : "Copy"}
                          </span>
                        </button>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[12px] font-medium text-[var(--jetic-emphasis)]">
                        {ROLE_LABELS[invitation.role]}
                      </span>
                      <span className="jetic-muted text-[11.5px]">Invited</span>
                      <Menu label={`Actions for invitation to ${invitation.email}`}>
                        {(close) => (
                          <>
                            {invitation.inviteUrl && (
                              <MenuItem
                                icon={<Copy size={14} />}
                                onClick={() => {
                                  void copyInviteLink(invitation);
                                  close();
                                }}
                              >
                                Copy link
                              </MenuItem>
                            )}
                            {canManage && (
                              <MenuItem
                                danger
                                icon={<X size={14} />}
                                onClick={() => {
                                  void cancelInvitation(invitation);
                                  close();
                                }}
                              >
                                Cancel invite
                              </MenuItem>
                            )}
                          </>
                        )}
                      </Menu>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}
      </div>

      {confirmRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !removing) setConfirmRemove(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-member-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111111] text-white shadow-2xl"
          >
            <div className="border-b border-white/10 p-5">
              <h2 id="remove-member-title" className="text-lg font-semibold">
                Remove {confirmRemove.user.name}?
              </h2>
              <p className="jetic-muted mt-2 text-[13px] leading-5">
                They will lose access to this workspace. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-white/10 p-4">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                disabled={removing}
                className="jetic-btn h-9 w-auto px-3.5 text-[13px] disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void removeMember()}
                disabled={removing}
                className="inline-flex h-9 items-center rounded-lg bg-red-500/90 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {removing ? "Removing…" : "Remove member"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
