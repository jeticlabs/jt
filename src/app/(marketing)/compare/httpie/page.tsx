import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("httpie");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function HttpieComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Stay in the terminal.",
        headlineItalic: "Raise the unit.",
        body: "HTTPie keeps a single call readable. Jetic keeps the whole ordered journey readable, runnable, and reviewable.",
        cta: "Run a workflow",
        href: "/sign-up",
      }}
    />
  );
}
