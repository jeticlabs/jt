import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("readyapi");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function ReadyApiComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Enterprise breadth.",
        headlineItalic: "Or source-first focus?",
        body: "Keep the suite for heterogeneous protocols. Use Jetic when the Express journey should come from the code.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
