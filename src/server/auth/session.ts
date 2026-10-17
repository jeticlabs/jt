// NOTE: add `import "server-only"` once the `server-only` package is installed.
// This module must only ever be imported from Server Components / Route Handlers.

import { cookies } from "next/headers";

/**
 * Server-only auth helpers. The frontend never authorises agent actions or
 * simulation execution — it calls the backend, which enforces identity.
 */
export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get("jetic_session")?.value ?? null;
}

export async function requireSessionToken(): Promise<string> {
  const token = await getSessionToken();
  if (!token) {
    throw new Error("Unauthorized: missing session");
  }
  return token;
}
