import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jetic is a code-aware API testing tool for Node.js teams: a behavioral model from source, deterministic workflows, and run evidence.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "About" }],
  eyebrow: "COMPANY · ABOUT",
  title: "Close to the code.",
  titleAccent: "Honest about the run.",
  description:
    "Jetic exists because the most important API behavior sits between endpoints, and most tools start one layer too high. We build a small, source-aware tool for the journeys a backend team actually depends on.",
  primary: { label: "See the product", href: "/product" },
  secondary: { label: "Read the vision", href: "/vision" },
  chips: ["Node.js", "Source-first", "Deterministic", "Small surface"],
  terminal: {
    title: "what we believe",
    lines: [
      { kind: "out", text: "the source is the contract" },
      { kind: "out", text: "the journey is the unit" },
      { kind: "blue", text: "state should be explicit" },
      { kind: "out", text: "a failure needs evidence" },
      { kind: "ok", text: "tools should be reviewable" },
    ],
    footer: "Four ideas behind the product",
  },
  blocks: [
    {
      type: "prose",
      eyebrow: "WHY JETIC",
      title: "A gap we kept running into.",
      body: "Unit tests passed. The client still broke. The missing test was the sequence.",
      sections: [
        {
          heading: "The problem",
          paragraphs: [
            "Backend teams have good tools for functions and good tools for individual requests. The fragile part is often in between: a token that must be captured, an id that must be reused, a guard that returns a different status after a change.",
            "Those failures are not exotic. They are ordinary. They are just invisible to tests that start from a blank request.",
          ],
        },
        {
          heading: "The approach",
          paragraphs: [
            "Jetic scans an Express + TypeScript project and writes a behavioral model: routes, parameters, middleware, security schemes, and source provenance. Workflows reference that model, carry state forward with capture and inject, and execute deterministically against a real environment.",
            "The result is small enough to review and concrete enough to debug.",
          ],
        },
        {
          heading: "The constraint",
          paragraphs: [
            "We would rather be precise about a narrow stack than vague about every stack. The current product focuses on HTTP APIs for Express + TypeScript, with a CLI, Studio, and MCP integration.",
          ],
        },
      ],
    },
    {
      type: "features",
      eyebrow: "PRINCIPLES",
      title: "How we make decisions.",
      items: [
        { title: "Source over transcription", body: "If the code can tell us the route, we should not ask a person to retype it.", tag: "Model" },
        { title: "Explicit over clever", body: "A visible expected status beats a hidden script.", tag: "Design" },
        { title: "Evidence over assertion", body: "A trace explains a failure; a red icon does not.", tag: "Runs" },
        { title: "Narrow over broad", body: "Depth in one stack is more useful than shallow coverage of all.", tag: "Scope" },
        { title: "Local over locked-in", body: "The model and workflows are files in your repository.", tag: "Trust" },
        { title: "Human review over automation", body: "AI can draft. A person should be able to read and approve the result.", tag: "AI" },
      ],
    },
    {
      type: "specs",
      eyebrow: "AT A GLANCE",
      title: "The short version.",
      rows: [
        { k: "What it is", v: "A CLI and local Studio for code-aware API behavior testing." },
        { k: "Who it is for", v: "Backend, platform, and QA teams working on Node.js HTTP APIs." },
        { k: "What it produces", v: "A behavioral model, reviewable workflows, and run traces." },
        { k: "What it avoids", v: "Browser automation, generated mocks, and a model in the execution path." },
        { k: "Where it lives", v: "In your repository, under .jetic/." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "The company, continued.",
      items: [
        { tag: "Company", title: "Vision", body: "Where the model-first approach is going.", href: "/vision" },
        { tag: "Company", title: "Security", body: "How we think about secrets and disclosure.", href: "/security" },
        { tag: "Resources", title: "Community", body: "How to contribute a workflow or a correction.", href: "/community" },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Start close",
        headlineItalic: "to the code.",
        body: "Scan one Express project, run one journey, and judge the model by the trace it produces.",
        cta: "Try Jetic",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
