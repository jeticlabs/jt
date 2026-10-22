import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("insomnia");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function InsomniaComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Design the request.",
        headlineItalic: "Prove the journey.",
        body: "Insomnia is the fast path to a single call. Jetic is the repeatable path through the whole sequence.",
        cta: "Start a workflow",
        href: "/sign-up",
      }}
    />
  );
}
