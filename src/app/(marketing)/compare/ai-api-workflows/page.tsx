import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("ai-api-workflows");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function AiApiWorkflowsComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Generate the draft.",
        headlineItalic: "Commit the contract.",
        body: "AI can suggest the first version. Jetic validates it, you review it, and the runner executes the saved file.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
