import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("postman");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function PostmanComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Keep your collections.",
        headlineItalic: "Add the behavior.",
        body: "Explore in Postman. Move the ordered, stateful journey into Jetic and keep the trace.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
