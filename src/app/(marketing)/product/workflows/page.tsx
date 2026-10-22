import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workflows",
  description:
    "Ordered JSON steps with capture, inject, conditions, retries, and failure modes. Stateful API journeys you can review, commit, and replay.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "Workflows" }],
  eyebrow: "PRODUCT · WORKFLOWS",
  title: "Ordered steps that carry",
  titleAccent: "state.",
  description:
    "A workflow is a JSON file in .jetic/workflows. Each step calls an endpoint, can capture values from the request or response, and can inject them into later steps. The runner executes the list in order — no model decides what happens mid-run.",
  primary: { label: "Build a workflow", href: "/docs/guides/workflows" },
  secondary: { label: "See simulations", href: "/product/simulations" },
  chips: ["Capture", "Inject", "Conditions", "Retry"],
  terminal: {
    title: ".jetic/workflows/user-onboarding.json",
    lines: [
      { kind: "out", text: '{ "name": "User onboarding", "steps": [' },
      { kind: "blue", text: '  { "name": "1. Register", "method": "POST", "path": "/api/users",' },
      { kind: "out", text: '    "expectStatus": 201,' },
      { kind: "out", text: '    "body": { "email": "{{faker.internet.email}}" },' },
      { kind: "out", text: '    "captureInput": { "workflow:email": "email" } },' },
      { kind: "blue", text: '  { "name": "2. Log in", "method": "POST", "path": "/api/auth/login",' },
      { kind: "out", text: '    "body": { "email": "{{workflow:email}}" },' },
      { kind: "out", text: '    "capture": { "workflow:accessToken": "data.tokens.access" } },' },
      { kind: "blue", text: '  { "name": "3. Create order", "method": "POST", "path": "/api/orders",' },
      { kind: "out", text: '    "inject": { "header:Authorization": "Bearer {{workflow:accessToken}}" } }' },
      { kind: "out", text: "] }" },
    ],
    footer: "Same file in · same sequence out",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "STEP PRIMITIVES",
      title: "Small verbs, expressive journeys.",
      body: "Every behavior is declared in the file. There is no hidden orchestration layer and no prompt in the execution path.",
      items: [
        { title: "Request", body: "Method, path, body, query, and headers addressed through the model.", tag: "Step" },
        { title: "Capture", body: "Save response fields under a workflow key using dot-notation paths.", tag: "Memory" },
        { title: "Capture input", body: "Remember generated body fields before the request is sent.", tag: "Memory" },
        { title: "Inject", body: "Send a captured value as a header or into a later request body.", tag: "Memory" },
        { title: "Conditions", body: "Evaluate rules after a step and abort, continue, or switch workflows.", tag: "Flow" },
        { title: "Retry / status", body: "Retry transient failures and treat expected non-2xx codes as passes.", tag: "Flow" },
      ],
    },
    {
      type: "split",
      eyebrow: "MEMORY",
      title: "The login token becomes the next header.",
      body: "Captured values live in workflow memory and are read by later steps as {{workflow:key}}. That is how a generated email, a workspace ID, or an access token survives the whole journey without shell glue.",
      bullets: [
        "Capture response fields with dot notation",
        "Capture request fields before the call",
        "Inject into headers, body fields, or path params",
        "Clear memory between runs when isolation matters",
      ],
      terminal: {
        title: ".jetic/memory.json",
        lines: [
          { kind: "out", text: "workflow:userEmail    user_8f9a@example.com" },
          { kind: "out", text: "workflow:accessToken  eyJhbGciOi…" },
          { kind: "out", text: "workflow:orderId      ord_7Q2x" },
          { kind: "ok", text: "→ GET /api/orders/{{workflow:orderId}}" },
          { kind: "ok", text: "→ Authorization: Bearer {{workflow:accessToken}}" },
        ],
      },
    },
    {
      type: "steps",
      eyebrow: "FAILURE HANDLING",
      title: "Decide the edges before the run.",
      items: [
        { title: "Expected status", body: "Each step declares its status. Any 2xx passes when a 2xx is expected.", cmd: "expectStatus: 201" },
        { title: "Continue on status", body: "Treat 404 or 409 as an expected outcome for negative tests.", cmd: "continueOnStatus: [409]" },
        { title: "On failure", body: "Abort the run, or continue and skip that step's captures.", cmd: "onFailure: continue" },
        { title: "Retry", body: "Retry up to five times with a configurable delay per step or run.", cmd: "retry: { times, delayMs }" },
      ],
    },
    {
      type: "table",
      eyebrow: "FLOW CONTROL",
      title: "Conditions that actually steer the run.",
      head: ["Shape", "When it runs", "What it can do"],
      rows: [
        ["rules.all / rules.any", "After the step", "AND / OR checks over captured values; onFail abort, continue, or switch."],
        ["Legacy if guard", "Before the step", "Skip just that step when the value does not match."],
        ["switchToWorkflow", "On a failed condition", "Run another saved workflow, optionally returning afterwards."],
        ["retry", "On failure", "Retry the step before the workflow-level failure policy applies."],
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Run it, keep it, inspect it.",
      items: [
        { tag: "Run", title: "Simulations", body: "Execute the workflow against a live environment with preflight.", href: "/product/simulations" },
        { tag: "Ship", title: "Automations", body: "Schedule runs or wire them into CI and agent workflows.", href: "/product/automations" },
        { tag: "Evidence", title: "Reports", body: "Review every request, response, capture, and timing.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "WORKFLOW FAQ",
      items: [
        {
          q: "Is a workflow deterministic?",
          a: "Yes. The runner walks the JSON steps in order and checks each expectation. Conditions, retries, and failure modes are all written in the file — no model decides the path at execution time.",
        },
        {
          q: "Can steps run in parallel?",
          a: "Workflows are ordered journeys. Stateful sequences are the primary model; independent checks can live in separate workflows and run in parallel from CI.",
        },
        {
          q: "Where do generated values come from?",
          a: "Templates support faker expressions, workflow memory, human input for truly unknowable values, and scoped values. Generated values can be remembered with captureInput.",
        },
        {
          q: "Do I need to save a workflow to run it?",
          a: "You can validate an inline definition without saving. Saved workflows live in .jetic/workflows and are what the CLI, Studio, and CI execute.",
        },
      ],
    },
  ],
};

export default function WorkflowsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Write the journey",
        headlineItalic: "once.",
        body: "Capture the token, reuse the generated email, and replay the same ordered steps tomorrow. No shell glue required.",
        cta: "Open the workflow guide",
        href: "/docs/guides/workflows",
      }}
    />
  );
}
