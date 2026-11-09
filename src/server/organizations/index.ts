import { cache } from "react";

import type {
  Invitation,
  Member,
  OrganizationMembership,
  PageResponse,
  WorkspaceSummary,
} from "@/features/workspace/types";
import type {
  MemberPermissions,
  MyPermissions,
} from "@/features/permissions/types";
import type { Sandbox } from "@/features/sandbox/types";
import { BackendError, backendFetch } from "@/server/api/backend";

const ORGANIZATIONS_PAGE_SIZE = 100;
const MEMBERS_PAGE_SIZE = 100;

function toWorkspace(membership: OrganizationMembership): WorkspaceSummary {
  return {
    id: membership.organization.id,
    name: membership.organization.name,
    slug: membership.organization.slug,
    plan: membership.organization.plan,
    logo: membership.organization.logo,
    role: membership.role,
    memberId: membership.memberId,
  };
}

/** All workspaces the signed-in user belongs to (newest first). */
export const listWorkspaces = cache(async (token: string): Promise<WorkspaceSummary[]> => {
  const page = await backendFetch<PageResponse<OrganizationMembership>>(
    `/v1/organizations?limit=${ORGANIZATIONS_PAGE_SIZE}`,
    token,
  );
  return page.data.map(toWorkspace);
});

/**
 * Resolves a workspace slug from the URLs the user can actually access.
 * The workspace layout uses the same list for membership validation, so this
 * never leaks the existence of an organization the caller is not part of.
 */
export const resolveWorkspace = cache(
  async (token: string, slug: string): Promise<WorkspaceSummary | null> => {
    const workspaces = await listWorkspaces(token);
    return workspaces.find((workspace) => workspace.slug === slug) ?? null;
  },
);

/** Finds a workspace by immutable id (used to canonicalise old URLs). */
export const findWorkspaceById = cache(
  async (token: string, id: string): Promise<WorkspaceSummary | null> => {
    const workspaces = await listWorkspaces(token);
    return workspaces.find((workspace) => workspace.id === id) ?? null;
  },
);

export async function getOrganizationBySlug(
  token: string,
  slug: string,
): Promise<OrganizationMembership | null> {
  try {
    return await backendFetch<OrganizationMembership>(
      `/v1/organizations/slug/${encodeURIComponent(slug)}`,
      token,
    );
  } catch (error) {
    if (error instanceof BackendError && (error.isNotFound || error.isForbidden)) {
      return null;
    }
    throw error;
  }
}

export async function listWorkspaceMembers(
  token: string,
  organizationId: string,
): Promise<Member[]> {
  const page = await backendFetch<PageResponse<Member>>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/members?limit=${MEMBERS_PAGE_SIZE}`,
    token,
  );
  return page.data;
}

export async function listPendingInvitations(
  token: string,
  organizationId: string,
): Promise<Invitation[]> {
  const page = await backendFetch<PageResponse<Invitation>>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/invitations?status=pending&limit=${MEMBERS_PAGE_SIZE}`,
    token,
  );
  return page.data;
}

export async function getMyPermissions(
  token: string,
  organizationId: string,
  sandboxId?: string | null,
): Promise<MyPermissions> {
  const query = sandboxId
    ? `?sandboxId=${encodeURIComponent(sandboxId)}`
    : "";
  return backendFetch<MyPermissions>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/permissions/me${query}`,
    token,
  );
}

export async function getMemberPermissions(
  token: string,
  organizationId: string,
  memberId: string,
  sandboxId?: string | null,
): Promise<MemberPermissions> {
  const query = sandboxId
    ? `?sandboxId=${encodeURIComponent(sandboxId)}`
    : "";
  return backendFetch<MemberPermissions>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/permissions/members/${encodeURIComponent(memberId)}${query}`,
    token,
  );
}

export async function listWorkspaceSandboxes(
  token: string,
  organizationId: string,
): Promise<Sandbox[]> {
  const page = await backendFetch<
    PageResponse<Sandbox>
  >(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes?limit=100`,
    token,
  );
  return page.data;
}
