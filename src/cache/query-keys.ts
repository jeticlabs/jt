export interface ActivityQueryFilters {
  readonly sandboxId?: string | undefined;
  readonly type?: string | undefined;
  readonly source?: string | undefined;
}

/**
 * Central, serializable query keys. Keeping filters as primitive tuple members
 * prevents accidental cache churn from fresh filter objects on every render.
 */
export const queryKeys = {
  all: ["jetic"] as const,

  workspace: (workspaceSlug: string) =>
    [...queryKeys.all, "workspace", workspaceSlug] as const,

  workspaceSandboxes: (workspaceSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "sandboxes"] as const,

  workspaceActivityRoot: (workspaceSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "activity"] as const,

  workspaceActivity: (
    workspaceSlug: string,
    filters: ActivityQueryFilters = {},
  ) =>
    [
      ...queryKeys.workspaceActivityRoot(workspaceSlug),
      filters.sandboxId ?? null,
      filters.type ?? null,
      filters.source ?? null,
    ] as const,

  sandbox: (workspaceSlug: string, sandboxSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "sandbox", sandboxSlug] as const,
} as const;
