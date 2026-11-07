import { apiFetch } from "@/lib/api/browser";
import type { OrganizationMembership } from "./types";

/** Resolves a workspace URL slug to the organization membership payload. */
export function resolveWorkspaceBySlug(slug: string): Promise<OrganizationMembership> {
  return apiFetch<OrganizationMembership>(
    `/v1/organizations/slug/${encodeURIComponent(slug)}`,
  );
}
