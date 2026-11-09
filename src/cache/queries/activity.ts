"use client";

import {
  useInfiniteQuery,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";

import { listActivity } from "@/features/activity/activity.api";
import type { ActivityEvent, ActivityPage } from "@/features/activity/types";
import { queryKeys, type ActivityQueryFilters } from "../query-keys";
import { useWorkspaceBySlug } from "./workspace";

/**
 * Activity history is an infinite query keyed by workspace and filters. The
 * live SSE hook mutates this exact cache entry, so the feed stays consistent
 * when navigating away and back.
 */
export function useActivityFeed(
  workspaceSlug: string,
  filters: ActivityQueryFilters = {},
) {
  const workspace = useWorkspaceBySlug(workspaceSlug);
  const organizationId = workspace.data?.organization.id ?? null;

  const query = useInfiniteQuery({
    queryKey: queryKeys.workspaceActivity(workspaceSlug, filters),
    enabled: Boolean(organizationId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      listActivity(organizationId ?? "", {
        limit: 50,
        ...(pageParam === null ? {} : { cursor: pageParam }),
        ...filters,
      }),
    getNextPageParam: (lastPage) => lastPage.page.nextCursor ?? undefined,
    staleTime: 10_000,
  });

  const events: ActivityEvent[] = [];
  const seen = new Set<string>();
  for (const page of query.data?.pages ?? []) {
    for (const event of page.data) {
      if (seen.has(event.id)) continue;
      seen.add(event.id);
      events.push(event);
    }
  }

  return {
    ...query,
    organizationId,
    workspace: workspace.data,
    workspaceError: workspace.error,
    isWorkspaceError: workspace.isError,
    events,
  };
}

/** Inserts a live event into every activity cache variant for the workspace. */
export function insertActivityEvent(
  queryClient: QueryClient,
  workspaceSlug: string,
  event: ActivityEvent,
): void {
  queryClient.setQueriesData<InfiniteData<ActivityPage>>(
    { queryKey: queryKeys.workspaceActivityRoot(workspaceSlug) },
    (current) => {
      if (!current || current.pages.length === 0) return current;
      if (
        current.pages.some((page) =>
          page.data.some((item) => item.id === event.id),
        )
      ) {
        return current;
      }

      const [first, ...rest] = current.pages;
      if (!first) return current;
      const nextFirst: ActivityPage = {
        ...first,
        data: [event, ...first.data].sort((left, right) =>
          right.createdAt.localeCompare(left.createdAt),
        ),
      };
      return { ...current, pages: [nextFirst, ...rest] };
    },
  );
}
