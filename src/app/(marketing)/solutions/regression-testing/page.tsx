import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regression testing",
  description:
    "Keep the journeys that already work green: rerun the same ordered workflows after every change and inspect the trace when one breaks.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "Regression testing" }],
  eyebrow: "SOLUTIONS · REGRESSION",
  title: "Catch the break",
  titleAccent: "before the deploy.",
  description:
    "Regression testing is a memory problem: the path worked yesterday, and nothing in the diff looks related. Jetic keeps the journeys as files, runs them the same way every time, and shows exactly which step changed.",
  primary: { label: "Start a regression run", href: "/docs/start/getting-started" },
  secondary: { label: "See reports", href: "/product/reports" },
  chips: ["Repeatable", "Diffable", "CI-ready", "Step traces"],
  terminal: {
    title: "before / after",
    lines: [
      { kind: "dim", text: "baseline  4f2c1a  ✔ 5 passed  390ms" },
      { kind: "out", text: "change    orders.ts · discount guard" },
      { kind: "out", text: "run       9b81de  ✘ step 4 failed" },
      { kind: "warn", text: "expected  201 Created" },
      { kind: "warn", text: "actual    409 Conflict" },
      { kind: "blue", text: "source    src/routes/orders.ts:88" },
      { kind: "ok", text: "trace kept · failure reproduced" },
    ],
    footer: "Same workflow, same order, different result",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHY JOURNEYS REGRESS",
      title: "The diff is small. The path is not.",
      body: "Single endpoints rarely break alone. A guard, a token, or a new required field changes the sequence.",
      items: [
        { title: "New required field", body: "A step that passed now returns 422 before the next call.", tag: "Contract" },
        { title: "Auth change", body: "The token shape or scope shifts, and later calls lose access.", tag: "Auth" },
        { title: "Order dependency", body: "A side effect that used to happen earlier now happens later.", tag: "State" },
        { title: "Status drift", body: "The endpoint returns a different success code than the client expects.", tag: "HTTP" },
        { title: "Schema drift", body: "A renamed response field breaks the capture that fed the next step.", tag: "Shape" },
        { title: "Environment drift", body: "A missing secret or seed record breaks the same workflow in CI.", tag: "Env" },
      ],
    },
    {
      type: "split",
      eyebrow: "THE BASELINE",
      title: "A workflow is a baseline you can read.",
      body: "Instead of a wall of scripts, the regression suite is a set of small ordered files. Review the diff, run the file, and compare the trace.",
      bullets: [
        "The sequence is explicit and versioned",
        "Expected status is visible next to each step",
        "Captured values show what the run depended on",
        "A failure links back to the endpoint source",
      ],
      terminal: {
        title: "regression.yml",
        lines: [
          { kind: "dim", text: "on: pull_request" },
          { kind: "out", text: "steps:" },
          { kind: "out", text: "  - run: jetic scan" },
          { kind: "out", text: "  - run: jetic simulate workflow checkout" },
          { kind: "out", text: "  - run: jetic simulate workflow onboarding" },
          { kind: "ok", text: "  ✔ upload .jetic/runs on failure" },
        ],
      },
      reverse: true,
      link: { label: "Put it in the pipeline", href: "/solutions/ci-cd" },
    },
    {
      type: "steps",
      eyebrow: "A WORKING LOOP",
      title: "Small suite, high signal.",
      items: [
        { title: "Cover", body: "Pick the journeys that would hurt if they broke.", cmd: "3–7 flows" },
        { title: "Baseline", body: "Get them green and commit the workflows.", cmd: ".jetic/" },
        { title: "Run", body: "Execute on every change to the API.", cmd: "CI job" },
        { title: "Triage", body: "Open the trace, fix the source, rerun.", cmd: "runId" },
      ],
    },
    {
      type: "specs",
      eyebrow: "SIGNAL QUALITY",
      title: "Keep the suite worth running.",
      rows: [
        { k: "Deterministic", v: "The same workflow file and environment should produce the same result. Flakiness is a bug to investigate, not retry away." },
        { k: "Isolated", v: "Run against disposable data. Reusing a shared account makes failures ambiguous." },
        { k: "Owned", v: "A failing regression should have a clear owner in the code, not just in the test suite." },
        { k: "Fast enough", v: "A handful of critical journeys beats a huge suite nobody waits for." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Regression is a habit, not a tool.",
      items: [
        { tag: "Solution", title: "CI/CD", body: "Run the suite on every push and keep the trace.", href: "/solutions/ci-cd" },
        { tag: "Product", title: "Reports", body: "Read the run the way you read a stack trace.", href: "/product/reports" },
        { tag: "Compare", title: "Jetic vs Postman", body: "Collections versus stateful regression journeys.", href: "/compare/postman" },
      ],
    },
    {
      type: "faq",
      eyebrow: "REGRESSION FAQ",
      items: [
        { q: "How many workflows should we start with?", a: "Three to seven critical journeys. Add one when a real regression escapes." },
        { q: "Do workflows need maintenance?", a: "Yes. When the API changes, rescan the model and update the affected steps. The diff makes the change visible." },
        { q: "Can a regression run create data?", a: "Yes. Prefer a disposable environment or add cleanup steps to the end of the workflow." },
        { q: "What if a test is flaky?", a: "Retries exist, but they hide the problem. Treat repeated flakiness as a real investigation item." },
      ],
    },
  ],
};

export default function RegressionTestingPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Remember the path.",
        headlineItalic: "Run it every time.",
        body: "Keep the critical journeys in the repository and let the trace tell you what changed.",
        cta: "Start a regression suite",
        href: "/sign-up",
      }}
    />
  );
}
