import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automations",
  description:
    "Put deterministic API behavior on a schedule, in CI, or behind an AI agent. Same workflows, same model, no model in the execution path.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "Automations" }],
  eyebrow: "PRODUCT · AUTOMATIONS",
  title: "Behavior checks that run",
  titleAccent: "without you.",
  description:
    "Automations take the workflows you already trust and run them where the work happens: on a schedule, in a pull request, or from an AI agent over MCP. Execution stays deterministic.",
  primary: { label: "Wire up CI", href: "/solutions/ci-cd" },
  secondary: { label: "Connect an agent", href: "/product/external-agent" },
  chips: ["Scheduled runs", "CI-friendly", "Diff-aware", "MCP authoring"],
  terminal: {
    title: "ci.yml",
    lines: [
      { kind: "out", text: "- name: Jetic API behavior" },
      { kind: "out", text: "  run: |" },
      { kind: "cmd", text: "npx jetic simulate workflow --workflow .jetic/workflows/checkout.json" },
      { kind: "out", text: "  env:" },
      { kind: "out", text: "    JETIC_API_KEY: ${{ secrets.JETIC_API_KEY }}" },
      { kind: "ok", text: "✔ 4 passed · 1 skipped · trace uploaded as artifact" },
    ],
    footer: "Workflows are files, so a job is one command",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHERE RUNS LIVE",
      title: "One workflow, several triggers.",
      body: "Because a workflow is a file in the repository, automation is a matter of invoking the same command with the right environment and credentials.",
      items: [
        { title: "CI jobs", body: "Run affected workflows on a pull request or before a deploy.", tag: "CI" },
        { title: "Schedules", body: "Run critical journeys periodically to catch behavior drift.", tag: "Cron" },
        { title: "Diff awareness", body: "Map changed source files to the endpoints and workflows they affect.", tag: "Smart" },
        { title: "Agent authoring", body: "Let an AI coding agent draft and validate workflows over MCP.", tag: "MCP" },
        { title: "Environment targets", body: "Run the same file against local, staging, or production endpoints.", tag: "Env" },
        { title: "Stored evidence", body: "Every automated run leaves a trace for review and debugging.", tag: "Trace" },
      ],
    },
    {
      type: "split",
      eyebrow: "DIFF-AWARE",
      title: "Run what your change touched.",
      body: "The model knows which source file defines each route. When a diff touches orders.ts, Jetic can narrow the run to the endpoints and workflows that depend on those routes instead of replaying everything.",
      bullets: [
        "Source lines link endpoints back to files",
        "The change scanner records edits while jetic dev runs",
        "Affected workflows can be selected before execution",
        "Unrelated long journeys stay out of the hot path",
      ],
      terminal: {
        title: "jetic_get_changes",
        lines: [
          { kind: "out", text: "hasChanges: true" },
          { kind: "blue", text: "src/routes/orders.ts" },
          { kind: "blue", text: "src/middleware/auth.ts" },
          { kind: "ok", text: "→ 3 endpoints affected" },
          { kind: "ok", text: "→ 2 workflows selected: checkout-flow, refund-chain" },
          { kind: "cmd", text: "jetic simulate workflow --workflow .jetic/workflows/checkout-flow.json" },
        ],
      },
      link: { label: "See CI/CD solutions", href: "/solutions/ci-cd" },
    },
    {
      type: "steps",
      eyebrow: "AUTOMATION LOOP",
      title: "Detect, select, run, review.",
      items: [
        { title: "Detect", body: "A commit, schedule, or agent request starts the loop.", cmd: "git diff · cron · MCP" },
        { title: "Select", body: "Resolve the environment and the workflows that matter.", cmd: "--workflow <name>" },
        { title: "Run", body: "Execute the same deterministic file the team reviewed.", cmd: "jetic simulate workflow" },
        { title: "Review", body: "Publish the trace and fail the job on a real regression.", cmd: ".jetic/runs/<runId>/" },
      ],
    },
    {
      type: "specs",
      eyebrow: "OPERATIONS",
      title: "Built for the places tests already live.",
      body: "No proprietary runner to install in your pipeline and no model call required to execute a workflow.",
      rows: [
        { k: "Runtime", v: "Node.js 20.19 or newer. Install the CLI in the job, or run it from a workspace that already has it." },
        { k: "Credentials", v: "Provide environment credentials as job secrets. The model stores references, and reports redact values." },
        { k: "Artifacts", v: "Write run reports to .jetic/runs and publish them as CI artifacts for review." },
        { k: "Exit code", v: "A failed expectation fails the run and returns a non-zero exit code, so the job stops." },
        { k: "Agent boundary", v: "An MCP client can author and validate workflows. It does not need to be present while the runner executes them." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Automate the right layer.",
      items: [
        { tag: "Pipeline", title: "CI/CD workflows", body: "Add deterministic API checks to the deploy path.", href: "/solutions/ci-cd" },
        { tag: "Agents", title: "External agent", body: "Connect Claude Code, Cursor, Codex, and more over MCP.", href: "/product/external-agent" },
        { tag: "Evidence", title: "Reports", body: "See exactly what an automated run sent and received.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "AUTOMATION FAQ",
      items: [
        {
          q: "Do automations consume AI tokens?",
          a: "Execution does not. The workflow runner is deterministic. If an AI agent authors or edits a workflow, that agent's own model usage is separate.",
        },
        {
          q: "Can a scheduled run prompt for an OTP?",
          a: "Use human-input templates only for values that truly cannot be generated. In CI, supply those values through environment variables so the run never blocks.",
        },
        {
          q: "What if the environment is down?",
          a: "Preflight checks the target before step one. By default an unreachable target aborts the run with a clear reason instead of producing misleading step failures.",
        },
        {
          q: "Can I run only the workflows affected by a diff?",
          a: "Yes. The model links routes to source files, and change tracking identifies affected endpoints. Use that selection to choose workflows before invoking the runner.",
        },
      ],
    },
  ],
};

export default function AutomationsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Put behavior",
        headlineItalic: "on autopilot.",
        body: "Take the workflows you already review and run them on every change, every schedule, or every agent request.",
        cta: "Explore CI/CD",
        href: "/solutions/ci-cd",
      }}
    />
  );
}
