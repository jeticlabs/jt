import type { InvitationLookup } from "@/features/workspace/types";
import { env } from "@/lib/env";

/**
 * Public invitation lookup used by the accept page. Unlike `/api/proxy`, this
 * runs server-side and does not require a signed-in session because the API
 * exposes the lookup route publicly.
 */
export async function lookupInvitation(token: string): Promise<InvitationLookup | null> {
  const response = await fetch(
    `${env.jeticApiUrl}/v1/invitations/${encodeURIComponent(token)}`,
    { cache: "no-store" },
  );

  if (!response.ok) return null;
  return (await response.json()) as InvitationLookup;
}
