import { MarketingLanding } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { comparePage, getCompareTool } from "../_data/tools";

const tool = getCompareTool("rest-assured");

export const metadata: Metadata = {
  title: `Jetic vs ${tool.name}`,
  description: tool.description,
};

export default function RestAssuredComparePage() {
  return (
    <MarketingLanding
      page={comparePage(tool)}
      cta={{
        headline: "Tests in code.",
        headlineItalic: "Or behavior in a file?",
        body: "Keep Java tests where they belong. Use Jetic when the journey needs a language-agnostic artifact.",
        cta: "Try Jetic",
        href: "/sign-up",
      }}
    />
  );
}
