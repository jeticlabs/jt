"use client";

import type { ReactNode } from "react";
import { AIChat } from "@/components/ai/search";
import { MarketingSearchModal } from "@/components/cli-ui";

/**
 * Wraps the CLI marketing page with the AI chat provider so
 * MarketingNavbar's Search button can open the AI chat modal.
 */
export function CliPageShell({ children }: { children: ReactNode }) {
  return (
    <AIChat>
      {children}
      <MarketingSearchModal />
    </AIChat>
  );
}
