"use client";

import { useEffect, useRef, useState } from "react";

import { openActivityStream } from "./activity.api";
import type { ActivityEvent } from "./types";

/**
 * Live workspace/sandbox activity subscription. The stream is reconnected with
 * the last event id so events that arrived during a short disconnect are
 * replayed from PostgreSQL.
 */
export function useActivityStream(input: {
  organizationId: string | null;
  sandboxId?: string | null;
  type?: string | null;
  source?: string | null;
  enabled?: boolean;
  onEvent: (event: ActivityEvent) => void;
}): { connected: boolean } {
  const { organizationId, sandboxId, type, source, enabled = true, onEvent } = input;
  const [connected, setConnected] = useState(false);
  const onEventRef = useRef(onEvent);
  const lastEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!organizationId || !enabled) {
      return;
    }

    const controller = new AbortController();
    let retry: number | null = null;
    let stopped = false;

    const connect = async () => {
      try {
        setConnected(false);
        await openActivityStream(
          {
            organizationId,
            sandboxId,
            type,
            source,
            lastEventId: lastEventIdRef.current,
          },
          {
            onEvent: (event) => {
              lastEventIdRef.current = event.id;
              onEventRef.current(event);
            },
            onReady: () => setConnected(true),
          },
          controller.signal,
        );
      } catch {
        if (stopped) return;
        setConnected(false);
        retry = window.setTimeout(() => {
          void connect();
        }, 5_000);
      }
    };

    void connect();

    return () => {
      stopped = true;
      controller.abort();
      if (retry !== null) window.clearTimeout(retry);
    };
  }, [organizationId, sandboxId, type, source, enabled]);

  return { connected: connected && Boolean(organizationId && enabled) };
}
