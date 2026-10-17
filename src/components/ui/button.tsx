import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-colors",
        size === "sm" ? "px-4 py-1.5 text-sm" : "px-5 py-2.5 text-sm",
        variant === "primary" &&
          "bg-zinc-900 text-white dark:bg-white dark:text-black",
        variant === "secondary" &&
          "border border-black/[.08] dark:border-white/[.15]",
        variant === "ghost" && "text-zinc-600 dark:text-zinc-400",
        className
      )}
      {...props}
    />
  );
}
