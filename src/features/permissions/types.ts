import type { Member, OrganizationRole } from "@/features/workspace/types";

export type PermissionScope = "workspace" | "sandbox";
export type PermissionKind = "page" | "action" | "management";

export interface PermissionEntry {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly group: string;
  readonly groupLabel: string;
  readonly scope: PermissionScope;
  readonly kind: PermissionKind;
  readonly default: boolean;
  readonly override: boolean | null;
  readonly effective: boolean;
  readonly editable: boolean;
  readonly grantable: boolean;
  readonly lockedReason: string | null;
}

export interface PermissionGroup {
  readonly id: string;
  readonly label: string;
  readonly permissions: readonly PermissionEntry[];
}

export interface MemberPermissions {
  readonly member: Member;
  readonly sandboxId: string | null;
  readonly role: OrganizationRole;
  readonly canEdit: boolean;
  readonly canView: boolean;
  readonly updatedBy: { readonly id: string; readonly name: string } | null;
  readonly updatedAt: string | null;
  readonly groups: readonly PermissionGroup[];
}

export interface MyPermissions {
  readonly organizationId: string;
  readonly memberId: string;
  readonly role: OrganizationRole;
  readonly sandboxId: string | null;
  readonly permissions: Readonly<Record<string, boolean>>;
}

export interface PermissionCatalog {
  readonly role: OrganizationRole;
  readonly groups: readonly PermissionGroup[];
}

export interface PermissionChange {
  readonly permission: string;
  readonly allowed: boolean | null;
  readonly previous: boolean | null;
}

export interface UpdateMemberPermissionsResponse {
  readonly permissions: MemberPermissions;
  readonly changes: readonly PermissionChange[];
}
