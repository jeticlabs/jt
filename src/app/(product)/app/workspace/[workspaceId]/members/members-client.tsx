"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type {
  Invitation,
  Member,
  OrganizationRole,
} from "@/features/workspace/types";
import { apiFetch, errorMessage } from "@/lib/api/browser";

const primaryButton =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-white px-3 text-[12px] font-semibold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:cursor-not-allowed disabled:opacity-40";

const fieldLabel = "jetic-muted mb-2 block text-[12px]";

const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
};

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
  if (!copied) throw new Error("Unable to copy the invitation link.");
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function roleOptions(actor: OrganizationRole): OrganizationRole[] {
  return actor === "owner" ? ["owner", "admin", "member"] : ["admin", "member"];
}

interface MembersClientProps {
  organizationId: string;
  currentUserId: string;
  role: OrganizationRole;
  members: Member[];
  invitations: Invitation[];
}

export function MembersClient({
  organizationId,
  currentUserId,
  role,
  members,
  invitations,
}: MembersClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("member");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [copiedInviteId, setCopiedInviteId] = useState<string | null>(null);

  const canManage = role === "owner" || role === "admin";
  const base = `/v1/organizations/${encodeURIComponent(organizationId)}`;

  const sendInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage || inviting) return;

    const address = email.trim();
    if (address.length === 0) return;

    setInviting(true);
    setError(null);
    setNotice(null);
    try {
      await apiFetch(`${base}/invitations`, {
        method: "POST",
        body: { email: address, role: inviteRole },
      });
      setEmail("");
      setNotice(`Invitation sent to ${address}.`);
      router.refresh();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setInviting(false);
    }
  };

  const updateRole = async (member: Member, nextRole: OrganizationRole) => {
    if (!canManage || nextRole === member.role) return;

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

  const removeMember = async (member: Member) => {
    setBusyId(member.id);
    setError(null);
    setNotice(null);
    try {
      await apiFetch(`${base}/members/${encodeURIComponent(member.id)}`, {
        method: "DELETE",
      });
      setConfirmRemoveId(null);
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

  return (
    <div className="jetic-surface min-h-full w-full px-6 pb-16 pt-6 lg:px-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px] font-semibold tracking-tight text-white">Members</h1>
          <p className="jetic-muted text-[13px]">
            Invite teammates and control what they can do in this workspace.
          </p>
        </div>
        <span className="jetic-pill jetic-pill-hobby">{ROLE_LABELS[role]}</span>
      </header>

      {canManage ? (
        <form onSubmit={sendInvite} className="jetic-card mt-6 bg-[var(--jetic-recess)]">
          <div className="flex flex-wrap items-end gap-3 border-b border-white/10 p-4">
            <div className="min-w-[220px] flex-1">
              <label htmlFor="invite-email" className={fieldLabel}>
                Email address
              </label>
              <input
                id="invite-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                  setNotice(null);
                }}
                placeholder="teammate@company.com"
                autoComplete="email"
                className="jetic-input h-10 text-[13px]"
              />
            </div>
            <div className="w-[150px]">
              <label htmlFor="invite-role" className={fieldLabel}>
                Role
              </label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as OrganizationRole)}
                className="jetic-input h-10 text-[13px] text-white"
              >
                {roleOptions(role).map((option) => (
                  <option key={option} value={option}>
                    {ROLE_LABELS[option]}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={inviting} className={`${primaryButton} h-10`}>
              {inviting ? "Sending…" : "Send invite"}
            </button>
          </div>
        </form>
      ) : (
        <p className="jetic-muted mt-4 text-[12.5px]">
          Only admins and owners can invite or manage members.
        </p>
      )}

      {(error || notice) && (
        <p
          role={error ? "alert" : "status"}
          className={`mt-4 text-[13px] ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
        >
          {error ?? notice}
        </p>
      )}

      <section className="jetic-card mt-6 bg-[var(--jetic-recess)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.12em] text-[var(--jetic-faint)]">
                <th scope="col" className="px-4 py-2.5 font-medium">Member</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Role</th>
                <th scope="col" className="px-4 py-2.5 font-medium">Status</th>
                <th scope="col" className="px-4 py-2.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const isSelf = member.userId === currentUserId;
                const isOwner = member.role === "owner";
                const canEdit =
                  canManage && !isSelf && !(isOwner && role !== "owner");
                const busy = busyId === member.id;

                return (
                  <tr key={member.id} className="border-b border-white/[0.06] last:border-b-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--jetic-well)] text-[11px] font-semibold text-white"
                        >
                          {initials(member.user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-white">
                            {member.user.name}
                            {isSelf && <span className="jetic-muted font-normal"> (you)</span>}
                          </p>
                          <p className="jetic-muted truncate text-[12px]">{member.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {canEdit ? (
                        <select
                          aria-label={`Role for ${member.user.name}`}
                          value={member.role}
                          disabled={busy}
                          onChange={(event) =>
                            void updateRole(member, event.target.value as OrganizationRole)
                          }
                          className="h-7 rounded-full border border-white/10 bg-[var(--jetic-well)] px-2.5 text-[11.5px] font-medium text-[var(--jetic-emphasis)] disabled:opacity-50"
                        >
                          {roleOptions(role).map((option) => (
                            <option key={option} value={option}>
                              {ROLE_LABELS[option]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-flex h-6 items-center rounded-full border border-white/10 px-2.5 text-[11.5px] font-medium text-[var(--jetic-emphasis)]">
                          {ROLE_LABELS[member.role]}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--jetic-emphasis)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {confirmRemoveId === member.id ? (
                          <>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void removeMember(member)}
                              className="rounded-lg px-2 py-1 text-[12px] font-semibold text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                            >
                              {busy ? "Removing…" : "Confirm remove"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                              className="rounded-lg px-2 py-1 text-[12px] text-[var(--jetic-muted)] hover:bg-[var(--jetic-well)] hover:text-white"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            disabled={!canEdit || busy}
                            onClick={() => setConfirmRemoveId(member.id)}
                            title={
                              isSelf
                                ? "You cannot remove yourself here."
                                : !canManage
                                  ? "Only admins and owners can remove members."
                                  : undefined
                            }
                            className="rounded-lg px-2 py-1 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:bg-[var(--jetic-well)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {invitations.map((invitation) => {
                const busy = busyId === invitation.id;
                return (
                  <tr
                    key={invitation.id}
                    className="border-b border-white/[0.06] bg-white/[0.015] last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 text-[11px] font-semibold text-[var(--jetic-muted)]"
                        >
                          {initials(invitation.email.split("@")[0] ?? invitation.email)}
                        </span>
                        <div className="min-w-0">
                          <p className="jetic-muted truncate text-[13px]">{invitation.email}</p>
                          <p className="jetic-muted text-[11.5px]">
                            Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                          </p>
                          {invitation.inviteUrl && (
                            <p
                              className="jetic-muted mt-1 max-w-[320px] truncate font-mono text-[11px]"
                              title={invitation.inviteUrl}
                            >
                              {invitation.inviteUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-6 items-center rounded-full border border-white/10 px-2.5 text-[11.5px] font-medium text-[var(--jetic-emphasis)]">
                        {ROLE_LABELS[invitation.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="jetic-muted inline-flex items-center gap-1.5 text-[12px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--jetic-faint)]" />
                        Invited
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        {canManage && invitation.inviteUrl && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void copyInviteLink(invitation)}
                            className="rounded-lg px-2 py-1 text-[12px] font-medium text-[var(--jetic-emphasis)] transition-colors hover:bg-[var(--jetic-well)] hover:text-white disabled:opacity-40"
                          >
                            {copiedInviteId === invitation.id ? "Copied" : "Copy link"}
                          </button>
                        )}
                        {canManage && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void cancelInvitation(invitation)}
                            className="rounded-lg px-2 py-1 text-[12px] font-medium text-[var(--jetic-muted)] transition-colors hover:bg-[var(--jetic-well)] hover:text-white disabled:opacity-40"
                          >
                            {busy ? "Canceling…" : "Cancel invite"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
