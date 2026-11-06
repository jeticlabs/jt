import Link from "next/link";

import { JeticIcon } from "@/components/jetic-icon";
import type { InvitationLookup, OrganizationRole } from "@/features/workspace/types";
import { getAuthContext } from "@/server/auth/session";
import { lookupInvitation } from "@/server/invitations";

import { AcceptInvitationClient } from "./accept-invitation-client";

export const instant = false;

const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "Owner",
  admin: "Administrator",
  member: "Member",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <main className="jetic-surface flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[460px]">
        <div className="flex justify-center">
          <JeticIcon size={20} />
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 bg-[var(--jetic-recess)] p-6 text-white shadow-2xl sm:p-8">
          {children}
        </div>
        <p className="jetic-muted mt-6 text-center text-[12px]">
          Jetic · The agentic API workspace
        </p>
      </div>
    </main>
  );
}

function Unavailable({ title, message }: { title: string; message: string }) {
  return (
    <Frame>
      <h1 className="text-[24px] font-semibold tracking-tight">{title}</h1>
      <p className="jetic-muted mt-3 text-[13.5px] leading-6">{message}</p>
      <Link href="/" className="jetic-btn-light mt-6 flex h-10 items-center justify-center text-[13px]">
        Go to Jetic
      </Link>
    </Frame>
  );
}

function Details({ invitation }: { invitation: InvitationLookup }) {
  return (
    <dl className="mt-5 grid gap-2.5 text-[13px]">
      <div className="flex items-baseline justify-between gap-6">
        <dt className="jetic-muted">Workspace</dt>
        <dd className="text-right font-medium text-white">{invitation.organizationName}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-6">
        <dt className="jetic-muted">Role</dt>
        <dd className="text-right font-medium text-white">{ROLE_LABELS[invitation.role]}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-6">
        <dt className="jetic-muted">Invited email</dt>
        <dd className="break-all text-right font-medium text-white">{invitation.email}</dd>
      </div>
      <div className="flex items-baseline justify-between gap-6">
        <dt className="jetic-muted">Expires</dt>
        <dd className="text-right font-medium text-white">{formatDate(invitation.expiresAt)}</dd>
      </div>
    </dl>
  );
}

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  if (!token) {
    return (
      <Unavailable
        title="Invitation link is incomplete"
        message="This link is missing its invitation token. Ask the person who invited you to send it again."
      />
    );
  }

  const invitation = await lookupInvitation(token);

  if (!invitation) {
    return (
      <Unavailable
        title="Invitation not found"
        message="This invitation may have expired, been cancelled, or already been used."
      />
    );
  }

  if (invitation.status !== "pending" || invitation.expired) {
    return (
      <Unavailable
        title="Invitation not available"
        message={
          invitation.expired
            ? "This invitation has expired. Ask a workspace owner to send you a new one."
            : "This invitation has already been used or cancelled."
        }
      />
    );
  }

  const auth = await getAuthContext();
  const next = `/accept-invitation?token=${encodeURIComponent(token)}`;

  return (
    <Frame>
      <p className="jetic-muted text-[11px] font-semibold uppercase tracking-[0.14em]">
        Workspace invitation
      </p>
      <h1 className="mt-3 text-[24px] font-semibold leading-tight tracking-tight">
        Join {invitation.organizationName}
      </h1>
      <p className="jetic-muted mt-3 text-[13.5px] leading-6">
        You have been invited to collaborate in this workspace on Jetic.
      </p>

      <Details invitation={invitation} />

      {auth ? (
        <AcceptInvitationClient
          token={token}
          organizationId={invitation.organizationId}
          organizationName={invitation.organizationName}
          role={invitation.role}
          invitedEmail={invitation.email}
          signedInEmail={auth.user.email}
        />
      ) : (
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="jetic-muted text-[12.5px] leading-5">
            Sign in as <span className="text-[var(--jetic-emphasis)]">{invitation.email}</span> to
            accept. If you do not have an account yet, create one with the same email address.
          </p>
          <Link
            href={`/sign-in?next=${encodeURIComponent(next)}`}
            className="jetic-btn-light mt-4 flex h-10 items-center justify-center text-[13px]"
          >
            Sign in to accept
          </Link>
          <Link
            href={`/sign-up?next=${encodeURIComponent(next)}`}
            className="jetic-muted mt-3 flex h-9 items-center justify-center text-[12.5px] font-medium transition-colors hover:text-white"
          >
            Create an account
          </Link>
        </div>
      )}
    </Frame>
  );
}
