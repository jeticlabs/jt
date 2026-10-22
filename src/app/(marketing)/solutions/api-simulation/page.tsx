import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API simulation",
  description:
    "Simulate real API behavior: ordered calls, auth handoff, captured state, expected failures, and a trace for every run.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "API simulation" }],
  eyebrow: "SOLUTIONS · SIMULATION",
  title: "Simulate the behavior.",
  titleAccent: "Not just the request.",
  description:
    "A simulation in Jetic is a stateful journey against a live environment. It reproduces the way a client actually uses the API: log in, create, read, retry, and fail in the right places.",
  primary: { label: "Learn about simulations", href: "/product/simulations" },
  secondary: { label: "See a workflow", href: "/product/workflows" },
  chips: ["Stateful", "Live target", "Conditions", "Traces"],
  terminal: {
    title: "jetic simulate workflow",
    lines: [
      { kind: "cmd", text: "jetic_simulate_workflow --workflow checkout" },
      { kind: "dim", text: "preflight  http://localhost:3000 · reachable" },
      { kind: "out", text: "step 1  login          200   61ms" },
      { kind: "out", text: "step 2  create order   201  143ms" },
      { kind: "out", text: "step 3  fetch order    200   54ms" },
      { kind: "ok", text: "✔ 3 passed · 1 token captured · trace saved" },
    ],
    footer: "Run id 2026-10-22T09-14-02",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHAT MAKES IT A SIMULATION",
      title: "The run remembers.",
      body: "Each step can read what the previous step produced. That is what turns a list of requests into a simulation of use.",
      items: [
        { title: "Capture", body: "Store a response field in workflow memory under a name you choose.", tag: "Write" },
        { title: "Inject", body: "Use that value in a later path, body, query, or header.", tag: "Read" },
        { title: "Conditions", body: "Branch or stop based on what a step captured.", tag: "Logic" },
        { title: "Retries", body: "Repeat a flaky step with a delay before failing the run.", tag: "Resilience" },
        { title: "Expected failures", body: "Treat a known error status as a passing outcome.", tag: "Edges" },
        { title: "Preflight", body: "Fail fast when the target is unreachable, before step one.", tag: "Guard" },
      ],
    },
    {
      type: "split",
      eyebrow: "REAL VS FAKE",
      title: "No generated stub in the middle.",
      body: "Jetic simulates the client, not the server. The requests go to your environment, so the behavior you observe is the behavior the API actually has.",
      bullets: [
        "Real middleware, guards, and validation",
        "Real tokens from the real login endpoint",
        "Real database state for created resources",
        "Real error codes for negative paths",
      ],
      terminal: {
        title: "client-side simulation",
        lines: [
          { kind: "out", text: "1. POST /api/auth/login" },
          { kind: "blue", text: "   capture accessToken" },
          { kind: "out", text: "2. POST /api/orders" },
          { kind: "blue", text: "   inject Authorization" },
          { kind: "blue", text: "   capture orderId" },
          { kind: "out", text: "3. GET /api/orders/:orderId" },
          { kind: "ok", text: "✔ behavior observed end to end" },
        ],
      },
    },
    {
      type: "table",
      eyebrow: "MODES",
      title: "Pick the right kind of fake.",
      body: "Simulation is overloaded in API tooling. These are different jobs.",
      head: ["Mode", "What it does", "Jetic"],
      rows: [
        ["Mocking", "Returns a canned response instead of calling a service", "Not the goal"],
        ["Contract testing", "Checks a provider and consumer agree", "Partly, via schemas"],
        ["Client simulation", "Calls the real API in a realistic order", "Yes"],
        ["Load simulation", "Generates concurrent traffic", "No"],
        ["State simulation", "Carries values across calls", "Yes, with capture and inject"],
      ],
    },
    {
      type: "steps",
      eyebrow: "BUILD A SIMULATION",
      title: "Start with one real journey.",
      items: [
        { title: "Pick", body: "Choose the flow a user actually performs.", cmd: "3–5 endpoints" },
        { title: "Author", body: "Generate bodies and auth from the model in Studio.", cmd: "jetic dev" },
        { title: "Add state", body: "Capture ids and tokens, inject them downstream.", cmd: "capture / inject" },
        { title: "Run", body: "Execute, inspect the trace, and refine.", cmd: "jetic simulate workflow" },
      ],
    },
    {
      type: "related",
      eyebrow: "KEEP GOING",
      title: "Simulation is a foundation.",
      items: [
        { tag: "Product", title: "Simulations", body: "The full execution model and trace format.", href: "/product/simulations" },
        { tag: "Solution", title: "Regression testing", body: "Keep the simulation green as the code changes.", href: "/solutions/regression-testing" },
        { tag: "Compare", title: "Jetic vs AI API workflows", body: "Fixed files versus model-driven execution.", href: "/compare/ai-api-workflows" },
      ],
    },
    {
      type: "faq",
      eyebrow: "SIMULATION FAQ",
      items: [
        { q: "Does a simulation create real data?", a: "Yes. It calls the target environment, so writes are real for that environment. Use a disposable local or staging target." },
        { q: "Can I clean up afterwards?", a: "Add delete steps to the workflow, or reset the target environment as part of your setup." },
        { q: "What happens if a capture is missing?", a: "Strict templates fail the step before sending when a referenced value has no value." },
        { q: "Can simulations run in parallel?", a: "Runs are workflows with shared state. They are intended to run as ordered sequences; CI parallelism should be handled per job." },
      ],
    },
  ],
};

export default function ApiSimulationPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Simulate the client.",
        headlineItalic: "Observe the server.",
        body: "Build one stateful journey, run it against a disposable environment, and keep the trace.",
        cta: "Try a simulation",
        href: "/sign-up",
      }}
    />
  );
}
