import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("karate");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function KarateComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "A DSL is expressive.",
        headlineItalic: "A model is shared.",
        body: "Jetic keeps the API description separate from the test, so every tool reads the same source.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
