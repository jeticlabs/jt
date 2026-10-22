import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutorials",
  description:
    "Hands-on paths from install to a running workflow: scan an Express API, model auth, scaffold a journey, and run it in CI.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Tutorials" }],
  eyebrow: "RESOURCES · TUTORIALS",
  title: "Learn by",
  titleAccent: "running it.",
  description:
    "Every tutorial ends with something executable: a model, a workflow, or a run. Start with installation if Jetic is new, then follow the path that matches the job in front of you.",
  primary: { label: "Start with the quickstart", href: "/docs/quickstart" },
  secondary: { label: "Install the CLI", href: "/docs/install" },
  chips: ["Hands-on", "CLI", "Express", "MCP"],
  terminal: {
    title: "tutorial 01",
    lines: [
      { kind: "cmd", text: "jetic init" },
      { kind: "ok", text: "✔ .jetic/model.json created" },
      { kind: "cmd", text: "jetic scan" },
      { kind: "ok", text: "✔ 18 endpoints · 2 schemes" },
      { kind: "cmd", text: "jetic simulate workflow first-flow" },
      { kind: "ok", text: "✔ 3 passed · trace saved" },
    ],
    footer: "The shortest path from zero to a trace",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "PATHS",
      title: "Pick a tutorial by outcome.",
      body: "Each path is short enough to finish in one sitting.",
      items: [
        {
          title: "Your first simulation",
          body: "Install, initialize, scan, scaffold, and run one ordered workflow against local.",
          tag: "Beginner",
        },
        {
          title: "Model a protected route",
          body: "Connect a token producer to a consumer and verify the security chain.",
          tag: "Auth",
        },
        {
          title: "Write a negative path",
          body: "Assert a 401, 403, or 422 and continue the journey afterwards.",
          tag: "Testing",
        },
        {
          title: "Capture and reuse an id",
          body: "Create a resource, store its id, and fetch it in the next step.",
          tag: "State",
        },
        {
          title: "Connect an AI agent",
          body: "Expose the Jetic MCP tools and let the agent scaffold a draft workflow.",
          tag: "MCP",
        },
        {
          title: "Run in CI",
          body: "Add one command to a pipeline and keep the run folder as an artifact.",
          tag: "CI",
        },
      ],
    },
    {
      type: "steps",
      eyebrow: "THE CORE PATH",
      title: "Four commands, one journey.",
      body: "This is the sequence every other tutorial builds on.",
      items: [
        { title: "Initialize", body: "Create the .jetic workspace in the project.", cmd: "jetic init" },
        { title: "Scan", body: "Build the model from the Express source.", cmd: "jetic scan" },
        { title: "Author", body: "Draft a workflow from three endpoints in Studio or over MCP.", cmd: "jetic dev" },
        { title: "Simulate", body: "Run it and read the trace.", cmd: "jetic simulate workflow <slug>" },
      ],
    },
    {
      type: "split",
      eyebrow: "READING THE RESULT",
      title: "A tutorial is done when the trace makes sense.",
      body: "The output is not just a green line. Open the run and find the captured token, the injected header, and the status that was asserted.",
      bullets: [
        "Open .jetic/runs/<runId>/report.json",
        "Find the step that captured the token",
        "Find the step that injected it",
        "Compare expected and actual status",
      ],
      terminal: {
        title: "what to look for",
        lines: [
          { kind: "out", text: "step 1  capture  accessToken" },
          { kind: "out", text: "step 2  inject   Authorization" },
          { kind: "blue", text: "step 3  expect   200" },
          { kind: "ok", text: "step 3  actual   200 · schema valid" },
        ],
      },
      reverse: true,
      link: { label: "Read the artifact reference", href: "/docs/reference/artifacts" },
    },
    {
      type: "related",
      eyebrow: "REFERENCE",
      title: "Keep the docs open.",
      items: [
        { tag: "Docs", title: "Getting started", body: "The canonical first-run guide.", href: "/docs/start/getting-started" },
        { tag: "Docs", title: "Workflows", body: "The full workflow guide with examples.", href: "/docs/guides/workflows" },
        { tag: "Docs", title: "MCP integration", body: "Connect an agent and use the typed tools.", href: "/docs/mcp" },
        { tag: "Examples", title: "Examples", body: "Copyable patterns for common journeys.", href: "/examples" },
        { tag: "Support", title: "Support", body: "What to include when something does not work.", href: "/support" },
      ],
    },
  ],
};

export default function TutorialsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Pick one path.",
        headlineItalic: "Finish it today.",
        body: "The first simulation takes minutes. Everything else builds on the same model.",
        cta: "Open the quickstart",
        href: "/docs/quickstart",
      }}
    />
  );
}
