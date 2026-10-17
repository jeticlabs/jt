import * as React from "react";

export function Tooltip({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) {
  return (
    <span className="group relative inline-flex" title={content}>
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded-lg bg-black px-2 py-1 text-xs text-white group-hover:block dark:bg-white dark:text-black">
        {content}
      </span>
    </span>
  );
}
