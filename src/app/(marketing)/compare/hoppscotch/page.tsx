import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("hoppscotch");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function HoppscotchComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Fast calls now.",
        headlineItalic: "Stable journeys later.",
        body: "Send the first request in Hoppscotch. Keep the settled sequence and its evidence in Jetic.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
