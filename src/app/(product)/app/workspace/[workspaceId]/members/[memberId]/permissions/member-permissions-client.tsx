"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { PermissionEditor } from "@/components/ui/permissions/permission-editor";
import { useMemberPermissions } from "@/cache";
import { queryKeys } from "@/cache/query-keys";
import { updateMemberPermissions } from "@/features/permissions/api";
import type { MemberPermissions } from "@/features/permissions/types";
import type { Sandbox } from "@/features/sandbox/types";
import { errorMessage } from "@/lib/api/browser";

export function MemberPermissionsClient({
  organizationId,
  workspaceSlug,
  memberId,
  initialPermissions,
  sandboxes,
}: {
  organizationId: string;
  workspaceSlug: string;
  memberId: string;
  initialPermissions: MemberPermissions;
  sandboxes: readonly Sandbox[];
}) {
  const queryClient = useQueryClient();
  const [sandboxId, setSandboxId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const query = useMemberPermissions(
    workspaceSlug,
    memberId,
    sandboxId,
    sandboxId === null ? initialPermissions : undefined,
  );

  const data = query.data ?? initialPermissions;

  const save = async (
    overrides: Readonly<Record<string, boolean | null>>,
    scopeSandboxId: string | null,
  ) => {
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const result = await updateMemberPermissions(
        organizationId,
        memberId,
        {
          sandboxId: scopeSandboxId,
          overrides,
        },
      );
      queryClient.setQueryData(
        queryKeys.memberPermissions(workspaceSlug, memberId, scopeSandboxId),
        result.permissions,
      );
      await queryClient.invalidateQueries({
        queryKey: queryKeys.memberPermissionsRoot(workspaceSlug, memberId),
      });
      setNotice(
        result.changes.length === 0
          ? "No permission changes were needed."
          : `${result.changes.length} permission ${
              result.changes.length === 1 ? "change" : "changes"
            } saved.`,
      );
    } catch (cause) {
      setError(errorMessage(cause));
    } finally {
      setSaving(false);
    }
  };

  if (query.isError && !query.data) {
    return (
      <main className="jetic-surface min-h-full bg-[var(--jetic-well)] px-5 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <p role="alert" className="text-[12.5px] text-red-400">
            {errorMessage(query.error)}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="jetic-surface min-h-full w-full bg-[var(--jetic-well)] px-5 pb-16 pt-5 text-white antialiased sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
        <PermissionEditor
          data={data}
          workspaceSlug={workspaceSlug}
          sandboxes={sandboxes}
          selectedSandboxId={sandboxId}
          onSandboxChange={(next) => {
            setSandboxId(next);
            setError(null);
            setNotice(null);
          }}
          onSave={save}
          saving={saving}
          error={error}
          notice={notice}
        />
      </div>
    </main>
  );
}
