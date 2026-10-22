import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product overview",
  description:
    "Jetic scans Express + TypeScript routes into a behavioral model, then runs stateful API workflows against your live server. One workspace from source to trace.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product" }],
  eyebrow: "PRODUCT OVERVIEW",
  title: "The API workspace that starts",
  titleAccent: "at the source.",
  description:
    "Jetic turns your Express routes into a behavioral model, then turns that model into ordered workflows you can run, replay, and trust. No handwritten scripts, no guessed constraints, no AI key required.",
  primary: { label: "Install the CLI", href: "/docs/start/getting-started" },
  secondary: { label: "Explore the API model", href: "/product/api-model" },
  chips: ["Node.js 20+", "Express + TypeScript", "Keyless scan", "Deterministic runs"],
  terminal: {
    title: "~/acme-api — jetic",
    lines: [
      { kind: "cmd", text: "npx jetic init" },
      { kind: "ok", text: "✔ scaffolded .jetic/ and jetic.config.json" },
      { kind: "cmd", text: "npx jetic scan" },
      { kind: "dim", text: "parsing tsconfig.json · ts-morph AST · server not started" },
      { kind: "blue", text: "GET  /api/orders/:id   src/routes/orders.ts:42" },
      { kind: "blue", text: "POST /api/orders       src/routes/orders.ts:67" },
      { kind: "ok", text: "✔ 24 endpoints → .jetic/model.json" },
      { kind: "cmd", text: "npx jetic simulate workflow --workflow .jetic/workflows/checkout.json" },
      { kind: "ok", text: "✔ 4 passed · 1 skipped · trace saved" },
    ],
    footer: "Model → Workflow → Memory → Trace",
  },
  blocks: [
    {
      type: "stats",
      items: [
        { value: "24", label: "Endpoints resolved from source in a single scan" },
        { value: "4", label: "Phases: init, scan, verify, simulate" },
        { value: "0", label: "AI keys needed for scanning or execution" },
        { value: "100%", label: "Of runs replayable from the same JSON file" },
      ],
    },
    {
      type: "features",
      eyebrow: "THE WORKSPACE",
      title: "Seven surfaces. One behavioral model.",
      body: "Every part of Jetic reads and writes the same model in .jetic/model.json, so the CLI, Studio, MCP tools, and simulations never drift apart.",
      items: [
        {
          title: "API model",
          body: "A versioned representation of every route, parameter, middleware link, and response.",
          tag: "Core",
        },
        {
          title: "Endpoints",
          body: "Method, path, path parameters, request body, and the exact source file and line.",
        },
        {
          title: "Schema & security",
          body: "Request and response shapes, auth schemes, ownership checks, and secret references.",
        },
        {
          title: "Workflows",
          body: "Ordered steps with capture, inject, conditions, retries, and failure modes.",
        },
        {
          title: "Simulations",
          body: "Deterministic execution against a live server with status and schema assertions.",
        },
        {
          title: "Reports",
          body: "Every request, response, capture, timing, and error kept as a replayable trace.",
        },
      ],
    },
    {
      type: "split",
      eyebrow: "SOURCE OF TRUTH",
      title: "The route, not a guessed URL.",
      body: "jetic scan reads tsconfig.json and walks the Express router chain: nested prefixes, path parameters, auth middleware, and the source line behind each route. Steps reference an endpoint by method and path, so the test and the code cannot silently disagree.",
      bullets: [
        "Import resolution across routers and modules",
        "Middleware chains recorded in execution order",
        "Business constraints pulled from handler logic",
        "Change tracking that flags only the files that moved",
      ],
      terminal: {
        title: ".jetic/model.json",
        lines: [
          { kind: "out", text: "{" },
          { kind: "out", text: '  "method": "GET",' },
          { kind: "out", text: '  "path": "/api/orders/:id",' },
          { kind: "out", text: '  "middleware": ["auth", "rateLimit"],' },
          { kind: "out", text: '  "parameters": [{ "name": "id", "in": "path" }],' },
          { kind: "out", text: '  "source": { "file": "src/routes/orders.ts", "line": 42 }' },
          { kind: "out", text: "}" },
        ],
      },
      link: { label: "How the model is built", href: "/product/api-model" },
    },
    {
      type: "steps",
      eyebrow: "LIFECYCLE",
      title: "Four phases, one stateful journey.",
      body: "Start in the terminal and stay there. Each phase writes a file you can review, diff, and commit.",
      items: [
        { title: "Initialize", body: "Scaffold the .jetic folder, model, workflows, and config.", cmd: "jetic init" },
        { title: "Scan", body: "Resolve Express routes into a behavioral model with provenance.", cmd: "jetic scan" },
        { title: "Verify", body: "Fill gaps, add constraints, and validate the model before running.", cmd: "Studio · MCP" },
        { title: "Simulate", body: "Execute ordered steps, capture memory, and store the trace.", cmd: "jetic simulate workflow" },
      ],
    },
    {
      type: "related",
      eyebrow: "GO DEEPER",
      title: "Follow the model into each surface.",
      items: [
        { tag: "Core", title: "API model", body: "What lives in .jetic/model.json and how it stays current.", href: "/product/api-model" },
        { tag: "Core", title: "Endpoints", body: "Routes, parameters, middleware, and source provenance.", href: "/product/endpoints" },
        { tag: "Core", title: "Schema & security", body: "Contracts, auth chains, ownership rules, and secrets.", href: "/product/schema-security" },
        { tag: "Run", title: "Workflows", body: "Stateful steps with capture, inject, conditions, and retry.", href: "/product/workflows" },
        { tag: "Run", title: "Simulations", body: "Deterministic execution and replayable traces.", href: "/product/simulations" },
        { tag: "Ship", title: "Reports", body: "Request-level evidence for every run you keep.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "PRODUCT FAQ",
      items: [
        {
          q: "Does Jetic replace my API client?",
          a: "No. Jetic covers the behavioral layer above request sending: a model of your routes plus ordered, stateful workflows. You can still use curl, Postman, or your editor for one-off requests.",
        },
        {
          q: "Is an AI provider required?",
          a: "No. init, scan, verify, and simulate are deterministic and keyless. An AI agent can author or edit workflows over MCP, but the runner never needs a model in the loop.",
        },
        {
          q: "Which projects are supported today?",
          a: "The static scanner targets Express + TypeScript projects with a tsconfig.json. Other stacks can be modeled manually or through the MCP tools.",
        },
        {
          q: "Where does Jetic store its data?",
          a: "Everything lives in the .jetic folder inside your project: model.json, workflows, memory, traces, and changes. Commit the files you want to share with your team.",
        },
      ],
    },
  ],
};

export default function ProductPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Start with the source.",
        headlineItalic: "of truth.",
        body: "Install the CLI, scan your Express routes, and turn your first workflow into a replayable run in minutes.",
        cta: "Install Jetic CLI",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
