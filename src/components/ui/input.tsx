import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-zinc-400 focus:border-black/30 dark:border-white/[.15]",
        className
      )}
      {...props}
    />
  );
}
