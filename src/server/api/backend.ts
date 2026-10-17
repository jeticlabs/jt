import { env } from "@/lib/env";

/**
 * Privileged backend integrations. Server-only by convention —
 * never import from Client Components.
 */
export async function backendFetch<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${env.jeticApiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend ${res.status} ${path}: ${res.statusText}`);
  }

  return (await res.json()) as T;
}
