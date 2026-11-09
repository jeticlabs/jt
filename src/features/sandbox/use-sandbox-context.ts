"use client";

import { useParams } from "next/navigation";

import {
  useSandboxBySlug,
  useWorkspaceBySlug,
} from "@/cache";
import { errorMessage } from "@/lib/api/browser";
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
 * full sandbox record. Both lookups are shared through TanStack Query so the
 * sandbox overview, source, and settings pages reuse the same cached data.
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

  const workspaceQuery = useWorkspaceBySlug(workspaceSlug);
  const sandboxQuery = useSandboxBySlug(workspaceSlug, sandboxSlug);

  const incomplete = !workspaceSlug || !sandboxSlug;
  const sandbox = sandboxQuery.data?.sandbox ?? null;
  const organizationId = workspaceQuery.data?.organization.id ?? null;

  let status: LoadStatus = "ready";
  if (incomplete || workspaceQuery.isError || sandboxQuery.isError) {
    status = "error";
  } else if (
    workspaceQuery.isPending ||
    sandboxQuery.isPending ||
    (sandboxQuery.isFetching && !sandbox)
  ) {
    status = "loading";
  } else if (!sandbox) {
    status = "error";
  }

  const error =
    incomplete
      ? "This sandbox link is incomplete."
      : workspaceQuery.isError
        ? errorMessage(workspaceQuery.error)
        : sandboxQuery.isError
          ? errorMessage(sandboxQuery.error)
          : !sandbox && status === "error"
            ? "The sandbox may have been deleted or you may not have access."
            : null;

  return {
    workspaceSlug,
    sandboxSlug,
    organizationId,
    sandbox,
    status,
    error,
    reload: () => {
      void workspaceQuery.refetch();
      void sandboxQuery.refetch();
    },
  };
}
