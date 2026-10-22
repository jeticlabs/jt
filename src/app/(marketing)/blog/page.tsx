import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on API behavior, source-aware models, deterministic workflows, and the gap between a passing request and a working journey.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Blog" }],
  eyebrow: "RESOURCES · BLOG",
  title: "Notes from",
  titleAccent: "the API layer.",
  description:
    "Short essays about the part of backend work that unit tests cannot see: state between calls, auth handoff, contract drift, and the evidence a team needs after a failure.",
  primary: { label: "Read the workflow guide", href: "/product/workflows" },
  secondary: { label: "Browse comparisons", href: "/compare" },
  chips: ["Behavior", "State", "Evidence", "Craft"],
  terminal: {
    title: "the recurring theme",
    lines: [
      { kind: "dim", text: "a request passed" },
      { kind: "out", text: "the journey still failed" },
      { kind: "blue", text: "the missing piece was state" },
      { kind: "ok", text: "capture → inject → verify" },
    ],
    footer: "Notes on the layer between endpoints",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "RECENT NOTES",
      title: "Start with the idea that fits your week.",
      body: "Each note points to the product surface or guide where the idea becomes concrete.",
      items: [
        {
          title: "The token is part of the test",
          body: "Why auth handoff is the first place a journey becomes more than a list of requests.",
          tag: "Auth",
        },
        {
          title: "Collections are a catalog",
          body: "A saved request records what you typed. A workflow records what must happen.",
          tag: "Workflows",
        },
        {
          title: "The bug between two green tests",
          body: "Integration points are where the interesting failures live, and where traces help most.",
          tag: "Debugging",
        },
        {
          title: "Let the agent draft, not decide",
          body: "A practical split between probabilistic authoring and deterministic execution.",
          tag: "AI",
        },
        {
          title: "What a run should leave behind",
          body: "Requests and responses are the beginning. Captures and timings are the explanation.",
          tag: "Reports",
        },
        {
          title: "The model is the shared artifact",
          body: "When source drives the model, every tool in the loop reads the same contract.",
          tag: "Model",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "EDITORIAL",
      title: "What this blog is for.",
      body: "No product announcements dressed as essays. These are working notes on API behavior.",
      sections: [
        {
          heading: "The unit of work",
          paragraphs: [
            "Most API conversations start with a request. The request is the visible artifact, but it is rarely the unit that fails in production. What fails is a sequence: the token that expired, the order that was not created, the retry that ran twice.",
            "The notes here focus on that sequence and on the evidence needed to understand it.",
          ],
        },
        {
          heading: "Source as context",
          paragraphs: [
            "A test that repeats a URL is a copy of the API. A test derived from the source is a statement about the API. The difference matters when the route changes and the copy does not.",
          ],
        },
        {
          heading: "Determinism as a feature",
          paragraphs: [
            "AI can help write the first draft. It should not be the thing deciding which request comes next during a regression run. We write about where to draw that line.",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "READ NEXT",
      title: "The product pages behind the notes.",
      items: [
        { tag: "Product", title: "API model", body: "How the source becomes a shared contract.", href: "/product/api-model" },
        { tag: "Guide", title: "Workflows", body: "Ordered steps, captures, conditions, and retries.", href: "/product/workflows" },
        { tag: "Comparison", title: "AI agents vs Jetic", body: "Authoring and execution are different jobs.", href: "/compare/ai-coding-agents" },
      ],
    },
  ],
};

export default function BlogPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Read less.",
        headlineItalic: "Run more.",
        body: "The fastest way to understand the model is to scan one Express project and run one journey.",
        cta: "Try Jetic",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
