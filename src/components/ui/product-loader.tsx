"use client";

import { JeticAnimatedIcon } from "@/components/jetic-animated-icon";

interface ProductLoaderProps {
  /** Accessible description of what is loading. */
  label?: string;
  /** Full-viewport (initial navigation) vs. content-area (nested navigation). */
  fullScreen?: boolean;
}

/**
 * Branded loading state shared by every product route. It mirrors the
 * not-found treatment so a slow request still feels like Jetic.
 */
export function ProductLoader({ label = "Loading", fullScreen = true }: ProductLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`jetic-surface flex w-full items-center justify-center ${
        fullScreen ? "min-h-screen" : "min-h-full"
      }`}
    >
      <JeticAnimatedIcon size={22} className="text-white" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
