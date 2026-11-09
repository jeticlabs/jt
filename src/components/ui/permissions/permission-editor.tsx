"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Box,
  Check,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { Sandbox } from "@/features/sandbox/types";
import type {
  MemberPermissions,
  PermissionEntry,
} from "@/features/permissions/types";

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
        checked
          ? "border-white bg-white"
          : "border-white/20 bg-white/10"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <span
        className={`block h-3.5 w-3.5 rounded-full transition-transform ${
          checked ? "translate-x-[18px] bg-black" : "translate-x-[3px] bg-white"
        }`}
      />
    </button>
  );
}

function PermissionRow({
  entry,
  value,
  onToggle,
  onReset,
}: {
  entry: PermissionEntry;
  value: boolean | null;
  onToggle: (next: boolean) => void;
  onReset: () => void;
}) {
  const effective = value ?? entry.default;
  const disabled = !entry.editable || (!effective && !entry.grantable);
  const inherited = value === null;

  return (
    <div className="flex items-start gap-3 border-b border-white/[0.06] px-4 py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12.5px] font-medium text-white">{entry.label}</p>
          <span
            className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.06em] ${
              inherited
                ? "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]"
                : "border-amber-400/20 bg-amber-400/10 text-amber-300"
            }`}
          >
            {inherited ? "Inherited" : "Custom"}
          </span>
          {entry.kind === "management" && (
            <Lock size={10} className="text-[var(--jetic-faint)]" />
          )}
        </div>
        <p className="jetic-muted mt-0.5 text-[11.5px] leading-5">
          {entry.description}
        </p>
        {!entry.grantable && !effective && entry.editable && (
          <p className="mt-1 text-[10.5px] text-amber-300">
            You need this permission yourself before you can grant it.
          </p>
        )}
        {entry.lockedReason && !entry.editable && (
          <p className="mt-1 text-[10.5px] text-[var(--jetic-faint)]">
            {entry.lockedReason}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-0.5">
        {!inherited && entry.editable && (
          <button
            type="button"
            onClick={onReset}
            title="Reset to the role default"
            className="inline-flex h-7 items-center gap-1 rounded-md border border-white/10 px-2 text-[10.5px] text-[var(--jetic-muted)] transition-colors hover:border-white/20 hover:text-white"
          >
            <RotateCcw size={11} />
            Reset
          </button>
        )}
        <Toggle
          checked={effective}
          disabled={disabled}
          label={`${entry.label} permission`}
          onChange={onToggle}
        />
      </div>
    </div>
  );
}

export interface PermissionEditorProps {
  readonly data: MemberPermissions;
  readonly workspaceSlug: string;
  readonly sandboxes: readonly Sandbox[];
  readonly selectedSandboxId: string | null;
  readonly onSandboxChange: (sandboxId: string | null) => void;
  readonly onSave: (
    overrides: Readonly<Record<string, boolean | null>>,
    sandboxId: string | null,
  ) => Promise<void>;
  readonly saving: boolean;
  readonly error: string | null;
  readonly notice: string | null;
}

export function PermissionEditor({
  data,
  workspaceSlug,
  sandboxes,
  selectedSandboxId,
  onSandboxChange,
  onSave,
  saving,
  error,
  notice,
}: PermissionEditorProps) {
  const [overrides, setOverrides] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    const next: Record<string, boolean | null> = {};
    for (const group of data.groups) {
      for (const permission of group.permissions) {
        next[permission.key] = permission.override;
      }
    }
    setOverrides(next);
  }, [data]);

  const changed = useMemo(() => {
    const diff: Record<string, boolean | null> = {};
    for (const group of data.groups) {
      for (const permission of group.permissions) {
        if (overrides[permission.key] !== permission.override) {
          diff[permission.key] = overrides[permission.key] ?? null;
        }
      }
    }
    return diff;
  }, [data.groups, overrides]);

  const changedCount = Object.keys(changed).length;
  const selectedSandbox =
    selectedSandboxId === null
      ? null
      : (sandboxes.find((sandbox) => sandbox.id === selectedSandboxId) ?? null);

  const scopeLabel =
    selectedSandbox === null ? "Workspace defaults" : selectedSandbox.name;

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/app/workspace/${encodeURIComponent(workspaceSlug)}/members`}
            className="jetic-muted inline-flex items-center gap-1.5 text-[11.5px] transition-colors hover:text-white"
          >
            <ArrowLeft size={12} />
            Back to members
          </Link>
          <h1 className="mt-2 text-[24px] font-semibold tracking-tight text-white">
            {data.member.user.name}
          </h1>
          <p className="jetic-muted mt-1 flex flex-wrap items-center gap-2 text-[12.5px]">
            <span>{data.member.user.email}</span>
            <span className="text-[var(--jetic-faint)]">·</span>
            <span className="capitalize">{data.role}</span>
            <span className="text-[var(--jetic-faint)]">·</span>
            <span>{scopeLabel}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-3 text-[11.5px] text-[var(--jetic-muted)]">
            <ShieldCheck size={13} />
            {changedCount === 0
              ? "No pending changes"
              : `${changedCount} pending ${changedCount === 1 ? "change" : "changes"}`}
          </span>
          <button
            type="button"
            disabled={!data.canEdit || changedCount === 0 || saving}
            onClick={() => void onSave(changed, selectedSandboxId)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-white px-3 text-[12px] font-medium text-black transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/[0.06] disabled:text-[var(--jetic-faint)]"
          >
            <Save size={13} />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </header>

      {(error || notice) && (
        <p
          role={error ? "alert" : "status"}
          className={`text-[12.5px] ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
        >
          {error ?? notice}
        </p>
      )}

      {!data.canEdit && (
        <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[12px] leading-5 text-[var(--jetic-muted)]">
          <Lock size={14} className="mt-0.5 shrink-0" />
          <span>
            {data.role === "owner"
              ? "Owners always have full access and their permissions cannot be edited."
              : "You can view these permissions but you do not have permission to change them."}
          </span>
        </div>
      )}

      <section className="jetic-card rounded-lg bg-[var(--jetic-bg)]">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 p-4">
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-semibold text-white">Scope</h2>
            <p className="jetic-muted mt-1 text-[11.5px] leading-5">
              Workspace defaults apply everywhere. A sandbox scope only overrides
              this member&apos;s access inside that sandbox.
            </p>
          </div>
          <label className="flex flex-col gap-1.5 text-[10.5px] text-[var(--jetic-muted)]">
            Permission scope
            <span className="relative">
              <select
                value={selectedSandboxId ?? ""}
                onChange={(event) =>
                  onSandboxChange(event.target.value === "" ? null : event.target.value)
                }
                disabled={saving}
                className="h-9 min-w-[220px] appearance-none rounded-md border border-white/10 bg-[var(--jetic-recess)] pl-3 pr-8 text-[12.5px] text-white outline-none transition-colors hover:border-white/20 focus:border-white/30"
              >
                <option value="">Workspace defaults</option>
                {sandboxes.map((sandbox) => (
                  <option key={sandbox.id} value={sandbox.id}>
                    {sandbox.name}
                  </option>
                ))}
              </select>
              <Box
                size={12}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--jetic-muted)]"
              />
            </span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-4 py-3 text-[11px] text-[var(--jetic-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Users size={12} />
            Inherited from the {data.role} role
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check size={12} />
            Custom overrides are saved per member
          </span>
          {data.updatedBy && data.updatedAt && (
            <span className="ml-auto">
              Last changed by {data.updatedBy.name} on{" "}
              {new Date(data.updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      </section>

      {data.groups.map((group) => (
        <section
          key={group.id}
          className="jetic-card overflow-hidden rounded-lg bg-[var(--jetic-bg)]"
        >
          <div className="border-b border-white/10 bg-[var(--jetic-well)] px-4 py-3">
            <h2 className="text-[13px] font-semibold text-white">{group.label}</h2>
            <p className="jetic-muted mt-0.5 text-[11px]">
              {group.permissions.length} permission
              {group.permissions.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-col">
            {group.permissions.map((permission) => (
              <PermissionRow
                key={permission.key}
                entry={permission}
                value={overrides[permission.key] ?? null}
                onToggle={(next) => {
                  setOverrides((current) => ({
                    ...current,
                    [permission.key]: next === permission.default ? null : next,
                  }));
                }}
                onReset={() => {
                  setOverrides((current) => ({
                    ...current,
                    [permission.key]: null,
                  }));
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
