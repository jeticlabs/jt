"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { OrganizationRole } from "@/features/workspace/types";
import { apiFetch, errorMessage } from "@/lib/api/browser";

const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  member: "Member",
};

export function AcceptInvitationClient({
  token,
  organizationId,
  organizationName,
  role,
  invitedEmail,
  signedInEmail,
}: {
  token: string;
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
  invitedEmail: string;
  signedInEmail: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [declined, setDeclined] = useState(false);

  const close = () => {
    router.push("/app");
    router.refresh();
  };

  const accept = async () => {
    if (busy) return;
    setBusy("accept");
    setError(null);
    try {
      await apiFetch(`/v1/invitations/${encodeURIComponent(token)}/accept`, {
        method: "POST",
      });
      try {
        await apiFetch("/v1/auth/session/active-organization", {
          method: "POST",
          body: { organizationId },
        });
      } catch {
        // The invitation is accepted regardless; /app will pick a workspace.
      }
      close();
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(null);
    }
  };

  const reject = async () => {
    if (busy) return;
    setBusy("reject");
    setError(null);
    try {
      await apiFetch(`/v1/invitations/${encodeURIComponent(token)}/reject`, {
        method: "POST",
      });
      setDeclined(true);
      setBusy(null);
    } catch (cause) {
      setError(errorMessage(cause));
      setBusy(null);
    }
  };

  if (declined) {
    return (
      <div className="mt-6 border-t border-white/10 pt-5">
        <p role="status" className="text-[13px] text-[var(--jetic-emphasis)]">
          Invitation declined.
        </p>
        <Link href="/app" className="jetic-btn-light mt-4 flex h-10 items-center justify-center text-[13px]">
          Go to Jetic
        </Link>
      </div>
    );
  }

  const emailMismatch =
    signedInEmail.trim().toLowerCase() !== invitedEmail.trim().toLowerCase();

  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="jetic-muted text-[12.5px]">
        Signed in as <span className="text-[var(--jetic-emphasis)]">{signedInEmail}</span>
      </p>

      {emailMismatch && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-[12.5px] leading-5 text-amber-200"
        >
          This invitation was sent to {invitedEmail}. Sign in with that email address to
          accept it.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-[12.5px] leading-5 text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={busy !== null || emailMismatch}
        onClick={() => void accept()}
        className="jetic-btn-light mt-4 flex h-10 w-full items-center justify-center text-[13px] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy === "accept" ? "Accepting…" : `Join ${organizationName} as ${ROLE_LABELS[role]}`}
      </button>
      <button
        type="button"
        disabled={busy !== null}
        onClick={() => void reject()}
        className="jetic-muted mt-3 h-9 w-full text-[12.5px] font-medium transition-colors hover:text-white disabled:opacity-40"
      >
        {busy === "reject" ? "Declining…" : "Decline invitation"}
      </button>
    </div>
  );
}
