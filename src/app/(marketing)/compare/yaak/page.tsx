import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("yaak");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function YaakComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Explore in the client.",
        headlineItalic: "Record it in the repo.",
        body: "Yaak is built for the request in front of you. Jetic is built for the behavior the team has to repeat.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
