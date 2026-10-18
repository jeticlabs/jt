"use client";

import { useEffect } from "react";
import { AIChatPanel, useAIChat } from "@/components/ai/search";

/**
 * A modal overlay that renders the AI chat panel for marketing pages.
 * Works alongside MarketingNavbar – both must be inside an <AIChat> provider.
 * Supports ⌘K / Ctrl+K to open and Escape to close.
 */
export function MarketingSearchModal() {
  const { open, setOpen } = useAIChat();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Open: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !open) {
        setOpen(true);
        e.preventDefault();
      }
      // Close: Escape
      if (e.key === "Escape" && open) {
        setOpen(false);
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setOpen(false)}
      />

      {/* panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="
          fixed inset-x-4 top-[10vh] z-[61]
          mx-auto w-full max-w-[640px]
          rounded-2xl border border-white/[0.10]
          jetic-surface dark shadow-2xl
          flex flex-col overflow-hidden
          animate-in fade-in slide-in-from-top-4 duration-200
          h-[70vh] max-h-[680px]
        "
      >
        <AIChatPanel />
      </div>
    </>
  );
}
