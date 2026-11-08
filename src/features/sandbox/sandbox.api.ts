import { apiFetch } from "@/lib/api/browser";
import type {
  CreateSandboxPayload,
  Sandbox,
  SandboxEnvelope,
  SandboxSource,
  SandboxSourceFile,
} from "./types";

export function createSandbox(
  organizationId: string,
  payload: CreateSandboxPayload,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes`,
    { method: "POST", body: payload },
  );
}

export function getSandbox(
  organizationId: string,
  sandboxId: string,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}`,
  );
}

export function getSandboxBySlug(
  organizationId: string,
  slug: string,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/slug/${encodeURIComponent(slug)}`,
  );
}

export function getSandboxSource(
  organizationId: string,
  sandboxId: string,
): Promise<SandboxSource> {
  return apiFetch<SandboxSource>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}/source`,
  );
}

export function getSandboxSourceFile(
  organizationId: string,
  sandboxId: string,
  path: string,
): Promise<SandboxSourceFile> {
  return apiFetch<SandboxSourceFile>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}/source/file?path=${encodeURIComponent(path)}`,
  );
}

export function getSandboxStatus(
  organizationId: string,
  sandboxId: string,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}/status`,
  );
}

export function startSandbox(
  organizationId: string,
  sandboxId: string,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}/start`,
    { method: "POST" },
  );
}

export function stopSandbox(
  organizationId: string,
  sandboxId: string,
): Promise<SandboxEnvelope> {
  return apiFetch<SandboxEnvelope>(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes/${encodeURIComponent(sandboxId)}/stop`,
    { method: "POST" },
  );
}

export function listSandboxes(
  organizationId: string,
  query: { limit?: number; cursor?: string; status?: string } = {},
): Promise<{ data: Sandbox[]; page: { nextCursor: string | null; hasMore: boolean } }> {
  const params = new URLSearchParams();
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.cursor) params.set("cursor", query.cursor);
  if (query.status) params.set("status", query.status);
  const search = params.toString();
  return apiFetch(
    `/v1/organizations/${encodeURIComponent(organizationId)}/sandboxes${search ? `?${search}` : ""}`,
  );
}
