"use client";

import type { ReactNode } from "react";
import type { Root } from "fumadocs-core/page-tree";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { AIChat, AIChatPanel, useAIChat } from "@/components/ai/search";
import { baseOptions } from "@/lib/layout.shared";

function LayoutWithChat({ tree, children }: { tree: Root; children: ReactNode }) {
  const { open, setOpen } = useAIChat();

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      containerProps={{ className: "jetic-surface dark" }}
      aiChat={{ open, onOpenChange: setOpen, panel: <AIChatPanel /> }}
    >
      {children}
    </DocsLayout>
  );
}

/** Docs layout plus the Ask AI panel; `useAIChat()` toggles it from any child. */
export function DocsAIChatLayout({
  tree,
  children,
}: {
  tree: Root;
  children: ReactNode;
}) {
  return (
    <AIChat>
      <LayoutWithChat tree={tree}>{children}</LayoutWithChat>
    </AIChat>
  );
}
