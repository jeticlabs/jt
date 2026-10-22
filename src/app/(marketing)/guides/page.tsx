import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API testing guides",
  description:
    "Conceptual guides for modeling APIs, designing stateful workflows, testing auth, and keeping behavior evidence in the repository.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Guides" }],
  eyebrow: "RESOURCES · GUIDES",
  title: "Think in",
  titleAccent: "journeys.",
  description:
    "Tutorials show the commands. Guides explain the decisions behind them: what belongs in the model, which values should be captured, when to branch, and what a healthy regression suite looks like.",
  primary: { label: "Start with workflows", href: "/product/workflows" },
  secondary: { label: "Read the docs", href: "/docs" },
  chips: ["Concepts", "Patterns", "Auth", "Regression"],
  terminal: {
    title: "guide index",
    lines: [
      { kind: "out", text: "01  the behavioral model" },
      { kind: "out", text: "02  auth as a chain" },
      { kind: "out", text: "03  state between steps" },
      { kind: "out", text: "04  failures worth asserting" },
      { kind: "out", text: "05  a suite you can trust" },
    ],
    footer: "Five ideas behind a reliable workflow",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "GUIDES",
      title: "Five ideas that carry most of the work.",
      items: [
        { title: "The behavioral model", body: "Why the route, middleware, and source location belong in one shared artifact.", tag: "Model" },
        { title: "Auth as a chain", body: "A token is produced somewhere and consumed elsewhere. Model both ends.", tag: "Auth" },
        { title: "State between steps", body: "Capture only what later steps need, and name it for the workflow.", tag: "State" },
        { title: "Failures worth asserting", body: "Negative paths prove the API says no for the right reason.", tag: "Edges" },
        { title: "A suite you can trust", body: "Small, isolated, deterministic journeys beat a large flaky suite.", tag: "Suite" },
        { title: "Evidence over output", body: "A pass is a result. A trace is an explanation.", tag: "Runs" },
      ],
    },
    {
      type: "table",
      eyebrow: "PATTERNS",
      title: "Match the pattern to the problem.",
      body: "These are the recurring shapes in real workflows.",
      head: ["Pattern", "Use when", "Mechanism"],
      rows: [
        ["Token handoff", "A route requires a session or bearer token", "Capture from the login response and inject as a header"],
        ["Create then read", "Later steps depend on a generated id", "Capture the id and use it in the next path"],
        ["Expected rejection", "The behavior includes a 4xx response", "Set the expected status and assert the error code"],
        ["Conditional branch", "The next step depends on a role or flag", "Evaluate workflow memory after the step"],
        ["Retry with delay", "A dependency is eventually consistent", "Add a bounded retry to the step"],
        ["Regression baseline", "A journey must keep working", "Commit the workflow and run it in CI"],
      ],
    },
    {
      type: "prose",
      eyebrow: "PRINCIPLES",
      title: "How to keep a model honest.",
      body: "The model is only valuable if it matches the code and the tests stay small enough to review.",
      sections: [
        {
          heading: "Rescan instead of guessing",
          paragraphs: [
            "When the router or middleware changes, rescan. A model that has drifted from the source is worse than no model, because it produces confident tests for the wrong contract.",
          ],
        },
        {
          heading: "Capture with intent",
          paragraphs: [
            "Do not capture every field in a response. Capture the token, id, or flag that a later step actually needs, and give it a name that reads in the workflow.",
          ],
        },
        {
          heading: "Prefer explicit over clever",
          bullets: [
            "A visible expected status beats an implied success rule",
            "A condition on a captured role beats a hidden script",
            "A small workflow beats a long one with unclear ownership",
            "A reproducible failure beats a retry that hides it",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "GO DEEPER",
      title: "Concepts into practice.",
      items: [
        { tag: "Docs", title: "Workflow guide", body: "The full guide with fields and examples.", href: "/docs/guides/workflows" },
        { tag: "Product", title: "Schema & security", body: "How constraints and auth schemes enter the model.", href: "/product/schema-security" },
        { tag: "Solution", title: "Regression testing", body: "Turn the patterns into a dependable suite.", href: "/solutions/regression-testing" },
      ],
    },
    {
      type: "faq",
      eyebrow: "GUIDE FAQ",
      items: [
        { q: "Do I need to read these in order?", a: "No. Start with the model or auth guide, depending on what is blocking you." },
        { q: "Are these tied to the CLI version?", a: "The concepts are stable. Command details live in the docs and may evolve." },
        { q: "Can I contribute a pattern?", a: "Yes. Share the shape and the problem it solves; see the community page." },
      ],
    },
  ],
};

export default function GuidesPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Read the idea.",
        headlineItalic: "Run the pattern.",
        body: "The docs take each guide from concept to a workflow you can execute.",
        cta: "Open the docs",
        href: "/docs",
      }}
    />
  );
}
