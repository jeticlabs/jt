import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";
import { COMPARE_TOOLS } from "./_data/tools";

export const metadata: Metadata = {
  title: "Compare",
  description:
    "How Jetic fits beside API clients, AI agents, and established testing suites: same request layer, different unit of work.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Compare" }],
  eyebrow: "COMPARE",
  title: "The right tool for",
  titleAccent: "the right layer.",
  description:
    "Most API tools are excellent at a single request. Jetic is built for the sequence after that: several calls in order, state that has to survive between them, and a trace that explains the result. Here is how that layer fits beside the tools you already use.",
  primary: { label: "Try Jetic", href: "/docs/start/getting-started" },
  secondary: { label: "See workflows", href: "/product/workflows" },
  chips: ["Clients", "Agents", "Testing suites", "CI"],
  terminal: {
    title: "one request vs one journey",
    lines: [
      { kind: "dim", text: "request tools  →  send · inspect · iterate" },
      { kind: "out", text: "POST /api/orders           201   one call" },
      { kind: "blue", text: "jetic          →  model · order · state · trace" },
      { kind: "out", text: "1. login      200  capture accessToken" },
      { kind: "out", text: "2. create     201  inject Authorization" },
      { kind: "out", text: "3. fetch      200  capture orderId" },
      { kind: "ok", text: "✔ journey passed · trace stored" },
    ],
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHERE TOOLS DIFFER",
      title: "Four questions that separate the categories.",
      body: "The comparison is less about features than about the unit of work each tool optimizes for.",
      items: [
        {
          title: "What is the unit?",
          body: "A request, a collection run, a generated plan, or an ordered workflow with memory.",
          tag: "Shape",
        },
        {
          title: "Where does context come from?",
          body: "Hand-authored URLs, imported specs, or a model scanned from your Express source.",
          tag: "Source",
        },
        {
          title: "Who executes it?",
          body: "A person in a client, a model in a loop, or a deterministic runner over a file.",
          tag: "Runtime",
        },
        {
          title: "What is left behind?",
          body: "Console history, a transcript, or a per-step trace with requests, responses, and captures.",
          tag: "Evidence",
        },
      ],
    },
    {
      type: "table",
      eyebrow: "THE LAYERS",
      title: "Pick the layer, then the tool.",
      body: "These categories overlap, but they are not substitutes. A healthy stack often uses more than one.",
      head: ["Layer", "Typical tools", "What Jetic does"],
      rows: [
        [
          "Exploration",
          "Postman, Insomnia, Bruno, Hoppscotch, Yaak, HTTPie",
          "Not the focus. Use a client for the first call and manual inspection.",
        ],
        [
          "Authoring",
          "AI coding agents and AI workflow tools",
          "Offers MCP tools so an agent can model, scaffold, validate, and run.",
        ],
        [
          "Behavior",
          "Jetic",
          "Derives endpoints from source and executes stateful workflows deterministically.",
        ],
        [
          "Suites",
          "ReadyAPI, Karate, REST Assured",
          "Narrower and source-first: HTTP journeys for Node.js teams.",
        ],
        [
          "Evidence",
          "Jetic reports",
          "Stores requests, responses, captures, timings, and errors per run.",
        ],
      ],
    },
    {
      type: "related",
      eyebrow: "ALL COMPARISONS",
      title: "Go deeper on the tool you use.",
      items: COMPARE_TOOLS.map((tool) => ({
        tag: tool.category,
        title: `Jetic vs ${tool.name}`,
        body: tool.splitTitle,
        href: `/compare/${tool.slug}`,
      })),
    },
    {
      type: "faq",
      eyebrow: "COMPARE FAQ",
      items: [
        {
          q: "Does Jetic replace my API client?",
          a: "No. Clients are better for exploratory calls. Jetic covers the repeatable, stateful journey and keeps the evidence.",
        },
        {
          q: "Can I use Jetic with an AI agent?",
          a: "Yes. Jetic exposes MCP tools for modeling and running, and the saved workflow executes deterministically without a model.",
        },
        {
          q: "Is Jetic a load-testing tool?",
          a: "No. It verifies behavior and state across ordered steps. Performance tooling is a different category.",
        },
        {
          q: "Which comparison should I start with?",
          a: "Start with the tool already in your stack. If you are choosing fresh, start with the workflow comparison.",
        },
      ],
    },
  ],
};

export default function CompareIndexPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Keep the client.",
        headlineItalic: "Add the behavior.",
        body: "Use the tools you like for exploration. Let Jetic own the ordered journey, the state, and the trace.",
        cta: "Start with a workflow",
        href: "/product/workflows",
      }}
    />
  );
}
