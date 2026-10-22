import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What Jetic is working on now, what comes next, and what is still being considered. No dates we cannot keep.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Developers" }, { label: "Roadmap" }],
  eyebrow: "DEVELOPERS · ROADMAP",
  title: "Direction,",
  titleAccent: "not dates.",
  description:
    "The roadmap is grouped by confidence, not by quarters. Items in Now are actively being built; Next is planned; Later is under consideration. Priorities change when real workflows reveal a better order.",
  primary: { label: "Read the roadmap doc", href: "/docs/resources/roadmap" },
  secondary: { label: "Share a use case", href: "/contact" },
  chips: ["Now", "Next", "Later", "Feedback"],
  terminal: {
    title: "roadmap.json",
    lines: [
      { kind: "ok", text: "now    workflow depth · traces · docs" },
      { kind: "blue", text: "next   broader modeling · team review" },
      { kind: "dim", text: "later  ecosystem and integrations" },
      { kind: "out", text: "order  driven by real use cases" },
    ],
    footer: "Confidence, not calendar promises",
  },
  blocks: [
    {
      type: "table",
      eyebrow: "NOW",
      title: "Being built and refined.",
      body: "These are the areas with active work. Specific changes ship when they are ready.",
      head: ["Area", "Focus", "Why it matters"],
      rows: [
        ["Workflow depth", "More expressive conditions, failure handling, and memory", "Real journeys have branches and edge cases"],
        ["Trace quality", "Clearer step records and failure context", "A failure should explain itself"],
        ["Documentation", "More examples and sharper setup paths", "The first hour decides adoption"],
        ["MCP ergonomics", "Typed tools that agents can use without guessing", "Assisted authoring should be safe"],
      ],
    },
    {
      type: "table",
      eyebrow: "NEXT",
      title: "Planned, not promised.",
      body: "These are likely next, subject to what the current work teaches us.",
      head: ["Area", "Focus", "Open question"],
      rows: [
        ["Modeling breadth", "Additional stack support beyond Express + TypeScript", "Which stack unlocks the most real use?"],
        ["Team review", "Better diffs and shared ownership of workflows", "What belongs in a pull request?"],
        ["Environments", "Richer target and secret configuration", "How much belongs in files versus CI?"],
        ["Run comparison", "Compare a baseline and a changed run", "What is the most useful diff?"],
      ],
    },
    {
      type: "table",
      eyebrow: "LATER",
      title: "Under consideration.",
      body: "Ideas we are not building yet. Feedback can move them up or remove them.",
      head: ["Idea", "What it would do", "Status"],
      rows: [
        ["More protocols", "Extend beyond HTTP where the model fits", "Considering"],
        ["Deeper CI integrations", "First-class artifacts and annotations", "Considering"],
        ["Community workflow library", "Share redacted patterns across teams", "Considering"],
        ["Editor integrations", "Surface model and workflow state in the IDE", "Considering"],
      ],
    },
    {
      type: "specs",
      eyebrow: "HOW PRIORITIES WORK",
      title: "Evidence moves the list.",
      rows: [
        { k: "A real workflow", v: "A failing or awkward journey is the strongest input. It shows the shape the product is missing." },
        { k: "Frequency", v: "A problem that appears in many teams outranks a one-off request." },
        { k: "Fit", v: "The change should strengthen the source-aware, deterministic model rather than dilute it." },
        { k: "Honesty", v: "Items are removed when they are no longer planned. The list is not a marketing inventory." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Follow the work.",
      items: [
        { tag: "Developers", title: "Changelog", body: "What has already shipped.", href: "/changelog" },
        { tag: "Resources", title: "Community", body: "How to contribute a pattern or a correction.", href: "/community" },
        { tag: "Docs", title: "Roadmap doc", body: "The maintained roadmap in the docs.", href: "/docs/resources/roadmap" },
      ],
    },
    {
      type: "faq",
      eyebrow: "ROADMAP FAQ",
      items: [
        { q: "Are there dates?", a: "No. The roadmap is grouped by confidence. Dates would imply a precision the work does not have." },
        { q: "Can I request a feature?", a: "Yes. Describe the job, the current workaround, and the workflow that exposed the gap." },
        { q: "Why is an item missing?", a: "It may have shipped, been removed, or never made the list. Check the changelog and docs." },
        { q: "Does the order change?", a: "Yes. Real usage is the strongest signal, and it can reorder the list quickly." },
      ],
    },
  ],
};

export default function RoadmapPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Shape the order.",
        headlineItalic: "Bring the workflow.",
        body: "The most useful roadmap input is the journey that almost worked and the step that blocked it.",
        cta: "Contact the team",
        href: "/contact",
      }}
    />
  );
}
