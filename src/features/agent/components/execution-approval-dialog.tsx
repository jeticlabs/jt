"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ExecutionApprovalDialog({
  open,
  toolName,
  onApprove,
  onDeny,
}: {
  open: boolean;
  toolName: string;
  onApprove: () => void;
  onDeny: () => void;
}) {
  return (
    <Dialog open={open} onClose={onDeny}>
      <h2 className="text-base font-semibold">Approve execution?</h2>
      <p className="mt-2 text-sm text-zinc-600">
        The agent wants to run <strong>{toolName}</strong>. Approvals are
        enforced by the backend — this UI only collects intent.
      </p>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={onDeny}>
          Deny
        </Button>
        <Button onClick={onApprove}>Approve</Button>
      </div>
    </Dialog>
  );
}
