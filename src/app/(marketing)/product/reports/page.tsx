import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "Every Jetic run is stored as evidence: requests, responses, captures, timings, and errors for each step, ready to inspect or share.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "Reports" }],
  eyebrow: "PRODUCT · REPORTS",
  title: "Every run leaves",
  titleAccent: "evidence.",
  description:
    "A report is not a pass/fail badge. It is the full story of a run: what was sent, what came back, which values were captured, and where time or behavior diverged. Jetic stores that story for every simulation.",
  primary: { label: "See a simulation", href: "/product/simulations" },
  secondary: { label: "Open the CLI docs", href: "/docs/reference/cli-reference" },
  chips: ["Step traces", "Request + response", "Captures", "Timings"],
  terminal: {
    title: ".jetic/runs/2026-10-22T09-14-02/",
    lines: [
      { kind: "out", text: "report.json      full run summary" },
      { kind: "out", text: "steps/            one record per request" },
      { kind: "ok", text: "✔ 1. register          201   98ms" },
      { kind: "ok", text: "✔ 2. login             200   61ms" },
      { kind: "dim", text: "– 3. verify 2fa        skipped" },
      { kind: "ok", text: "✔ 4. create order      201  143ms" },
      { kind: "ok", text: "✔ 5. fetch order       200   54ms" },
      { kind: "blue", text: "4 passed · 1 skipped · 356ms total" },
    ],
    footer: "Requests · responses · captures · errors · timings",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "IN THE RECORD",
      title: "Read a run the way you read a stack trace.",
      body: "Start at the failing step, see the exact request, compare the response, and follow the captured value back to the step that produced it.",
      items: [
        { title: "Run summary", body: "Status, step counts, duration, environment, and the workflow file.", tag: "Overview" },
        { title: "Step requests", body: "Method, resolved path, headers, query, and body that were actually sent.", tag: "Input" },
        { title: "Step responses", body: "Status, headers, payload, and validation result for each call.", tag: "Output" },
        { title: "Captures", body: "Which memory keys were written or injected at each step.", tag: "Memory" },
        { title: "Timings", body: "Per-step latency and total run duration to expose slow paths.", tag: "Perf" },
        { title: "Errors", body: "Unresolved templates, failed assertions, timeouts, and transport errors.", tag: "Debug" },
      ],
    },
    {
      type: "split",
      eyebrow: "DEBUGGING",
      title: "From a red step to the line of code.",
      body: "The trace links the failing endpoint back to its source through the model, and the report shows the resolved request so you can reproduce it manually if you want to.",
      bullets: [
        "Copy the resolved request into curl when you need a second opinion",
        "See which capture was missing before guessing",
        "Compare the expected status with the actual response",
        "Open the same run in Studio as an interactive step graph",
      ],
      terminal: {
        title: "step 4 · POST /api/orders",
        lines: [
          { kind: "out", text: "status      201 Created" },
          { kind: "out", text: "duration    143ms" },
          { kind: "out", text: "injected    Authorization: Bearer eyJhbGciOi…" },
          { kind: "out", text: "captured    workflow:orderId ← data.order.id" },
          { kind: "ok", text: "schema      Order — valid" },
          { kind: "blue", text: "source      src/routes/orders.ts:67" },
        ],
      },
      reverse: true,
      link: { label: "How memory flows", href: "/product/workflows" },
    },
    {
      type: "steps",
      eyebrow: "FROM RUN TO REVIEW",
      title: "A report you can act on.",
      items: [
        { title: "Open", body: "Open Studio and choose a run from the recent traces.", cmd: "jetic dev" },
        { title: "Inspect", body: "Walk the steps and open the exact request and response.", cmd: ".jetic/runs/<runId>/" },
        { title: "Compare", body: "Re-run after a fix and compare status, timings, and captures.", cmd: "jetic simulate workflow" },
        { title: "Share", body: "Commit or attach the run folder so the team sees the evidence.", cmd: ".jetic/runs/" },
      ],
    },
    {
      type: "specs",
      eyebrow: "REPORTING BOUNDARIES",
      title: "Useful evidence, without leaking secrets.",
      rows: [
        { k: "Redaction", v: "Secret values are not written into reports. Headers show the injected credential reference rather than the raw value where possible." },
        { k: "Retention", v: "Run folders stay in your workspace until you remove them. Treat them like any other build artifact." },
        { k: "Portability", v: "Reports are files on disk, so they can be committed, archived, or published by your CI job." },
        { k: "Scope", v: "A report describes what Jetic observed. It is not a claim about every path the application could take." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Keep the evidence loop tight.",
      items: [
        { tag: "Run", title: "Simulations", body: "Generate traces from stateful workflows against a live server.", href: "/product/simulations" },
        { tag: "Automate", title: "Automations", body: "Publish run artifacts from CI, schedules, and agents.", href: "/product/automations" },
        { tag: "Debug", title: "Workflows", body: "Add failure modes and captures that make reports useful.", href: "/product/workflows" },
      ],
    },
    {
      type: "faq",
      eyebrow: "REPORT FAQ",
      items: [
        {
          q: "What is stored for each run?",
          a: "The run summary, every step's request and response, captures, injected memory, status assertions, timings, and errors. The exact shape is under .jetic/runs/<runId>/.",
        },
        {
          q: "Can I download a report?",
          a: "Reports are files in the workspace, so you can copy, commit, or upload the run folder from your own tooling.",
        },
        {
          q: "Do reports contain my auth token?",
          a: "Jetic avoids writing raw secret values into reports. Treat run folders as sensitive anyway and keep them out of public artifacts.",
        },
        {
          q: "Can I compare two runs?",
          a: "Open both run folders and compare statuses, timings, and captures. Studio is the fastest way to walk two traces side by side.",
        },
      ],
    },
  ],
};

export default function ReportsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Keep the proof,",
        headlineItalic: "not just the pass.",
        body: "Run a workflow and keep the full trace: requests, responses, memory, timing, and the source line behind every step.",
        cta: "Start a run",
        href: "/sign-up",
      }}
    />
  );
}
