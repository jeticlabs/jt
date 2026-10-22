import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("bruno");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function BrunoComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Offline was step one.",
        headlineItalic: "Source-aware is next.",
        body: "Keep collections in git with Bruno. Put the model, the workflow, and the trace there too with Jetic.",
        cta: "Model your API",
        href: "/sign-up",
      }}
    />
  );
}
