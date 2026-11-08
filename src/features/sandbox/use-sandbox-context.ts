"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { resolveWorkspaceBySlug } from "@/features/workspace/api";
import { errorMessage } from "@/lib/api/browser";
import { getSandboxBySlug } from "./sandbox.api";
import type { Sandbox } from "./types";

type LoadStatus = "loading" | "ready" | "error";

export interface SandboxContextState {
  readonly workspaceSlug: string;
  readonly sandboxSlug: string;
  readonly organizationId: string | null;
  readonly sandbox: Sandbox | null;
  readonly status: LoadStatus;
  readonly error: string | null;
  readonly reload: () => void;
}

/**
 * Resolves the URL slugs for a sandbox page into the organization id and the
 * full sandbox record. The API occasionally stores a sandbox by immutable id,
 * so the slug lookup endpoint accepts either the slug or the id.
 */
export function useSandboxContext(): SandboxContextState {
  const params = useParams<{
    workspaceId?: string | string[];
    sandboxId?: string | string[];
  }>();
  const workspaceSlug = Array.isArray(params?.workspaceId)
    ? (params.workspaceId[0] ?? "")
    : (params?.workspaceId ?? "");
  const sandboxSlug = Array.isArray(params?.sandboxId)
    ? (params.sandboxId[0] ?? "")
    : (params?.sandboxId ?? "");

  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [sandbox, setSandbox] = useState<Sandbox | null>(null);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!workspaceSlug || !sandboxSlug) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setStatus("loading");
      setError(null);
      try {
        const membership = await resolveWorkspaceBySlug(workspaceSlug);
        const result = await getSandboxBySlug(
          membership.organization.id,
          sandboxSlug,
        );
        if (cancelled) return;
        setOrganizationId(membership.organization.id);
        setSandbox(result.sandbox);
        setStatus("ready");
      } catch (cause) {
        if (cancelled) return;
        setStatus("error");
        setError(errorMessage(cause));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [workspaceSlug, sandboxSlug, reloadKey]);

  const incomplete = !workspaceSlug || !sandboxSlug;

  return {
    workspaceSlug,
    sandboxSlug,
    organizationId,
    sandbox,
    status: incomplete ? "error" : status,
    error: incomplete ? "This sandbox link is incomplete." : error,
    reload: () => setReloadKey((value) => value + 1),
  };
}
