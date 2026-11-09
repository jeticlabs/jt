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

  workspaceMembers: (workspaceSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "members"] as const,

  workspaceInvitations: (workspaceSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "invitations"] as const,

  workspacePermissions: (workspaceSlug: string) =>
    [...queryKeys.workspace(workspaceSlug), "permissions"] as const,

  sandboxPermissions: (workspaceSlug: string, sandboxId: string | null) =>
    [
      ...queryKeys.workspace(workspaceSlug),
      "sandbox-permissions",
      sandboxId ?? "none",
    ] as const,

  memberPermissions: (
    workspaceSlug: string,
    memberId: string,
    sandboxId: string | null,
  ) =>
    [
      ...queryKeys.workspace(workspaceSlug),
      "member-permissions",
      memberId,
      sandboxId ?? "workspace",
    ] as const,

  memberPermissionsRoot: (workspaceSlug: string, memberId: string) =>
    [
      ...queryKeys.workspace(workspaceSlug),
      "member-permissions",
      memberId,
    ] as const,

  permissionCatalog: (workspaceSlug: string, sandboxId: string | null) =>
    [
      ...queryKeys.workspace(workspaceSlug),
      "permission-catalog",
      sandboxId ?? "workspace",
    ] as const,

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
