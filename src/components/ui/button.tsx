import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "icon" | "icon-sm" | "icon-xs";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4";

const buttonVariantsMap: Record<ButtonVariant, string> = {
  primary: "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90",
  secondary:
    "border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
  outline:
    "border bg-fd-background text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
  ghost:
    "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground",
};

const buttonSizesMap: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-3.5 text-sm",
  icon: "size-9 p-0",
  "icon-sm": "size-8 p-0",
  "icon-xs": "size-6 p-0",
};

/** Class-only variants, for buttons that need their own element. */
export function buttonVariants({
  variant = "secondary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(buttonBase, buttonVariantsMap[variant], buttonSizesMap[size], className);
}

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
