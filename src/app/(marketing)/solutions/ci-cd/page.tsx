import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CI/CD",
  description:
    "Run deterministic API workflows in the pipeline: one command, clear exit codes, and a trace artifact when something fails.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "CI/CD" }],
  eyebrow: "SOLUTIONS · CI/CD",
  title: "From workflow",
  titleAccent: "to pipeline.",
  description:
    "The value of a workflow is that it runs the same way every time. Jetic is built for that: file-based definitions, a preflight check, a single command, and a non-zero exit when the behavior is wrong.",
  primary: { label: "Set up Jetic", href: "/docs/start/getting-started" },
  secondary: { label: "See simulations", href: "/product/simulations" },
  chips: ["One command", "Exit codes", "Artifacts", "No AI key"],
  terminal: {
    title: "ci job",
    lines: [
      { kind: "cmd", text: "jetic simulate workflow checkout" },
      { kind: "dim", text: "preflight  http://api:3000 · reachable" },
      { kind: "out", text: "step 1  login          200   61ms" },
      { kind: "out", text: "step 2  create order   201  143ms" },
      { kind: "warn", text: "step 3  fetch order    500   48ms" },
      { kind: "warn", text: "✘ workflow failed · exit 1" },
      { kind: "blue", text: "artifact  .jetic/runs/2026-10-22T09-14-02/" },
    ],
    footer: "Fail the job, keep the evidence",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "PIPELINE PROPERTIES",
      title: "Designed to be a step, not a project.",
      body: "No browser, no desktop app, no model provider, and no hidden service required for execution.",
      items: [
        { title: "Non-zero on failure", body: "A failed step fails the command, so the pipeline stops where it should.", tag: "Signal" },
        { title: "Preflight", body: "An unreachable target fails fast with a clear reason instead of five confusing step errors.", tag: "Guard" },
        { title: "Artifacts", body: "Run folders contain the requests, responses, captures, and timings.", tag: "Evidence" },
        { title: "File-based", body: "Workflows and the model are in the repository and diff in pull requests.", tag: "Review" },
        { title: "Environment-aware", body: "Choose local, staging, or another base URL per run.", tag: "Target" },
        { title: "No inference", body: "Execution is deterministic and does not depend on an AI provider.", tag: "Cost" },
      ],
    },
    {
      type: "steps",
      eyebrow: "WIRING IT UP",
      title: "Four lines in the job.",
      items: [
        { title: "Install", body: "Add the Jetic CLI to the job image.", cmd: "npm i -g jetic-cli" },
        { title: "Scan", body: "Build the model from the checked-out source.", cmd: "jetic scan" },
        { title: "Run", body: "Execute the named workflow against the target.", cmd: "jetic simulate workflow checkout" },
        { title: "Keep", body: "Upload the run folder on failure or always.", cmd: ".jetic/runs/<runId>/" },
      ],
    },
    {
      type: "split",
      eyebrow: "FAILURES",
      title: "A red job should explain itself.",
      body: "The trace keeps the resolved request and the actual response, so the failure can be understood without reproducing the environment by hand.",
      bullets: [
        "The exact step that failed",
        "The expected and actual status",
        "The request after templates were resolved",
        "The capture that was missing or wrong",
      ],
      terminal: {
        title: "artifact contents",
        lines: [
          { kind: "out", text: "report.json" },
          { kind: "out", text: "steps/04-orders.json" },
          { kind: "out", text: "  request   POST /api/orders" },
          { kind: "out", text: "  status    500" },
          { kind: "blue", text: "  capture   orderId ← missing" },
          { kind: "warn", text: "  error     expected 201, got 500" },
        ],
      },
    },
    {
      type: "specs",
      eyebrow: "PIPELINE HYGIENE",
      title: "A few rules that keep it useful.",
      rows: [
        { k: "Disposable data", v: "Run against an environment you can reset. Shared state makes regressions ambiguous." },
        { k: "Secrets", v: "Provide credentials through the CI secret store and reference them from the environment." },
        { k: "Upload traces", v: "Keep the run folder even on success for a short window; always keep it on failure." },
        { k: "Scope", v: "A small set of critical journeys is a better gate than a long suite nobody trusts." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Close the loop.",
      items: [
        { tag: "Solution", title: "Regression testing", body: "Choose the journeys worth gating a deploy on.", href: "/solutions/regression-testing" },
        { tag: "Product", title: "Reports", body: "The artifact your CI job keeps.", href: "/product/reports" },
        { tag: "Docs", title: "CLI reference", body: "Commands, flags, and exit behavior.", href: "/docs/reference/cli-reference" },
      ],
    },
    {
      type: "faq",
      eyebrow: "CI FAQ",
      items: [
        { q: "Do I need a browser in the CI image?", a: "No. Jetic is a CLI and sends HTTP requests. It does not drive a browser." },
        { q: "Can I choose the environment per job?", a: "Yes. Select a named environment or override the base URL for the run." },
        { q: "Does a simulation need an AI key?", a: "No. The core runner is deterministic and keyless." },
        { q: "What should the pipeline upload?", a: "The .jetic/runs/<runId>/ folder for the run, especially on failure." },
      ],
    },
  ],
};

export default function CiCdPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "One command.",
        headlineItalic: "One clear answer.",
        body: "Run the same workflow locally and in CI, and keep the trace when the answer is no.",
        cta: "Start with Jetic",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
