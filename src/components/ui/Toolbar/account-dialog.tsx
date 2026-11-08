"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  Check,
  Copy,
  KeyRound,
  Laptop,
  LifeBuoy,
  LogOut,
  RefreshCw,
  Settings,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { ImageUploadButton } from "@/components/ui/image-upload-button";
import {
  AccountDetailsSkeleton,
  AccountPanelSkeleton,
  AccountRowsSkeleton,
  Skeleton,
} from "@/components/ui/skeleton";
import { apiFetch, errorMessage } from "@/lib/api/browser";
import { GitHubIcon } from "@/components/icons/github-icon";
import { useUserStore } from "@/context";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface AccountUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly image: string | null;
  readonly githubId: string | null;
  readonly githubUsername: string | null;
  readonly usePassword: boolean;
  readonly hasPassword: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface UserEnvelope {
  readonly user: AccountUser;
}

type DeviceStatus = "new" | "trusted" | "blocked";

interface Device {
  readonly id: string;
  readonly name: string | null;
  readonly browser: string | null;
  readonly operatingSystem: string | null;
  readonly status: DeviceStatus;
  readonly firstSeenAt: string;
  readonly lastSeenAt: string;
  readonly trustedAt: string | null;
  readonly blockedAt: string | null;
  readonly createdAt: string;
}

interface DeviceListResponse {
  readonly data: Device[];
}

interface DeviceEnvelope {
  readonly device: Device;
}

interface Session {
  readonly id: string;
  readonly deviceId: string | null;
  readonly expiresAt: string;
  readonly activeOrganizationId: string | null;
  readonly createdAt: string;
  readonly current: boolean;
  readonly lastActiveAt: string;
}

interface SessionListResponse {
  readonly data: Session[];
}

interface RevokeSessionsResponse {
  readonly revoked: number;
}

type SecurityEventType =
  | "account_created"
  | "new_device_login"
  | "recognized_device_login"
  | "session_revoked"
  | "all_sessions_revoked"
  | "device_trusted"
  | "device_blocked"
  | "password_changed"
  | "email_changed"
  | "suspicious_login";

interface SecurityEvent {
  readonly id: string;
  readonly deviceId: string | null;
  readonly type: SecurityEventType;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  readonly metadata: unknown;
  readonly createdAt: string;
}

interface SecurityEventPage {
  readonly data: SecurityEvent[];
  readonly page: {
    readonly nextCursor: string | null;
    readonly hasMore: boolean;
  };
}

type AccountTab =
  | "profile"
  | "devices"
  | "settings"
  | "privacy"
  | "support"
  | "notifications";

const ACCOUNT_TABS: {
  id: AccountTab;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
    {
      id: "profile",
      label: "Profile",
      description: "Your account identity for this workspace.",
      icon: User,
    },
    {
      id: "devices",
      label: "Devices & Sessions",
      description: "Review where you are signed in and manage trusted devices.",
      icon: Laptop,
    },
    {
      id: "settings",
      label: "Settings",
      description: "Account details and recent security activity.",
      icon: Settings,
    },
    {
      id: "privacy",
      label: "Data & Privacy",
      description: "Understand and control the data tied to your account.",
      icon: ShieldCheck,
    },
    {
      id: "support",
      label: "Support",
      description: "Get help with your account and workspace.",
      icon: LifeBuoy,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Choose which updates Jetic sends you.",
      icon: Bell,
    },
  ];

const SECURITY_EVENT_LABELS: Record<SecurityEventType, string> = {
  account_created: "Account created",
  new_device_login: "New device sign-in",
  recognized_device_login: "Recognized device sign-in",
  session_revoked: "Session revoked",
  all_sessions_revoked: "All other sessions signed out",
  device_trusted: "Device trusted",
  device_blocked: "Device blocked",
  password_changed: "Password changed",
  email_changed: "Email address changed",
  suspicious_login: "Suspicious sign-in",
};

/* -------------------------------------------------------------------------- */
/*                              Small primitives                              */
/* -------------------------------------------------------------------------- */

const secondaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40";

const primaryButton =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-white px-3.5 text-[12px] font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-40";

const dangerButton =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-red-500/30 px-3 text-[12px] font-medium text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/30 disabled:cursor-not-allowed disabled:opacity-40";

const inputClass =
  "h-9 w-full rounded-md border border-white/10 bg-[var(--jetic-well)] px-3 text-[12.5px] text-white outline-none transition-colors placeholder:text-[var(--jetic-muted)] hover:border-white/20 focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

const linkClass =
  "inline-flex items-center gap-1 text-[12px] font-medium text-[var(--jetic-link)] transition-colors hover:underline";

