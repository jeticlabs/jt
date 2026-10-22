import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulations",
  description:
    "Run stateful workflows against a live server with preflight, status assertions, schema checks, and a trace for every step.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "Simulations" }],
  eyebrow: "PRODUCT · SIMULATIONS",
  title: "Same file in.",
  titleAccent: "Same run out.",
  description:
    "A simulation executes a saved workflow against a live environment. Jetic preflights the target, runs the ordered steps, checks every expectation, and stores a trace you can inspect step by step.",
  primary: { label: "Run your first simulation", href: "/docs/quickstart" },
  secondary: { label: "How workflows work", href: "/product/workflows" },
  chips: ["Preflight", "Status checks", "Schema validation", "Stored traces"],
  terminal: {
    title: "jetic simulate workflow",
    lines: [
      { kind: "cmd", text: "jetic simulate workflow --workflow .jetic/workflows/checkout.json" },
      { kind: "dim", text: "preflight http://localhost:3000 · reachable" },
      { kind: "ok", text: "✔ 1. register          201   98ms" },
      { kind: "ok", text: "✔ 2. login             200   61ms   captured workflow:accessToken" },
      { kind: "dim", text: "– 3. verify 2fa        skipped (requires2FA = false)" },
      { kind: "ok", text: "✔ 4. create order      201  143ms   injected Authorization" },
      { kind: "ok", text: "✔ 5. fetch order       200   54ms" },
      { kind: "blue", text: "4 passed · 1 skipped · trace saved to .jetic/runs/" },
    ],
    footer: "Preflight · execute · assert · record",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "THE RUNNER",
      title: "A test run you can read afterward.",
      body: "Every step records the request it sent, the response it received, the captures it made, and the time it took.",
      items: [
        { title: "Preflight", body: "Probe the target before step one and fail fast when it is unreachable.", tag: "Setup" },
        { title: "Ordered execution", body: "Steps run in file order with memory available to every later step.", tag: "Run" },
        { title: "Status assertions", body: "Each step checks its expected status; extra codes can be declared as passes.", tag: "Check" },
        { title: "Schema validation", body: "Response fields are validated against the modeled contract.", tag: "Check" },
        { title: "Captures", body: "Values from requests and responses are stored for the rest of the journey.", tag: "Memory" },
        { title: "Trace", body: "The full run is stored under .jetic/runs for review and replay.", tag: "Evidence" },
      ],
    },
    {
      type: "split",
      eyebrow: "ENVIRONMENTS",
      title: "Point the run at the right server.",
      body: "Environments declare base URLs for local, staging, or production. Workflows stay the same; only the target changes. A preflight stops a run before it wastes time on an unreachable host.",
      bullets: [
        "Select an environment by name or override the base URL",
        "Fail fast or warn when the target is unreachable",
        "Keep secrets in environment references, not in files",
        "Use a separate memory scope when runs must not interfere",
      ],
      terminal: {
        title: "environment",
        lines: [
          { kind: "out", text: "local      http://localhost:3000" },
          { kind: "out", text: "staging    https://staging.acme.dev" },
          { kind: "out", text: "production https://api.acme.com" },
          { kind: "cmd", text: "jetic simulate workflow --env staging" },
          { kind: "ok", text: "✔ preflight 200 · 41ms" },
          { kind: "ok", text: "✔ run started" },
        ],
      },
      reverse: true,
    },
    {
      type: "steps",
      eyebrow: "RUN LIFECYCLE",
      title: "From saved file to stored evidence.",
      items: [
        { title: "Resolve", body: "Cross-check the workflow against model.json before sending anything.", cmd: "validation" },
        { title: "Preflight", body: "Probe the environment and stop early on an unreachable target.", cmd: "preflight: abort" },
        { title: "Execute", body: "Run each step, resolve templates, and inject captured values.", cmd: "jetic simulate workflow" },
        { title: "Record", body: "Store requests, responses, captures, timings, and errors.", cmd: ".jetic/runs/<runId>/" },
      ],
    },
    {
      type: "table",
      eyebrow: "EXPECTATIONS",
      title: "What a passing step actually checks.",
      head: ["Check", "Default behavior", "Failure handling"],
      rows: [
        ["Expected status", "200 unless the step declares another code; any 2xx passes when a 2xx is expected.", "The step fails unless the code is listed in continueOnStatus."],
        ["Response schema", "When a response schema exists, fields are validated against it.", "A mismatch fails the step."],
        ["Required captures", "A capture path that is missing fails the step.", "Later steps cannot read the missing key."],
        ["Unresolved template", "Strict mode fails before sending an empty value.", "Set strictTemplates false for legacy behavior."],
        ["Timeout", "30 seconds per request by default.", "The step fails with a timeout error in the trace."],
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Keep the run moving.",
      items: [
        { tag: "Scale", title: "Automations", body: "Schedule simulations or run them in CI and agent workflows.", href: "/product/automations" },
        { tag: "Evidence", title: "Reports", body: "Inspect the full trace for any stored run.", href: "/product/reports" },
        { tag: "Author", title: "Workflows", body: "Add conditions, retries, and failure modes to the file.", href: "/product/workflows" },
      ],
    },
    {
      type: "faq",
      eyebrow: "SIMULATION FAQ",
      items: [
        {
          q: "Does a simulation need the server running?",
          a: "Yes. Execution is against a live server. Scanning is static, but a simulation sends real HTTP requests to the selected environment.",
        },
        {
          q: "Are runs isolated from each other?",
          a: "Each run gets its own memory scope. Use clearMemory when a fresh state is required, and use non-production environments for destructive journeys.",
        },
        {
          q: "Can I run a workflow asynchronously?",
          a: "Yes. Start the run in the background and poll its run id while it progresses. The stored trace updates as steps complete.",
        },
        {
          q: "Where can I find a past run?",
          a: "Runs are stored under .jetic/runs. List them in the CLI or Studio, then open a run to see every request, response, and capture.",
        },
      ],
    },
  ],
};

export default function SimulationsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Run it. Read it.",
        headlineItalic: "Replay it.",
        body: "Turn a saved workflow into a recorded run with status checks, captured memory, and a trace you can share with your team.",
        cta: "Start simulating",
        href: "/sign-up",
      }}
    />
  );
}
