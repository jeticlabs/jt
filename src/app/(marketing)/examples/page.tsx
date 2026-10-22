import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Examples",
  description:
    "Copyable workflow patterns for auth handoff, create-and-read, negative paths, conditions, retries, and CI runs.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Developers" }, { label: "Examples" }],
  eyebrow: "DEVELOPERS · EXAMPLES",
  title: "Start from",
  titleAccent: "a working shape.",
  description:
    "The fastest workflow is usually a variation of one you have seen. These patterns cover the handoffs that appear in almost every API journey.",
  primary: { label: "Read the workflow guide", href: "/docs/guides/workflows" },
  secondary: { label: "Try the quickstart", href: "/docs/quickstart" },
  chips: ["Patterns", "JSON", "Auth", "CI"],
  terminal: {
    title: "checkout.json · excerpt",
    lines: [
      { kind: "out", text: "{" },
      { kind: "out", text: "  \"name\": \"checkout\"," },
      { kind: "out", text: "  \"steps\": [" },
      { kind: "blue", text: "    { \"method\": \"POST\", \"path\": \"/api/auth/login\"," },
      { kind: "blue", text: "      \"capture\": { \"workflow:token\": \"data.accessToken\" } }," },
      { kind: "out", text: "    { \"method\": \"POST\", \"path\": \"/api/orders\"," },
      { kind: "out", text: "      \"inject\": { \"header:Authorization\": \"{{workflow:token}}\" } }" },
      { kind: "out", text: "  ]" },
      { kind: "out", text: "}" },
    ],
    footer: "Captures feed injects; steps stay ordered",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "PATTERNS",
      title: "Six shapes that cover a lot of ground.",
      body: "Each pattern maps to fields in a normal workflow file.",
      items: [
        { title: "Token handoff", body: "Capture a bearer token from login and inject it into protected routes.", tag: "Auth" },
        { title: "Create, then read", body: "Capture an id from a 201 response and use it in the next path.", tag: "State" },
        { title: "Expected failure", body: "Assert a 4xx and inspect the error code without aborting the run.", tag: "Negative" },
        { title: "Role branch", body: "Check a captured role and continue or abort based on the result.", tag: "Condition" },
        { title: "Retry with delay", body: "Bounded retries for a dependency that is eventually consistent.", tag: "Retry" },
        { title: "CI baseline", body: "Run the same workflow on every pull request and keep the trace.", tag: "CI" },
      ],
    },
    {
      type: "steps",
      eyebrow: "ANATOMY",
      title: "The fields behind the patterns.",
      items: [
        { title: "Steps", body: "Ordered calls with a method, path, and optional body.", cmd: "steps[]" },
        { title: "Capture", body: "Write a response field to workflow memory.", cmd: "capture" },
        { title: "Inject", body: "Read memory into a header, body, or query.", cmd: "inject" },
        { title: "Expect", body: "Declare the status that counts as success.", cmd: "expectStatus" },
      ],
    },
    {
      type: "table",
      eyebrow: "EXAMPLE MAP",
      title: "Where each pattern is documented.",
      body: "The docs go deeper on syntax and edge cases.",
      head: ["Pattern", "Use when", "Reference"],
      rows: [
        ["Token handoff", "Protected routes need a session", "Workflow guide · capture and inject"],
        ["Create then read", "A generated id is needed later", "Workflow guide · memory"],
        ["Expected failure", "A 4xx is part of correct behavior", "CLI reference · exit behavior"],
        ["Role branch", "The next step depends on a claim", "Workflow guide · conditions"],
        ["Retry", "A dependency is eventually consistent", "Workflow guide · retry"],
        ["CI baseline", "A journey must gate a merge", "Artifacts · run folders"],
      ],
    },
    {
      type: "split",
      eyebrow: "START SMALL",
      title: "Three endpoints are enough.",
      body: "A useful example does not need to cover the whole product. Login, create, read is enough to demonstrate state, auth, and assertions.",
      bullets: [
        "One producer of a token",
        "One step that changes state",
        "One step that verifies the change",
        "One trace that proves the sequence",
      ],
      terminal: {
        title: "first-flow",
        lines: [
          { kind: "out", text: "1. POST /api/auth/login" },
          { kind: "blue", text: "   capture accessToken" },
          { kind: "out", text: "2. POST /api/orders" },
          { kind: "blue", text: "   inject Authorization" },
          { kind: "blue", text: "   capture orderId" },
          { kind: "out", text: "3. GET /api/orders/:orderId" },
          { kind: "ok", text: "✔ 3 passed · trace saved" },
        ],
      },
      reverse: true,
      link: { label: "Scaffold a workflow", href: "/docs/guides/workflows" },
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Take the pattern into the product.",
      items: [
        { tag: "Product", title: "Workflows", body: "The full execution model.", href: "/product/workflows" },
        { tag: "Guide", title: "Tutorials", body: "Step-by-step paths from install to run.", href: "/tutorials" },
        { tag: "Docs", title: "CLI reference", body: "Commands and flags.", href: "/docs/reference/cli-reference" },
      ],
    },
  ],
};

export default function ExamplesPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Borrow the shape.",
        headlineItalic: "Make it yours.",
        body: "Start from a three-step pattern, then add the state and assertions your API needs.",
        cta: "Open the workflow guide",
        href: "/docs/guides/workflows",
      }}
    />
  );
}
