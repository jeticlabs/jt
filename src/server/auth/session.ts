// NOTE: add `import "server-only"` once the `server-only` package is installed.
// This module must only ever be imported from Server Components / Route Handlers.

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE_NAMES } from "@/lib/auth-cookie";
import type { SessionEnvelope } from "@/features/workspace/types";
import { BackendError, backendFetch } from "@/server/api/backend";

/**
 * Server-only auth helpers. The frontend never authorises agent actions or
 * simulation execution — it calls the backend, which enforces identity.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  for (const name of SESSION_COOKIE_NAMES) {
    const token = store.get(name)?.value;
    if (token) return token;
  }
  return null;
}

export interface AuthContext extends SessionEnvelope {
  readonly token: string;
}

/**
 * Validates the session against the API. `cache` keeps a product layout and
 * its pages from hitting `/v1/auth/session` more than once per request.
 */
export const getAuthContext = cache(async (): Promise<AuthContext | null> => {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const session = await backendFetch<SessionEnvelope>("/v1/auth/session", token);
    return { token, user: session.user, session: session.session };
  } catch (error) {
    if (error instanceof BackendError && error.isUnauthorized) {
      return null;
    }
    throw error;
  }
});

export async function requireAuthContext(): Promise<AuthContext> {
  const context = await getAuthContext();
  if (!context) {
    redirect("/sign-in");
  }
  return context;
}
