import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "A future where API behavior is described once, shared by every tool, and verified with evidence rather than guesswork.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "Vision" }],
  eyebrow: "COMPANY · VISION",
  title: "One behavior.",
  titleAccent: "Many tools.",
  description:
    "The API contract should not be copied into a client collection, a test suite, an agent prompt, and a runbook. It should be described once, close to the source, and read by every tool that needs it.",
  primary: { label: "See the model", href: "/product/api-model" },
  secondary: { label: "Read about Jetic", href: "/about" },
  chips: ["Shared model", "Open files", "Evidence", "Craft"],
  terminal: {
    title: "the direction",
    lines: [
      { kind: "dim", text: "today    model → workflow → run" },
      { kind: "out", text: "next     model → review · CI · agents" },
      { kind: "blue", text: "goal     one source for API behavior" },
      { kind: "ok", text: "         read by people and tools" },
    ],
    footer: "A shared artifact, not another silo",
  },
  blocks: [
    {
      type: "prose",
      eyebrow: "THE BET",
      title: "The model outlives the test.",
      body: "Tests change with every framework. The behavior of an API is more durable.",
      sections: [
        {
          heading: "From copies to a source",
          paragraphs: [
            "Today, the same endpoint is described repeatedly: a URL in a client, a request in a test, a schema in a spec, a paragraph in a runbook. Each copy drifts at its own pace.",
            "A behavioral model derived from source gives those tools a common reference. The test, the agent, and the reviewer can disagree about strategy while agreeing about the contract.",
          ],
        },
        {
          heading: "Deterministic execution",
          paragraphs: [
            "AI makes authoring cheaper. It should not make execution less predictable. We believe the artifact that runs in CI should be a reviewed file, not a conversation.",
          ],
        },
        {
          heading: "Evidence as a default",
          paragraphs: [
            "A failing check should carry its own explanation: the request, the response, the state it depended on, and the source it came from. Evidence should be a property of the run, not a separate investigation.",
          ],
        },
      ],
    },
    {
      type: "features",
      eyebrow: "WHAT WE ARE BUILDING TOWARD",
      title: "Four shifts.",
      items: [
        { title: "From URLs to routes", body: "The route definition becomes the reference, not a copied string.", tag: "Model" },
        { title: "From scripts to state", body: "Capture and inject replace ad hoc variable plumbing.", tag: "Workflows" },
        { title: "From transcripts to files", body: "AI drafts become reviewable artifacts with a fixed execution path.", tag: "AI" },
        { title: "From pass/fail to traces", body: "Every run leaves enough context to understand a failure.", tag: "Evidence" },
        { title: "From one person to the team", body: "Behavior lives in the repository, not a private workspace.", tag: "Teams" },
        { title: "From tool to layer", body: "Jetic sits beside clients, suites, and agents rather than replacing them.", tag: "Ecosystem" },
      ],
    },
    {
      type: "quote",
      quote: "The endpoint is written once. The behavior should be understood the same way.",
      attribution: "JETIC · PRODUCT PRINCIPLE",
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "See the direction in the product.",
      items: [
        { tag: "Product", title: "Workflows", body: "Stateful journeys as reviewable files.", href: "/product/workflows" },
        { tag: "Product", title: "Reports", body: "Evidence as a first-class output.", href: "/product/reports" },
        { tag: "Solution", title: "AI-assisted testing", body: "Assisted authoring, deterministic execution.", href: "/solutions/ai-assisted-testing" },
      ],
    },
  ],
};

export default function VisionPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Describe it once.",
        headlineItalic: "Verify it together.",
        body: "The behavioral model is the first step. The trace is the proof.",
        cta: "Explore the model",
        href: "/product/api-model",
      }}
    />
  );
}