function Avatar({
  name,
  email,
  image,
  size = "md",
}: {
  name: string;
  email: string;
  image: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const initials = (name.trim().charAt(0) || email.trim().charAt(0) || "?").toUpperCase();
  const sizeClass =
    size === "lg"
      ? "h-16 w-16 text-[22px]"
      : size === "sm"
        ? "h-7 w-7 text-[10px]"
        : "h-10 w-10 text-[13px]";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-[var(--jetic-recess)] bg-cover bg-center font-semibold uppercase text-white ${sizeClass}`}
      style={image ? { backgroundImage: `url(${JSON.stringify(image)})` } : undefined}
    >
      {image ? null : initials}
    </span>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "positive" | "warning" | "danger";
}) {
  const toneClass =
    tone === "positive"
      ? "border-white/15 bg-white/10 text-[var(--jetic-emphasis)]"
      : tone === "warning"
        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
        : tone === "danger"
          ? "border-red-500/20 bg-red-500/10 text-red-300"
          : "border-white/10 bg-white/[0.04] text-[var(--jetic-muted)]";

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${toneClass}`}
    >
      {children}
    </span>
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
  footer,
  className = "",
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`jetic-card rounded-lg bg-[var(--jetic-recess)] ${className}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[13.5px] font-semibold tracking-tight text-white">{title}</h3>
            {description && (
              <p className="jetic-muted mt-1 text-[12px] leading-5">{description}</p>
            )}
          </div>
          {action}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
      {footer && (
        <div className="flex min-h-[3rem] flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[var(--jetic-well)] px-4 py-2.5 text-[11.5px] text-[var(--jetic-muted)]">
          {footer}
        </div>
      )}
    </section>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 first:pt-0 last:pb-0">
      <dt className="jetic-muted shrink-0 text-[12px]">{label}</dt>
      <dd className="flex min-w-0 items-center justify-end gap-2 text-right text-[12.5px] text-white">
        {children}
      </dd>
    </div>
  );
}

function PanelLoading({ label }: { label: string }) {
  return <AccountPanelSkeleton label={label} />;
}

function PanelError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="jetic-card flex flex-col items-center gap-3 rounded-lg bg-[var(--jetic-recess)] px-5 py-10 text-center">
      <p className="text-[12.5px] leading-5 text-red-400">{message}</p>
      <button type="button" onClick={onRetry} className={secondaryButton}>
        Try again
      </button>
    </div>
  );
}

function Notice({ error, notice }: { error: string | null; notice?: string | null }) {
  if (!error && !notice) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`text-[12px] leading-5 ${error ? "text-red-400" : "text-[var(--jetic-emphasis)]"}`}
    >
      {error ?? notice}
    </p>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${checked ? "border-white bg-white" : "border-white/20 bg-white/10"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`block h-3.5 w-3.5 rounded-full transition-transform ${checked ? "translate-x-[18px] bg-black" : "translate-x-[3px] bg-white/70"
          }`}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function relativeTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";

  const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const absolute = Math.abs(diffSeconds);
  if (absolute < 45) return "just now";

  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (absolute < 60 * 60) return formatter.format(Math.round(diffSeconds / 60), "minute");
  if (absolute < 60 * 60 * 24) {
    return formatter.format(Math.round(diffSeconds / (60 * 60)), "hour");
  }
  if (absolute < 60 * 60 * 24 * 30) {
    return formatter.format(Math.round(diffSeconds / (60 * 60 * 24)), "day");
  }
  if (absolute < 60 * 60 * 24 * 365) {
    return formatter.format(Math.round(diffSeconds / (60 * 60 * 24 * 30)), "month");
  }
  return formatter.format(Math.round(diffSeconds / (60 * 60 * 24 * 365)), "year");
}

function deviceLabel(device: Device): string {
  const name = device.name?.trim();
  if (name) return name;
  if (device.browser && device.operatingSystem) {
    return `${device.browser} on ${device.operatingSystem}`;
  }
  return device.browser ?? device.operatingSystem ?? "Unknown device";
}

function deviceDetails(device: Device | null): string {
  if (!device) return "No device recorded";
  const parts = [device.browser, device.operatingSystem].filter(
    (part): part is string => Boolean(part),
  );
  return parts.length > 0 ? parts.join(" · ") : "Recognized device";
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return;
    } catch {
      // Fall back to a selection-based copy when the async API is unavailable.
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

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await copyText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1_600);
    } catch {
      // Keep the UI quiet; the value is still visible for manual copying.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      aria-label={label}
      title={copied ? "Copied" : label}
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Profile                                    */
/* -------------------------------------------------------------------------- */

function ProfilePanel({
  user,
  onProfileChange,
  onSignOut,
  onNavigate,
}: {
  user: AccountUser;
  onProfileChange: (user: AccountUser) => void;
  onSignOut: () => void;
  onNavigate: (tab: AccountTab) => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const trimmedName = name.trim();
  const previewName = trimmedName || user.name;
  const dirty = trimmedName !== user.name;

  const saveProfile = async () => {
    if (!dirty || saving) return;

    if (trimmedName.length === 0) {
      setFormError("Enter a display name.");
      return;
    }
    if (trimmedName.length > 100) {
      setFormError("Display names can be at most 100 characters.");
      return;
    }

    setSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      const result = await apiFetch<UserEnvelope>("/v1/users/me", {
        method: "PATCH",
        body: { name: trimmedName },
      });
      onProfileChange(result.user);
      setName(result.user.name);
      setNotice("Profile updated.");
      router.refresh();
    } catch (cause) {
      setFormError(errorMessage(cause));
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = async () => {
    if (saving) return;
    setSaving(true);
    setFormError(null);
    setNotice(null);
    try {
      const result = await apiFetch<UserEnvelope>("/v1/users/me", {
        method: "PATCH",
        body: { image: null },
      });
      onProfileChange(result.user);
      setNotice("Avatar removed.");
      router.refresh();
    } catch (cause) {
      setFormError(errorMessage(cause));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4 pb-1">
        <Avatar
          name={previewName}
          email={user.email}
          image={user.image}
          size="lg"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[19px] font-semibold tracking-tight text-white">
              {previewName}
            </h3>
            <Badge tone={user.emailVerified ? "positive" : "warning"}>
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
          <p className="jetic-muted mt-0.5 truncate text-[12.5px]">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <ImageUploadButton
              endpoint="userAvatar"
              disabled={saving}
              onUploaded={(url) => {
                onProfileChange({ ...user, image: url });
                setFormError(null);
                setNotice("Avatar updated.");
                router.refresh();
              }}
              onError={(message) => {
                setNotice(null);
                setFormError(message);
              }}
            >
              Upload avatar
            </ImageUploadButton>
            {user.image && (
              <button
                type="button"
                onClick={() => void removeAvatar()}
                disabled={saving}
                className="inline-flex h-8 items-center justify-center rounded-md border border-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {saving ? "Removing…" : "Remove"}
              </button>
            )}
          </div>
        </div>
      </div>

      <SectionCard
        title="Profile information"
        description="This is how your account appears across Jetic."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void saveProfile();
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor="account-display-name" className="jetic-muted text-[11.5px]">
                  Display name
                </label>
                <span className="text-[10.5px] text-[var(--jetic-faint)]">
                  {name.length}/100
                </span>
              </div>
              <input
                id="account-display-name"
                type="text"
                value={name}
                maxLength={100}
                disabled={saving}
                onChange={(event) => {
                  setName(event.target.value);
                  setFormError(null);
                  setNotice(null);
                }}
                autoComplete="name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="account-email" className="jetic-muted mb-1.5 block text-[11.5px]">
                Email address
              </label>
              <input
                id="account-email"
                type="email"
                value={user.email}
                readOnly
                disabled
                className={inputClass}
              />
              <p className="jetic-muted mt-1 text-[10.5px]">
                Contact support to change your sign-in email.
              </p>
            </div>
          </div>

          <Notice error={formError} notice={notice} />

          <div className="flex items-center justify-between gap-3">
            <p className="jetic-muted text-[11px]">
              Joined {formatDate(user.createdAt)}
            </p>
            <button type="submit" disabled={!dirty || saving} className={primaryButton}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </SectionCard>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onNavigate("privacy")}
          className="text-[11.5px] text-[var(--jetic-muted)] transition-colors hover:text-red-300"
        >
          Delete account
        </button>
        <button type="button" onClick={onSignOut} className={secondaryButton}>
          <LogOut size={13} />
          Log out
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Devices & sessions                              */
/* -------------------------------------------------------------------------- */

function DevicesPanel() {
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [sessions, setSessions] = useState<Session[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const retry = () => {
    setLoading(true);
    setError(null);
    setNotice(null);
    setReloadKey((value) => value + 1);
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const [deviceResponse, sessionResponse] = await Promise.all([
          apiFetch<DeviceListResponse>("/v1/auth/devices"),
          apiFetch<SessionListResponse>("/v1/auth/sessions"),
        ]);
        if (cancelled) return;
        setDevices(deviceResponse.data);
        setSessions(sessionResponse.data);
      } catch (cause) {
        if (!cancelled) setError(errorMessage(cause));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  if (loading && devices === null && sessions === null) {
    return <PanelLoading label="Loading devices and sessions…" />;
  }

  if (devices === null && sessions === null) {
    return (
      <PanelError
        message={error ?? "Unable to load your devices and sessions."}
        onRetry={retry}
      />
    );
  }

  const currentDeviceId = sessions?.find((session) => session.current)?.deviceId ?? null;
  const orderedDevices = [...(devices ?? [])].sort(
    (left, right) =>
      new Date(right.lastSeenAt).getTime() - new Date(left.lastSeenAt).getTime(),
  );
  const orderedSessions = [...(sessions ?? [])].sort(
    (left, right) =>
      Number(right.current) - Number(left.current) ||
      new Date(right.lastActiveAt).getTime() - new Date(left.lastActiveAt).getTime(),
  );

  const trustDevice = async (device: Device) => {
    if (busy) return;
    setBusy(`device:${device.id}`);
    setError(null);
    setNotice(null);
    try {
      const result = await apiFetch<DeviceEnvelope>(
        `/v1/auth/devices/${encodeURIComponent(device.id)}/trust`,
        { method: "POST" },
      );
      setDevices((current) =>
        current
          ? current.map((item) => (item.id === result.device.id ? result.device : item))
          : [result.device],
      );
      setNotice(`${deviceLabel(device)} is now trusted.`);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const blockDevice = async (device: Device) => {
    if (busy) return;
    setBusy(`device:${device.id}`);
    setError(null);
    setNotice(null);
    try {
      const result = await apiFetch<DeviceEnvelope>(
        `/v1/auth/devices/${encodeURIComponent(device.id)}/block`,
        { method: "POST" },
      );
      setDevices((current) =>
        current
          ? current.map((item) => (item.id === result.device.id ? result.device : item))
          : [result.device],
      );
      setSessions((current) =>
        current ? current.filter((session) => session.deviceId !== result.device.id) : current,
      );
      setNotice(`${deviceLabel(device)} was blocked and signed out.`);
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const revokeSession = async (session: Session) => {
    if (busy) return;
    setBusy(`session:${session.id}`);
    setError(null);
    setNotice(null);
    try {
      await apiFetch<void>(`/v1/auth/sessions/${encodeURIComponent(session.id)}`, {
        method: "DELETE",
      });
      setSessions((current) =>
        current ? current.filter((item) => item.id !== session.id) : current,
      );
      setNotice("Session revoked.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const revokeOtherSessions = async () => {
    if (busy) return;
    setBusy("others");
    setError(null);
    setNotice(null);
    try {
      const result = await apiFetch<RevokeSessionsResponse>("/v1/auth/sessions", {
        method: "DELETE",
      });
      setSessions((current) => (current ? current.filter((session) => session.current) : current));
      setNotice(
        result.revoked === 0
          ? "No other sessions were active."
          : result.revoked === 1
            ? "Signed out 1 other session."
            : `Signed out ${result.revoked} other sessions.`,
      );
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(null);
    }
  };

  const hasOtherSessions = sessions?.some((session) => !session.current) ?? false;

  return (
    <div className="flex flex-col gap-4">
      <Notice error={error} notice={notice} />

      <SectionCard
        title="Active sessions"
        description="Every browser or API client currently signed in to your account."
        action={
          <button
            type="button"
            onClick={() => void revokeOtherSessions()}
            disabled={busy !== null || !hasOtherSessions}
            className={secondaryButton}
          >
            {busy === "others" ? "Signing out…" : "Sign out others"}
          </button>
        }
      >
        {loading ? (
          <AccountRowsSkeleton rows={2} label="Refreshing sessions…" />
        ) : orderedSessions.length === 0 ? (
          <p className="jetic-muted py-4 text-center text-[12px]">
            No active sessions were found.
          </p>
        ) : (
          <div className="flex flex-col">
            {orderedSessions.map((session) => {
              const device = devices?.find((item) => item.id === session.deviceId) ?? null;
              const title = session.current
                ? "This device"
                : device
                  ? deviceLabel(device)
                  : session.deviceId
                    ? "Recognized device"
                    : "API session";

              return (
                <div
                  key={session.id}
                  className="flex flex-wrap items-start gap-3 border-b border-white/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
                    <Laptop size={15} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[12.5px] font-medium text-white">{title}</p>
                      {session.current && <Badge tone="positive">Current</Badge>}
                    </div>
                    <p className="jetic-muted mt-0.5 truncate text-[11.5px]">
                      {deviceDetails(device)}
                    </p>
                    <p className="jetic-muted mt-0.5 text-[11px]">
                      Signed in {formatDateTime(session.createdAt)} · Active{" "}
                      {relativeTime(session.lastActiveAt)}
                    </p>
                    <p className="jetic-muted text-[11px]">
                      Expires {formatDate(session.expiresAt)}
                    </p>
                  </div>
                  {!session.current && (
                    <button
                      type="button"
                      onClick={() => void revokeSession(session)}
                      disabled={busy !== null}
                      className={dangerButton}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Devices"
        description="Devices that have signed in to this account. Trusted devices skip extra verification."
      >
        {orderedDevices.length === 0 ? (
          <p className="jetic-muted py-4 text-center text-[12px]">
            No devices have been recorded yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {orderedDevices.map((device) => {
              const isCurrent = device.id === currentDeviceId;
              const isBusy = busy === `device:${device.id}`;

              return (
                <div
                  key={device.id}
                  className="flex flex-wrap items-start gap-3 border-b border-white/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
                    <Laptop size={15} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[12.5px] font-medium text-white">
                        {deviceLabel(device)}
                      </p>
                      <Badge
                        tone={
                          device.status === "trusted"
                            ? "positive"
                            : device.status === "blocked"
                              ? "danger"
                              : "warning"
                        }
                      >
                        {device.status === "trusted"
                          ? "Trusted"
                          : device.status === "blocked"
                            ? "Blocked"
                            : "New"}
                      </Badge>
                      {isCurrent && <Badge>This device</Badge>}
                    </div>
                    <p className="jetic-muted mt-0.5 truncate text-[11.5px]">
                      {deviceDetails(device)}
                    </p>
                    <p className="jetic-muted mt-0.5 text-[11px]">
                      Last seen {relativeTime(device.lastSeenAt)} · First seen{" "}
                      {formatDate(device.firstSeenAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    {device.status !== "trusted" && (
                      <button
                        type="button"
                        onClick={() => void trustDevice(device)}
                        disabled={busy !== null}
                        className={secondaryButton}
                      >
                        {isBusy
                          ? "Saving…"
                          : device.status === "blocked"
                            ? "Unblock"
                            : "Trust"}
                      </button>
                    )}
                    {device.status !== "blocked" && (
                      <button
                        type="button"
                        onClick={() => void blockDevice(device)}
                        disabled={busy !== null || isCurrent}
                        title={
                          isCurrent
                            ? "You cannot block the device you are currently using."
                            : undefined
                        }
                        className={dangerButton}
                      >
                        {isBusy ? "Saving…" : "Block"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Settings                                   */
/* -------------------------------------------------------------------------- */

function PasswordPanel({
  user,
  onProfileChange,
}: {
  user: AccountUser;
  onProfileChange: (user: AccountUser) => void;
}) {
  const [form, setForm] = useState<"none" | "enable" | "change" | "disable">("none");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const resetForm = () => {
    setForm("none");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const submit = async () => {
    if (busy) return;
    setError(null);
    setNotice(null);

    if (form === "disable") {
      if (user.hasPassword && currentPassword.length === 0) {
        setError("Enter your current password to disable password sign-in.");
        return;
      }
      setBusy(true);
      try {
        const result = await apiFetch<UserEnvelope>("/v1/users/me/password", {
          method: "DELETE",
          body: currentPassword ? { currentPassword } : {},
        });
        onProfileChange(result.user);
        setNotice("Password sign-in disabled.");
        resetForm();
      } catch (cause) {
        setError(errorMessage(cause));
      } finally {
        setBusy(false);
      }
      return;
    }

    if (newPassword.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (form === "change" && currentPassword.length === 0) {
      setError("Enter your current password.");
      return;
    }

    setBusy(true);
    try {
      const result = await apiFetch<UserEnvelope>("/v1/users/me/password", {
        method: "PUT",
        body: {
          newPassword,
          ...(currentPassword ? { currentPassword } : {}),
        },
      });
      onProfileChange(result.user);
      setNotice(
        form === "change" ? "Password updated." : "Password sign-in enabled.",
      );
      resetForm();
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  return (
    <SectionCard
      title="Password sign-in"
      description="When enabled, Jetic asks for your password after email verification before opening the dashboard."
      action={
        <Toggle
          checked={user.usePassword}
          disabled={busy}
          label="Toggle password sign-in"
          onChange={() => {
            setError(null);
            setNotice(null);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setForm(user.usePassword ? "disable" : "enable");
          }}
        />
      }
      footer={
        <span>
          {user.usePassword
            ? "Password verification is required after the email code."
            : "Email verification alone signs you in."}
        </span>
      }
    >
      <div className="flex flex-col gap-3">
        {notice && (
          <p role="status" className="text-[12px] text-[var(--jetic-emphasis)]">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" className="text-[12px] leading-5 text-red-400">
            {error}
          </p>
        )}

        {form === "none" ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="jetic-muted inline-flex items-center gap-1.5 text-[12px]">
              <KeyRound size={13} />
              {user.usePassword ? "Password is set" : "No password set"}
            </span>
            {user.usePassword && (
              <button
                type="button"
                onClick={() => setForm("change")}
                className={secondaryButton}
              >
                Change password
              </button>
            )}
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
            className="flex flex-col gap-3"
          >
            <p className="jetic-muted text-[12px] leading-5">
              {form === "enable"
                ? "Set a password to enable password verification."
                : form === "change"
                  ? "Confirm your current password, then choose a new one."
                  : "Confirm your current password to disable password verification."}
            </p>

            {(form === "change" || form === "disable") && (
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current password"
                autoComplete="current-password"
                disabled={busy}
                className={inputClass}
              />
            )}

            {form !== "disable" && (
              <>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                  disabled={busy}
                  className={inputClass}
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  disabled={busy}
                  className={inputClass}
                />
                <p className="jetic-muted text-[10.5px]">
                  At least 8 characters.
                </p>
              </>
            )}

            <div className="flex items-center gap-2">
              <button type="submit" disabled={busy} className={primaryButton}>
                {busy
                  ? "Saving…"
                  : form === "disable"
                    ? "Disable password"
                    : form === "change"
                      ? "Update password"
                      : "Enable password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setError(null);
                }}
                disabled={busy}
                className={secondaryButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </SectionCard>
  );
}

function ConnectedAccountsPanel({
  user,
  onProfileChange,
}: {
  user: AccountUser;
  onProfileChange: (user: AccountUser) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const connect = () => {
    const next = window.location.pathname;
    window.location.assign(
      `/api/auth/github/connect?next=${encodeURIComponent(next)}`,
    );
  };

  const disconnect = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await apiFetch<UserEnvelope>("/v1/users/me/github", {
        method: "DELETE",
      });
      onProfileChange(result.user);
      setNotice("GitHub disconnected.");
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setBusy(false);
    }
  };

  const connected = user.githubId !== null;
  const profileUrl =
    user.githubUsername !== null
      ? `https://github.com/${encodeURIComponent(user.githubUsername)}`
      : null;

  return (
    <SectionCard
      title="Connected accounts"
      description="Use GitHub to sign in or create this account."
      footer={
        <span>
          {connected
            ? "GitHub is linked to this Jetic account."
            : "Connect GitHub to sign in with your GitHub identity."}
        </span>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[var(--jetic-well)] text-white">
            <GitHubIcon size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-white">
              {user.githubUsername ? `@${user.githubUsername}` : "GitHub"}
            </p>
            <p className="jetic-muted mt-0.5 text-[11.5px]">
              {connected ? "Connected" : "Not connected"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {connected ? (
            <>
              {profileUrl && (
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={secondaryButton}
                >
                  View profile
                  <ArrowUpRight size={12} />
                </a>
              )}
              <button
                type="button"
                onClick={() => void disconnect()}
                disabled={busy}
                className={dangerButton}
              >
                {busy ? "Disconnecting…" : "Disconnect"}
              </button>
            </>
          ) : (
            <button type="button" onClick={connect} className={primaryButton}>
              <GitHubIcon size={13} />
              Connect GitHub
            </button>
          )}
        </div>
      </div>

      {(error || notice) && (
        <div className="mt-3">
          <Notice error={error} notice={notice} />
        </div>
      )}
    </SectionCard>
  );
}

function SettingsPanel({
  user,
  loading,
  error,
  onRetry,
  onNavigate,
  onProfileChange,
}: {
  user: AccountUser | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onNavigate: (tab: AccountTab) => void;
  onProfileChange: (user: AccountUser) => void;
}) {
  const [events, setEvents] = useState<SecurityEvent[] | null>(null);
  const [page, setPage] = useState<SecurityEventPage["page"] | null>(null);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const reloadEvents = () => {
    setEventsLoading(true);
    setEventsError(null);
    setEvents(null);
    setPage(null);
    setReloadKey((value) => value + 1);
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const result = await apiFetch<SecurityEventPage>(
          "/v1/auth/security-events?limit=10",
        );
        if (cancelled) return;
        setEvents(result.data);
        setPage(result.page);
      } catch (cause) {
        if (!cancelled) setEventsError(errorMessage(cause));
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const loadMore = async () => {
    if (!page?.nextCursor || loadingMore) return;
    setLoadingMore(true);
    setEventsError(null);
    try {
      const result = await apiFetch<SecurityEventPage>(
        `/v1/auth/security-events?limit=10&cursor=${encodeURIComponent(page.nextCursor)}`,
      );
      setEvents((current) => [...(current ?? []), ...result.data]);
      setPage(result.page);
    } catch (cause) {
      setEventsError(errorMessage(cause));
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {user ? (
        <SectionCard
          title="Account"
          description="The identity and metadata attached to your Jetic account."
          footer={<span>Email changes are handled through support.</span>}
        >
          <dl className="flex flex-col divide-y divide-white/[0.06]">
            <DetailRow label="Email">
              <span className="min-w-0 truncate">{user.email}</span>
            </DetailRow>
            <DetailRow label="Verification">
              <Badge tone={user.emailVerified ? "positive" : "warning"}>
                {user.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </DetailRow>
            <DetailRow label="Account ID">
              <code className="min-w-0 truncate font-mono text-[11.5px] text-[var(--jetic-muted)]">
                {user.id}
              </code>
              <CopyButton value={user.id} label="Copy account ID" />
            </DetailRow>
            <DetailRow label="Member since">{formatDate(user.createdAt)}</DetailRow>
          </dl>
        </SectionCard>
      ) : loading ? (
        <SectionCard
          title="Account"
          footer={<Skeleton className="h-2.5 w-64 rounded-full" />}
        >
          <AccountDetailsSkeleton rows={4} label="Loading account details…" />
        </SectionCard>
      ) : (
        <PanelError message={error ?? "Unable to load account details."} onRetry={onRetry} />
      )}

      {user && (
        <>
          <PasswordPanel user={user} onProfileChange={onProfileChange} />
          <ConnectedAccountsPanel user={user} onProfileChange={onProfileChange} />
        </>
      )}

      <SectionCard
        title="Security activity"
        description="Recent sign-ins and security changes on your account."
        action={
          <button
            type="button"
            onClick={reloadEvents}
            disabled={eventsLoading}
            aria-label="Refresh security activity"
            title="Refresh security activity"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <RefreshCw size={13} className={eventsLoading ? "opacity-40" : undefined} />
          </button>
        }
      >
        {eventsLoading ? (
          <AccountRowsSkeleton rows={3} label="Loading security activity…" />
        ) : eventsError && (!events || events.length === 0) ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <p className="text-[12px] leading-5 text-red-400">{eventsError}</p>
            <button
              type="button"
              onClick={reloadEvents}
              className={secondaryButton}
            >
              Try again
            </button>
          </div>
        ) : !events || events.length === 0 ? (
          <p className="jetic-muted py-4 text-center text-[12px]">
            No security activity has been recorded yet.
          </p>
        ) : (
          <div className="flex flex-col">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 border-b border-white/[0.06] py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--jetic-well)] text-[var(--jetic-muted)]">
                  <ShieldCheck size={13} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-white">
                    {SECURITY_EVENT_LABELS[event.type]}
                  </p>
                  <p className="jetic-muted mt-0.5 text-[11px]">
                    {formatDateTime(event.createdAt)}
                    {event.ipAddress ? ` · ${event.ipAddress}` : ""}
                  </p>
                  {event.userAgent && (
                    <p
                      className="jetic-muted mt-0.5 truncate text-[10.5px]"
                      title={event.userAgent}
                    >
                      {event.userAgent}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {eventsError && (
              <p role="alert" className="mt-2 text-[11.5px] leading-5 text-red-400">
                {eventsError}
              </p>
            )}

            {page?.hasMore && (
              <button
                type="button"
                onClick={() => void loadMore()}
                disabled={loadingMore}
                className="mt-3 self-start text-[11.5px] font-medium text-[var(--jetic-link)] transition-colors hover:underline disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more activity"}
              </button>
            )}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Sessions"
        description="Review every device that can access your account and sign out the ones you no longer use."
        footer={
          <>
            <span>Revoking a session takes effect immediately.</span>
            <button
              type="button"
              onClick={() => onNavigate("devices")}
              className={secondaryButton}
            >
              Manage devices & sessions
            </button>
          </>
        }
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Static panels                                 */
/* -------------------------------------------------------------------------- */

function PrivacyPanel() {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Your data"
        description="Jetic keeps the information needed to run your account and workspaces."
      >
        <ul className="flex flex-col gap-2.5 text-[12px] leading-5 text-[var(--jetic-muted)]">
          <li className="flex gap-2.5">
            <Check size={13} className="mt-1 shrink-0 text-[var(--jetic-emphasis)]" />
            <span>
              <strong className="font-medium text-white">Account identity.</strong> Your name,
              email address, and optional avatar.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check size={13} className="mt-1 shrink-0 text-[var(--jetic-emphasis)]" />
            <span>
              <strong className="font-medium text-white">Workspace access.</strong> The
              memberships, roles, and invitations tied to your account.
            </span>
          </li>
          <li className="flex gap-2.5">
            <Check size={13} className="mt-1 shrink-0 text-[var(--jetic-emphasis)]" />
            <span>
              <strong className="font-medium text-white">Security records.</strong> Devices,
              sessions, and security events used to protect your account.
            </span>
          </li>
        </ul>
      </SectionCard>

      <SectionCard
        title="Data controls"
        description="Request a copy of your data or ask us to remove your account."
        footer={<span>Include the email address associated with your account.</span>}
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-[var(--jetic-well)] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[12.5px] font-medium text-white">Export account data</p>
              <p className="jetic-muted mt-0.5 text-[11.5px]">
                Receive a copy of your profile, workspace memberships, and security activity.
              </p>
            </div>
            <Link href="/contact" className={secondaryButton}>
              Contact support
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-500/20 bg-red-500/[0.04] px-3 py-2.5">
            <div className="min-w-0">
              <p className="text-[12.5px] font-medium text-white">Delete account</p>
              <p className="jetic-muted mt-0.5 text-[11.5px]">
                Permanently remove your account and personal data from Jetic.
              </p>
            </div>
            <Link href="/contact" className={dangerButton}>
              Contact support
            </Link>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Privacy policy"
        description="Learn how Jetic collects, uses, and protects information."
      >
        <Link href="/privacy" className={linkClass}>
          Read the privacy policy
          <ArrowUpRight size={12} />
        </Link>
      </SectionCard>
    </div>
  );
}

function SupportPanel() {
  const resources = [
    {
      label: "Help center",
      description: "Guides, setup notes, and troubleshooting.",
      href: "/support",
    },
    {
      label: "Contact us",
      description: "Send the team a question or report an issue.",
      href: "/contact",
    },
    {
      label: "System status",
      description: "Check current availability and incidents.",
      href: "/status",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Contact support"
        description="Tell us what happened and include the email address on your account."
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="group flex flex-col rounded-lg border border-white/10 bg-[var(--jetic-well)] px-3 py-3 transition-colors hover:border-white/20 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <span className="flex items-center justify-between gap-2 text-[12.5px] font-medium text-white">
                {resource.label}
                <ArrowUpRight
                  size={13}
                  className="text-[var(--jetic-muted)] transition-colors group-hover:text-white"
                />
              </span>
              <span className="jetic-muted mt-1 text-[11.5px] leading-5">
                {resource.description}
              </span>
            </Link>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Report a security issue"
        description="If you believe you found a vulnerability, report it privately instead of opening a public support request."
      >
        <Link href="/security" className={linkClass}>
          Read the security policy
          <ArrowUpRight size={12} />
        </Link>
      </SectionCard>

      <SectionCard
        title="What to include"
        description="A little context helps us resolve account issues faster."
      >
        <ul className="flex flex-col gap-2 text-[12px] leading-5 text-[var(--jetic-muted)]">
          <li>• The email address on your account.</li>
          <li>• The workspace name and slug, when relevant.</li>
          <li>• Steps to reproduce, expected behavior, and actual behavior.</li>
          <li>• Screenshots or error messages with secrets redacted.</li>
        </ul>
      </SectionCard>
    </div>
  );
}

type NotificationKey = "security" | "workspace" | "product" | "weekly";

type NotificationPreferences = Record<NotificationKey, boolean>;

const NOTIFICATION_STORAGE_KEY = "jetic.account.notification-preferences";

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  security: true,
  workspace: true,
  product: true,
  weekly: false,
};

function readNotificationPreferences(): NotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATION_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!raw) return DEFAULT_NOTIFICATION_PREFERENCES;
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object") {
      return DEFAULT_NOTIFICATION_PREFERENCES;
    }
    const value = parsed as Partial<Record<NotificationKey, unknown>>;
    return {
      security: true,
      workspace:
        typeof value.workspace === "boolean"
          ? value.workspace
          : DEFAULT_NOTIFICATION_PREFERENCES.workspace,
      product:
        typeof value.product === "boolean"
          ? value.product
          : DEFAULT_NOTIFICATION_PREFERENCES.product,
      weekly:
        typeof value.weekly === "boolean"
          ? value.weekly
          : DEFAULT_NOTIFICATION_PREFERENCES.weekly,
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
}

function NotificationsPanel() {
  const [preferences, setPreferences] =
    useState<NotificationPreferences>(readNotificationPreferences);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        NOTIFICATION_STORAGE_KEY,
        JSON.stringify(preferences),
      );
    } catch {
      // Preferences remain available for the current mount if storage is blocked.
    }
  }, [preferences]);

  const rows: {
    key: NotificationKey;
    label: string;
    description: string;
    disabled?: boolean;
  }[] = [
      {
        key: "security",
        label: "Security alerts",
        description: "Sign-ins, device changes, and other account security events.",
        disabled: true,
      },
      {
        key: "workspace",
        label: "Workspace activity",
        description: "Invitations, role changes, and member updates.",
      },
      {
        key: "product",
        label: "Product updates",
        description: "New features, improvements, and release notes.",
      },
      {
        key: "weekly",
        label: "Weekly summary",
        description: "A short recap of workspace activity every Monday.",
      },
    ];

  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="Email notifications"
        description="Choose which updates Jetic sends to your account email."
        footer={
          <span>Security alerts are always on so you do not miss account activity.</span>
        }
      >
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {rows.map((row) => (
            <div
              key={row.key}
              className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-[12.5px] font-medium text-white">{row.label}</p>
                <p className="jetic-muted mt-0.5 text-[11.5px] leading-5">
                  {row.description}
                </p>
              </div>
              <Toggle
                checked={preferences[row.key]}
                disabled={row.disabled}
                label={`Toggle ${row.label.toLowerCase()}`}
                onChange={() =>
                  setPreferences((current) => ({
                    ...current,
                    [row.key]: !current[row.key],
                  }))
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Delivery"
        description="Notifications are sent to the email address on your account."
      >
        <p className="jetic-muted text-[12px] leading-5">
          Update your sign-in email through support if notifications should go to a different
          address.
        </p>
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Dialog shell                                */
/* -------------------------------------------------------------------------- */

function AccountDialogContent({
  user,
  onSignOut,
  onClose,
}: {
  user: { name: string; email: string };
  onSignOut: () => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<AccountTab>("profile");
  const [profile, setProfile] = useState<AccountUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileAttempt, setProfileAttempt] = useState(0);

  const activeTab = ACCOUNT_TABS.find((item) => item.id === tab) ?? ACCOUNT_TABS[0];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const retryProfile = () => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileAttempt((value) => value + 1);
  };

  const updateProfile = (next: AccountUser) => {
    setProfile(next);
    useUserStore.getState().setUser(next);
    void useUserStore.getState().refreshGithub();
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const result = await apiFetch<UserEnvelope>("/v1/users/me");
        if (!cancelled) {
          setProfile(result.user);
          useUserStore.getState().setUser(result.user);
          void useUserStore.getState().refreshGithub();
        }
      } catch (cause) {
        if (!cancelled) setProfileError(errorMessage(cause));
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileAttempt]);

  const displayName = profile?.name ?? user.name;
  const displayEmail = profile?.email ?? user.email;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-dialog-title"
        className="jetic-surface flex h-[760px] max-h-[calc(100dvh_-_1.5rem)] w-full max-w-[980px] overflow-hidden rounded border border-white/10 bg-[var(--jetic-bg)] text-white shadow-2xl sm:max-h-[calc(100dvh_-_3rem)]"
      >
        <aside className="hidden w-[220px] shrink-0 flex-col border-r border-white/10 bg-[var(--jetic-well)] sm:flex">
          <div className="px-4 pb-2 pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--jetic-faint)]">
              Settings
            </p>
          </div>

          <nav aria-label="Account settings" className="flex flex-col gap-0.5 px-2">
            {ACCOUNT_TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setTab(item.id)}
                  className={`flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-[12.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${active
                    ? "bg-white/[0.08] font-medium text-white"
                    : "text-[var(--jetic-muted)] hover:bg-white/[0.04] hover:text-white"
                    }`}
                >
                  <Icon size={15} strokeWidth={1.7} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 p-3">
            <div className="mb-2 flex items-center gap-2.5 px-1">
              <Avatar
                name={displayName}
                email={displayEmail}
                image={profile?.image ?? null}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-medium text-white">
                  {displayName}
                </p>
                <p className="jetic-muted truncate text-[10.5px]">{displayEmail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className={`${secondaryButton} w-full justify-start`}
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <h2
                id="account-dialog-title"
                className="text-[18px] font-semibold tracking-tight text-white"
              >
                {activeTab.label}
              </h2>
              <p className="jetic-muted mt-1 text-[12px] leading-5">
                {activeTab.description}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close account settings"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--jetic-muted)] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <X size={16} />
            </button>
          </header>

          <div className="flex shrink-0 items-center gap-1 overflow-x-auto border-b border-white/10 px-2 py-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
            {ACCOUNT_TABS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => setTab(item.id)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${active
                    ? "border-white/15 bg-white/10 font-medium text-white"
                    : "border-transparent text-[var(--jetic-muted)] hover:bg-white/[0.04] hover:text-white"
                    }`}
                >
                  <Icon size={12} strokeWidth={1.8} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {tab === "profile" &&
              (profile ? (
                <ProfilePanel
                  user={profile}
                  onProfileChange={updateProfile}
                  onSignOut={onSignOut}
                  onNavigate={setTab}
                />
              ) : profileLoading ? (
                <PanelLoading label="Loading profile…" />
              ) : (
                <PanelError
                  message={profileError ?? "Unable to load your profile."}
                  onRetry={retryProfile}
                />
              ))}
            {tab === "devices" && <DevicesPanel />}
            {tab === "settings" && (
              <SettingsPanel
                user={profile}
                loading={profileLoading}
                error={profileError}
                onRetry={retryProfile}
                onNavigate={setTab}
                onProfileChange={updateProfile}
              />
            )}
            {tab === "privacy" && <PrivacyPanel />}
            {tab === "support" && <SupportPanel />}
            {tab === "notifications" && <NotificationsPanel />}
          </div>
        </div>
      </section>
    </div>
  );
}

export interface AccountDialogProps {
  open: boolean;
  user: { name: string; email: string };
  onSignOut: () => void;
  onClose: () => void;
}

/**
 * Account settings dialog. The profile, devices/sessions, and security activity
 * panels read and mutate real data through the authenticated browser API.
 */
export function AccountDialog({ open, user, onSignOut, onClose }: AccountDialogProps) {
  if (!open) return null;
  return <AccountDialogContent user={user} onSignOut={onSignOut} onClose={onClose} />;
}
