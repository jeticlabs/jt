"use client";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { listSandboxes } from "@/features/sandbox/sandbox.api";
import type { Sandbox } from "@/features/sandbox/types";
import { resolveWorkspaceBySlug } from "@/features/workspace/api";
import type { OrganizationMembership } from "@/features/workspace/types";
import { queryKeys } from "../query-keys";

/** Workspace slug → organization membership, shared by all workspace pages. */
export function useWorkspaceBySlug(workspaceSlug: string) {
  return useQuery<OrganizationMembership>({
    queryKey: queryKeys.workspace(workspaceSlug),
    queryFn: () => resolveWorkspaceBySlug(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    staleTime: 5 * 60_000,
  });
}

/**
 * Cursor-paginated sandboxes for a workspace. The organization lookup is
 * fetched through the same cache entry used by `useWorkspaceBySlug`, so the
 * overview and activity pages only resolve the slug once.
 */
export function useWorkspaceSandboxes(
  workspaceSlug: string,
  pageSize = 50,
) {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: queryKeys.workspaceSandboxes(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const membership = await queryClient.fetchQuery<OrganizationMembership>({
        queryKey: queryKeys.workspace(workspaceSlug),
        queryFn: () => resolveWorkspaceBySlug(workspaceSlug),
        staleTime: 5 * 60_000,
      });

      return listSandboxes(membership.organization.id, {
        limit: pageSize,
        ...(pageParam === null ? {} : { cursor: pageParam }),
      });
    },
    getNextPageParam: (lastPage) => lastPage.page.nextCursor ?? undefined,
  });
}

/** Convenience view over the infinite query for card/list rendering. */
export function useSandboxList(workspaceSlug: string) {
  const query = useWorkspaceSandboxes(workspaceSlug);
  const sandboxes: Sandbox[] =
    query.data?.pages.flatMap((page) => page.data) ?? [];

  return { ...query, sandboxes };
}
