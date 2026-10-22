import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI-assisted testing",
  description:
    "Let an agent inspect the model and draft workflows over MCP, then execute the saved file deterministically.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "AI-assisted testing" }],
  eyebrow: "SOLUTIONS · AI-ASSISTED",
  title: "AI writes the draft.",
  titleAccent: "The runner proves it.",
  description:
    "Agents are good at reading a codebase and proposing the first version of a test. Jetic gives them typed tools for the model, the workflow, and the run — then removes the model from execution entirely.",
  primary: { label: "Explore the MCP flow", href: "/docs/mcp" },
  secondary: { label: "See workflows", href: "/product/workflows" },
  chips: ["MCP", "Keyless execution", "Validated drafts", "Deterministic"],
  terminal: {
    title: "agent → jetic",
    lines: [
      { kind: "dim", text: "agent: inspect the checkout routes" },
      { kind: "cmd", text: "jetic_list_endpoints --tag orders" },
      { kind: "out", text: "GET /api/orders/:id · POST /api/orders" },
      { kind: "dim", text: "agent: scaffold a journey" },
      { kind: "cmd", text: "jetic_scaffold_workflow" },
      { kind: "cmd", text: "jetic_validate_workflow" },
      { kind: "ok", text: "✔ valid · saved to .jetic/workflows/checkout.json" },
      { kind: "blue", text: "execution: no model in the loop" },
    ],
    footer: "Authoring can be probabilistic. Execution is not.",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHERE AI HELPS",
      title: "Use the model for the thinking, not the running.",
      body: "The agent gets a narrow, typed surface instead of free-form HTTP guessing.",
      items: [
        { title: "Read the model", body: "List endpoints, inspect parameters, and find the auth producer.", tag: "Context" },
        { title: "Scaffold steps", body: "Draft bodies and auth chains from the endpoint definitions.", tag: "Draft" },
        { title: "Fill gaps", body: "Add descriptions, tags, and missing fields that verification flags.", tag: "Model" },
        { title: "Validate", body: "Catch broken references and missing memory before running.", tag: "Check" },
        { title: "Run", body: "Execute the saved workflow and read the trace back.", tag: "Prove" },
        { title: "Iterate", body: "Adjust the workflow file, not the conversation, when behavior changes.", tag: "Loop" },
      ],
    },
    {
      type: "split",
      eyebrow: "TWO PHASES",
      title: "Authoring is assisted. Execution is fixed.",
      body: "The handoff between the two is a file. Once the workflow is saved, the agent's context, temperature, and cost no longer affect the result.",
      bullets: [
        "The agent proposes; the validator and the run decide",
        "Re-running does not call a model",
        "Workflow diffs are reviewable by humans",
        "The trace is evidence, not a generated explanation",
      ],
      terminal: {
        title: "no model at run time",
        lines: [
          { kind: "dim", text: "authoring  agent + MCP" },
          { kind: "out", text: "            ↓ writes checkout.json" },
          { kind: "blue", text: "execution  jetic runner" },
          { kind: "out", text: "            ↓ reads checkout.json" },
          { kind: "ok", text: "            real requests · real trace" },
        ],
      },
      link: { label: "See the simulation model", href: "/product/simulations" },
    },
    {
      type: "steps",
      eyebrow: "THE HANDOFF",
      title: "Four artifacts, one direction.",
      items: [
        { title: "Model", body: "The agent reads source-linked endpoints.", cmd: "model.json" },
        { title: "Draft", body: "Scaffolding produces candidate steps.", cmd: "draftSteps" },
        { title: "Workflow", body: "A validated file is saved and reviewed.", cmd: "workflows/*.json" },
        { title: "Run", body: "The deterministic runner executes it.", cmd: ".jetic/runs/" },
      ],
    },
    {
      type: "specs",
      eyebrow: "GUARDRAILS",
      title: "Keep the useful part of the agent.",
      rows: [
        { k: "No key for the core", v: "Scanning, verification, validation, and execution do not need an AI provider." },
        { k: "Typed tools", v: "The agent works through MCP endpoints instead of inventing URLs and payloads." },
        { k: "Validation first", v: "Workflows are checked against the model before they can be saved or run." },
        { k: "Reviewable", v: "The output is plain JSON in the repository, so a human can change or reject it." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Meet the agent in the middle.",
      items: [
        { tag: "Docs", title: "MCP setup", body: "Connect a client and expose the Jetic tools.", href: "/docs/mcp" },
        { tag: "Compare", title: "Jetic vs AI coding agents", body: "An author and a runner are different roles.", href: "/compare/ai-coding-agents" },
        { tag: "Solution", title: "CI/CD", body: "Run the validated file on every push.", href: "/solutions/ci-cd" },
      ],
    },
    {
      type: "faq",
      eyebrow: "AI FAQ",
      items: [
        { q: "Does Jetic require an API key?", a: "No. The core workflow is keyless. An AI provider is only relevant if you choose to author through an agent." },
        { q: "Can the agent run workflows?", a: "It can invoke the simulation tool when configured. The run itself is handled by the deterministic runner." },
        { q: "What stops a bad draft?", a: "Validation against the model and the expected status checks during execution." },
        { q: "Is the agent's output committed?", a: "It can be. The workflow is a normal file and should be reviewed like any other change." },
      ],
    },
  ],
};

export default function AiAssistedTestingPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Let the agent draft.",
        headlineItalic: "Keep the proof.",
        body: "Connect over MCP, scaffold the workflow, then run the saved file without a model in the loop.",
        cta: "Connect Jetic",
        href: "/sign-up",
      }}
    />
  );
}
