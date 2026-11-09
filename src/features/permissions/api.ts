import { apiFetch } from "@/lib/api/browser";
import type {
  MemberPermissions,
  MyPermissions,
  PermissionCatalog,
  UpdateMemberPermissionsResponse,
} from "./types";

const base = (organizationId: string) =>
  `/v1/organizations/${encodeURIComponent(organizationId)}/permissions`;

export function getMyPermissions(
  organizationId: string,
  sandboxId?: string | null,
): Promise<MyPermissions> {
  const query = sandboxId
    ? `?sandboxId=${encodeURIComponent(sandboxId)}`
    : "";
  return apiFetch<MyPermissions>(`${base(organizationId)}/me${query}`);
}

export function getPermissionCatalog(
  organizationId: string,
  sandboxId?: string | null,
): Promise<PermissionCatalog> {
  const query = sandboxId
    ? `?sandboxId=${encodeURIComponent(sandboxId)}`
    : "";
  return apiFetch<PermissionCatalog>(`${base(organizationId)}/catalog${query}`);
}

export function getMemberPermissions(
  organizationId: string,
  memberId: string,
  sandboxId?: string | null,
): Promise<MemberPermissions> {
  const query = sandboxId
    ? `?sandboxId=${encodeURIComponent(sandboxId)}`
    : "";
  return apiFetch<MemberPermissions>(
    `${base(organizationId)}/members/${encodeURIComponent(memberId)}${query}`,
  );
}

export function updateMemberPermissions(
  organizationId: string,
  memberId: string,
  input: {
    readonly sandboxId: string | null;
    readonly overrides: Readonly<Record<string, boolean | null>>;
  },
): Promise<UpdateMemberPermissionsResponse> {
  return apiFetch<UpdateMemberPermissionsResponse>(
    `${base(organizationId)}/members/${encodeURIComponent(memberId)}`,
    {
      method: "PUT",
      body: input,
    },
  );
}
