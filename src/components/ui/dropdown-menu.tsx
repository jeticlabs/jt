"use client";

import * as React from "react";

export function DropdownMenu({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      {open ? (
        <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-black/[.08] bg-white p-1 text-sm shadow-lg dark:border-white/[.12] dark:bg-zinc-900">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-lg px-3 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06]"
    >
      {children}
    </button>
  );
}
