import { apiFetch } from "@/lib/api/browser";
import type { Invitation, Member, PageResponse } from "./types";

export function listWorkspaceMembers(
  organizationId: string,
  limit = 100,
): Promise<PageResponse<Member>> {
  return apiFetch<PageResponse<Member>>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/members?limit=${limit}`,
  );
}

export function listWorkspaceInvitations(
  organizationId: string,
  limit = 100,
): Promise<PageResponse<Invitation>> {
  return apiFetch<PageResponse<Invitation>>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/invitations?status=pending&limit=${limit}`,
  );
}
