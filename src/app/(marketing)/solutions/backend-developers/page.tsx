import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For backend developers",
  description:
    "Model the API from the code you already wrote, then run the journeys that matter against the real server.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "Backend developers" }],
  eyebrow: "SOLUTIONS · BACKEND",
  title: "You shipped the route.",
  titleAccent: "Now prove the journey.",
  description:
    "Backend work does not end at a green unit test. The token has to reach the next call, the order has to exist, and the response has to match the contract. Jetic models those journeys from your Express source and runs them without a browser.",
  primary: { label: "Model your API", href: "/docs/start/getting-started" },
  secondary: { label: "See the scanner", href: "/product/api-model" },
  chips: ["Express + TypeScript", "Stateful", "CLI-first", "Traceable"],
  terminal: {
    title: "jetic scan",
    lines: [
      { kind: "cmd", text: "jetic_scan" },
      { kind: "dim", text: "reading tsconfig.json · src/app.ts" },
      { kind: "out", text: "routes       24" },
      { kind: "out", text: "middleware   auth, validate, rateLimit" },
      { kind: "out", text: "schemes      bearerAuth ← POST /api/auth/login" },
      { kind: "ok", text: "✔ model written to .jetic/model.json" },
      { kind: "blue", text: "next: scaffold a workflow from 3 endpoints" },
    ],
    footer: "Static scan · no server required",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "THE GAP AFTER UNIT TESTS",
      title: "The interesting bugs live between the calls.",
      body: "Jetic focuses on the behavior a handler cannot see on its own.",
      items: [
        { title: "Auth handoff", body: "The token from login is captured and injected into the next protected call.", tag: "Auth" },
        { title: "Generated ids", body: "A created resource id can be captured and reused in the following steps.", tag: "State" },
        { title: "Middleware effects", body: "Validation, rate limits, and guards are part of the model, not assumptions.", tag: "Model" },
        { title: "Contract drift", body: "Expected status and response shape are checked on every step.", tag: "Contract" },
        { title: "Failure paths", body: "Negative journeys assert the error a client actually receives.", tag: "Edges" },
        { title: "Fast feedback", body: "Run the journey in seconds without a full end-to-end environment.", tag: "Loop" },
      ],
    },
    {
      type: "split",
      eyebrow: "THE LOOP",
      title: "From source to trace in one sitting.",
      body: "Scan once, scaffold the journey, review the file, and run it. When a handler changes, rescan and rerun the same workflow.",
      bullets: [
        "No hand-maintained list of URLs",
        "No custom script to move a token between requests",
        "No model in the execution path",
        "The failing step points back to the source line",
      ],
      terminal: {
        title: "checkout-flow.json",
        lines: [
          { kind: "out", text: "1. login        POST /api/auth/login" },
          { kind: "blue", text: "   capture      accessToken" },
          { kind: "out", text: "2. add item     POST /api/cart/items" },
          { kind: "blue", text: "   inject       Authorization" },
          { kind: "out", text: "3. checkout     POST /api/orders" },
          { kind: "blue", text: "   capture      orderId" },
          { kind: "ok", text: "✔ 3 passed · 412ms" },
        ],
      },
      link: { label: "How workflows work", href: "/product/workflows" },
    },
    {
      type: "steps",
      eyebrow: "ADOPTION",
      title: "A small first slice.",
      items: [
        { title: "Scan", body: "Point Jetic at the Express project and build the model.", cmd: "jetic scan" },
        { title: "Author", body: "Pick the endpoints of one important journey in Studio.", cmd: "jetic dev" },
        { title: "Run", body: "Execute against local and keep the trace.", cmd: "jetic simulate workflow" },
        { title: "Commit", body: "Review the workflow and model in the pull request.", cmd: ".jetic/" },
      ],
    },
    {
      type: "specs",
      eyebrow: "BOUNDARIES",
      title: "What it is, what it is not.",
      rows: [
        { k: "Today", v: "Static scanning for Express + TypeScript, HTTP workflows, and deterministic execution." },
        { k: "Not a profiler", v: "Jetic measures request timing in a trace. It is not a load or performance testing suite." },
        { k: "Not a mock server", v: "Simulations run against a real target environment, not a generated stub." },
        { k: "Reviewable", v: "The model and workflows are files. They diff, they merge, and they live with the code." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Go from one flow to a suite.",
      items: [
        { tag: "Product", title: "Schema & security", body: "See how auth schemes and constraints enter the model.", href: "/product/schema-security" },
        { tag: "Solution", title: "Regression testing", body: "Make the journey part of every change.", href: "/solutions/regression-testing" },
        { tag: "Compare", title: "Jetic vs REST Assured", body: "Language-agnostic workflows versus tests in Java.", href: "/compare/rest-assured" },
      ],
    },
  ],
};

export default function BackendDevelopersPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Build the route.",
        headlineItalic: "Keep the proof.",
        body: "Scan your Express app, run one real journey, and see the trace before you decide anything else.",
        cta: "Start with a scan",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
