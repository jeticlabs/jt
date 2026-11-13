"use client";

import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { getMyPermissions, getMemberPermissions } from "@/features/permissions/api";
import type {
  MemberPermissions,
  MyPermissions,
} from "@/features/permissions/types";
import {
  dismissRepositoryAlert,
  fetchRepositoryAlerts,
  markRepositoryAlertImported,
} from "@/features/github/repository-alerts.api";
import type { RepositoryAlert } from "@/features/github/types";
import { getSandboxBySlug, listSandboxes } from "@/features/sandbox/sandbox.api";
import type { Sandbox } from "@/features/sandbox/types";
import { resolveWorkspaceBySlug } from "@/features/workspace/api";
import {
  listWorkspaceInvitations,
  listWorkspaceMembers,
} from "@/features/workspace/members.api";
import type {
  Invitation,
  Member,
  OrganizationMembership,
} from "@/features/workspace/types";
import {
  selectGithubConnected,
  selectGithubReady,
  useUserStore,
} from "@/context";
import { queryKeys } from "../query-keys";

/** Workspace slug → organization membership, shared by all workspace pages. */
export function useWorkspaceBySlug(
  workspaceSlug: string,
  initialData?: OrganizationMembership,
) {
  return useQuery<OrganizationMembership>({
    queryKey: queryKeys.workspace(workspaceSlug),
    queryFn: () => resolveWorkspaceBySlug(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    staleTime: 5 * 60_000,
    ...(initialData ? { initialData } : {}),
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

/** Fetches the shared workspace membership before a dependent query runs. */
async function workspaceId(
  queryClient: ReturnType<typeof useQueryClient>,
  workspaceSlug: string,
): Promise<string> {
  const membership = await queryClient.fetchQuery<OrganizationMembership>({
    queryKey: queryKeys.workspace(workspaceSlug),
    queryFn: () => resolveWorkspaceBySlug(workspaceSlug),
    staleTime: 5 * 60_000,
  });
  return membership.organization.id;
}

export function useWorkspaceMembers(
  workspaceSlug: string,
  initialData?: readonly Member[],
) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.workspaceMembers(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      const page = await listWorkspaceMembers(organizationId);
      return page.data;
    },
    ...(initialData ? { initialData: [...initialData] } : {}),
    staleTime: 30_000,
  });

  return { ...query, members: query.data ?? [] };
}

export function useWorkspaceInvitations(
  workspaceSlug: string,
  initialData?: readonly Invitation[],
) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.workspaceInvitations(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      const page = await listWorkspaceInvitations(organizationId);
      return page.data;
    },
    ...(initialData ? { initialData: [...initialData] } : {}),
    staleTime: 30_000,
  });

  return { ...query, invitations: query.data ?? [] };
}

export function useWorkspacePermissions(
  workspaceSlug: string,
  initialData?: MyPermissions,
) {
  const queryClient = useQueryClient();
  return useQuery<MyPermissions>({
    queryKey: queryKeys.workspacePermissions(workspaceSlug),
    enabled: workspaceSlug.length > 0,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      return getMyPermissions(organizationId);
    },
    ...(initialData ? { initialData } : {}),
    staleTime: 30_000,
  });
}

export function useSandboxBySlug(workspaceSlug: string, sandboxSlug: string) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: queryKeys.sandbox(workspaceSlug, sandboxSlug),
    enabled: workspaceSlug.length > 0 && sandboxSlug.length > 0,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      return getSandboxBySlug(organizationId, sandboxSlug);
    },
    staleTime: 15_000,
  });
}

export function useSandboxPermissions(
  workspaceSlug: string,
  sandboxId: string | null,
  initialData?: MyPermissions,
) {
  const queryClient = useQueryClient();
  return useQuery<MyPermissions>({
    queryKey: queryKeys.sandboxPermissions(workspaceSlug, sandboxId),
    enabled: workspaceSlug.length > 0 && sandboxId !== null,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      return getMyPermissions(organizationId, sandboxId);
    },
    ...(initialData ? { initialData } : {}),
    staleTime: 30_000,
  });
}

export function useMemberPermissions(
  workspaceSlug: string,
  memberId: string,
  sandboxId: string | null,
  initialData?: MemberPermissions,
) {
  const queryClient = useQueryClient();
  return useQuery<MemberPermissions>({
    queryKey: queryKeys.memberPermissions(workspaceSlug, memberId, sandboxId),
    enabled: workspaceSlug.length > 0 && memberId.length > 0,
    queryFn: async () => {
      const organizationId = await workspaceId(queryClient, workspaceSlug);
      return getMemberPermissions(organizationId, memberId, sandboxId);
    },
    ...(initialData ? { initialData } : {}),
    staleTime: 15_000,
  });
}

/**
 * Polls for GitHub repositories discovered after the user's baseline scan.
 * Existing repositories are filtered out by the API, so this only surfaces
 * genuinely new repositories.
 */
export function useRepositoryAlerts(workspaceSlug: string) {
  const queryClient = useQueryClient();
  const connected = useUserStore(selectGithubConnected);
  const ready = useUserStore(selectGithubReady);
  const queryKey = queryKeys.repositoryAlerts(workspaceSlug);

  const query = useQuery<RepositoryAlert[]>({
    queryKey,
    enabled: connected && ready && workspaceSlug.length > 0,
    queryFn: fetchRepositoryAlerts,
    staleTime: 30_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  const dismiss = async (alertId: string) => {
    await dismissRepositoryAlert(alertId);
    queryClient.setQueryData<RepositoryAlert[]>(queryKey, (current) =>
      (current ?? []).filter((alert) => alert.id !== alertId),
    );
  };

  const markImported = async (repositoryId: string) => {
    await markRepositoryAlertImported(repositoryId);
    queryClient.setQueryData<RepositoryAlert[]>(queryKey, (current) =>
      (current ?? []).filter(
        (alert) => alert.repository.id !== repositoryId,
      ),
    );
  };

  return {
    ...query,
    alerts: query.data ?? [],
    dismiss,
    markImported,
  };
}
