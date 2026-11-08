import { apiFetch } from "@/lib/api/browser";
import type { ActivityEvent, ActivityPage } from "./types";

export function listActivity(
  organizationId: string,
  query: {
    limit?: number;
    cursor?: string;
    sandboxId?: string;
    type?: string;
    source?: string;
  } = {},
): Promise<ActivityPage> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.cursor) params.set("cursor", query.cursor);
  if (query.sandboxId) params.set("sandboxId", query.sandboxId);
  if (query.type) params.set("type", query.type);
  if (query.source) params.set("source", query.source);
  const search = params.toString();
  return apiFetch<ActivityPage>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/activity${search ? `?${search}` : ""}`,
  );
}

export function syncGithubActivity(
  organizationId: string,
): Promise<{ synced: number; repositories: number }> {
  return apiFetch<{ synced: number; repositories: number }>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/activity/sync-github`,
    { method: "POST" },
  );
}

export interface ActivityStreamHandlers {
  readonly onEvent: (event: ActivityEvent) => void;
  readonly onReady?: () => void;
  readonly onError?: (error: Error) => void;
}

/**
 * Opens the authenticated SSE stream through the Next.js proxy, which adds the
 * bearer token server-side. We parse the stream manually because EventSource
 * cannot attach the proxy's session handling or custom headers.
 */
export async function openActivityStream(
  input: {
    organizationId: string;
    sandboxId?: string | null;
    type?: string | null;
    source?: string | null;
    lastEventId?: string | null;
  },
  handlers: ActivityStreamHandlers,
  signal: AbortSignal,
): Promise<void> {
  const params = new URLSearchParams();
  if (input.sandboxId) params.set("sandboxId", input.sandboxId);
  if (input.type) params.set("type", input.type);
  if (input.source) params.set("source", input.source);
  if (input.lastEventId) params.set("lastEventId", input.lastEventId);
  const search = params.toString();
  const response = await fetch(
    `/api/proxy/v1/organizations/${encodeURIComponent(input.organizationId)}/activity/stream${search ? `?${search}` : ""}`,
    {
      method: "GET",
      headers: { Accept: "text/event-stream" },
      credentials: "same-origin",
      signal,
      cache: "no-store",
    },
  );

  if (!response.ok || !response.body) {
    throw new Error(`Activity stream failed with status ${response.status}.`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let separator = buffer.indexOf("\n\n");
    while (separator >= 0) {
      const block = buffer.slice(0, separator);
      buffer = buffer.slice(separator + 2);
      separator = buffer.indexOf("\n\n");

      let eventName = "message";
      let data = "";
      for (const line of block.split("\n")) {
        if (line.startsWith(":")) continue;
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }

      if (eventName === "ready") {
        handlers.onReady?.();
        continue;
      }
      if (eventName === "error") {
        handlers.onError?.(new Error("The activity stream reported an error."));
        continue;
      }
      if (eventName === "activity" && data) {
        try {
          handlers.onEvent(JSON.parse(data) as ActivityEvent);
        } catch {
          // Ignore malformed events and keep the stream alive.
        }
      }
    }
  }
}
