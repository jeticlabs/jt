import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("ai-coding-agents");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function AiCodingAgentsComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Let the agent author.",
        headlineItalic: "Let the runner prove.",
        body: "Connect over MCP for fast authoring, then execute the saved workflow with no model in the loop.",
        cta: "Connect Jetic",
        href: "/sign-up",
      }}
    />
  );
}
