import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get unblocked with Jetic: check the docs, collect the right trace, and contact the team with the context needed for a fast answer.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Support" }],
  eyebrow: "RESOURCES · SUPPORT",
  title: "Unblock the",
  titleAccent: "next step.",
  description:
    "Most questions are answered by the docs or by reading the run trace. When they are not, send the workflow, the trace, and the target context so the team can reproduce the problem instead of guessing.",
  primary: { label: "Contact support", href: "/contact" },
  secondary: { label: "Read the docs", href: "/docs" },
  chips: ["Docs first", "Trace-driven", "Clear context", "No secrets"],
  terminal: {
    title: "support checklist",
    lines: [
      { kind: "out", text: "version      jetic --version" },
      { kind: "out", text: "target       local · staging" },
      { kind: "out", text: "command      the exact command" },
      { kind: "out", text: "workflow     .jetic/workflows/*.json" },
      { kind: "out", text: "trace        .jetic/runs/<runId>/" },
      { kind: "warn", text: "redact       tokens · cookies · personal data" },
      { kind: "ok", text: "→ reproducible report" },
    ],
    footer: "The five things every report needs",
  },
  blocks: [
    {
      type: "steps",
      eyebrow: "BEFORE YOU WRITE",
      title: "Three fast checks.",
      items: [
        { title: "Verify the model", body: "Inspect the model and fix missing fields or dangling links.", cmd: "jetic inspect" },
        { title: "Read the trace", body: "Open the failing step and compare expected and actual status.", cmd: "jetic dev" },
        { title: "Retry once", body: "Confirm the failure is reproducible before changing anything.", cmd: "jetic simulate workflow" },
      ],
    },
    {
      type: "table",
      eyebrow: "TRIAGE",
      title: "Match the symptom to the first move.",
      body: "These cover the most common support requests.",
      head: ["Symptom", "Likely cause", "First move"],
      rows: [
        ["Scan finds no routes", "Entry file or tsconfig not detected", "Confirm the Express app entry and run scan from the project root"],
        ["Login step is 401", "Wrong credentials or missing environment", "Check the target environment and the login request body"],
        ["A template is unresolved", "A capture is missing or misnamed", "Open the producing step and compare the response path"],
        ["Run fails before step one", "The target is unreachable", "Check the base URL and start the server"],
        ["Everything passes locally, fails in CI", "Different environment or data", "Compare target, secrets, and seed state"],
        ["A report is missing a value", "The capture path did not match", "Inspect the response and correct the dot path"],
      ],
    },
    {
      type: "split",
      eyebrow: "A GOOD REPORT",
      title: "Reproducible beats detailed.",
      body: "The goal is a report someone else can run. Include the files, not just a description of the files.",
      bullets: [
        "The exact command and workflow name",
        "The run id or the run folder",
        "The target environment and Jetic version",
        "What you expected and what happened",
      ],
      terminal: {
        title: "minimal report",
        lines: [
          { kind: "out", text: "command   jetic simulate workflow checkout" },
          { kind: "out", text: "run       2026-10-22T09-14-02" },
          { kind: "out", text: "target    staging" },
          { kind: "warn", text: "expected  step 3 → 201" },
          { kind: "warn", text: "actual    step 3 → 409" },
          { kind: "blue", text: "attached  workflow + trace (redacted)" },
        ],
      },
      reverse: true,
      link: { label: "Read the artifact docs", href: "/docs/reference/artifacts" },
    },
    {
      type: "specs",
      eyebrow: "SCOPE",
      title: "What support can help with.",
      rows: [
        { k: "Product behavior", v: "Scanning, modeling, validation, workflow execution, and run traces." },
        { k: "Setup", v: "Installation, CLI usage, environment configuration, and MCP connection." },
        { k: "Your API", v: "Jetic-specific issues. Debugging your application code is outside support scope." },
        { k: "Security", v: "Report vulnerabilities privately through the security page, not a public support request." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Self-serve first.",
      items: [
        { tag: "Docs", title: "Getting started", body: "The canonical setup path.", href: "/docs/start/getting-started" },
        { tag: "Docs", title: "CLI reference", body: "Commands, flags, and outputs.", href: "/docs/reference/cli-reference" },
        { tag: "Company", title: "Security", body: "How to report a vulnerability.", href: "/security" },
      ],
    },
    {
      type: "faq",
      eyebrow: "SUPPORT FAQ",
      items: [
        { q: "What should I include in a support request?", a: "Version, target, command, workflow, run id or trace, expected behavior, and actual behavior. Redact secrets." },
        { q: "Do I need to share my whole repository?", a: "No. The model, the affected workflow, and the trace are usually enough." },
        { q: "Can support debug my application?", a: "Support covers Jetic behavior and setup. Application bugs are the responsibility of your team." },
        { q: "Where do security issues go?", a: "Report them privately using the process on the security page." },
      ],
    },
  ],
};

export default function SupportPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Send the trace.",
        headlineItalic: "Skip the guessing.",
        body: "A reproducible report with the workflow and run folder gets to an answer faster.",
        cta: "Contact support",
        href: "/contact",
      }}
    />
  );
}
