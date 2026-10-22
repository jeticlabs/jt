import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team workspaces",
  description:
    "One behavioral model, one set of workflows, and one place for run evidence, shared through the repository instead of a private cloud workspace.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "Team workspaces" }],
  eyebrow: "SOLUTIONS · TEAMS",
  title: "One model.",
  titleAccent: "Every teammate.",
  description:
    "A team should not have to ask which collection is current or whose environment has the right token. Jetic keeps the API behavior in the project: the model, the workflows, and the runs are shared files with a reviewable history.",
  primary: { label: "Model your API", href: "/docs/start/getting-started" },
  secondary: { label: "See workflows", href: "/product/workflows" },
  chips: ["Shared files", "Reviewable", "Environment-aware", "Traceable"],
  terminal: {
    title: "the shared surface",
    lines: [
      { kind: "out", text: ".jetic/model.json          24 endpoints" },
      { kind: "out", text: ".jetic/workflows/          checkout · onboarding" },
      { kind: "out", text: ".jetic/runs/               traces from every run" },
      { kind: "dim", text: "          ↑ reviewed in the same pull request" },
      { kind: "ok", text: "✔ one source of truth for behavior" },
    ],
    footer: "No private workspace to keep in sync",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "SHARED BY DEFAULT",
      title: "The project is the workspace.",
      body: "Jetic does not create a second place where API knowledge lives. The repository already has history, review, and access control.",
      items: [
        { title: "Model", body: "Endpoints, middleware, and security schemes in one file.", tag: "Shared" },
        { title: "Workflows", body: "Small ordered files for the journeys the team cares about.", tag: "Shared" },
        { title: "Runs", body: "Traces that can be attached to a review or kept by CI.", tag: "Evidence" },
        { title: "Environments", body: "Named targets with secret references instead of pasted values.", tag: "Config" },
        { title: "Review", body: "Behavior changes show up as diffs in the pull request.", tag: "Git" },
        { title: "Onboarding", body: "A new teammate reads the model and workflows to learn the API.", tag: "Context" },
      ],
    },
    {
      type: "split",
      eyebrow: "THE OLD WAY",
      title: "No more “works on my collection.”",
      body: "When test state lives in a personal client, the team inherits an invisible dependency. Files in the repository make the dependency visible.",
      bullets: [
        "The endpoint definition is not retyped per person",
        "The auth handoff is part of the workflow, not local setup",
        "The expected status is reviewed with the code",
        "The failure trace can be opened by anyone",
      ],
      terminal: {
        title: "pull request",
        lines: [
          { kind: "out", text: "src/routes/orders.ts        +12 −3" },
          { kind: "out", text: ".jetic/model.json           2 endpoints updated" },
          { kind: "blue", text: ".jetic/workflows/checkout.json  step 2 changed" },
          { kind: "ok", text: "✔ verify model" },
          { kind: "ok", text: "✔ simulate checkout" },
        ],
      },
      link: { label: "How models are verified", href: "/product/schema-security" },
    },
    {
      type: "table",
      eyebrow: "WORKSPACE CHOICES",
      title: "Where should behavior live?",
      body: "Each option has a cost. The point is to choose it deliberately.",
      head: ["Option", "Strength", "Trade-off"],
      rows: [
        ["Personal client", "Fast for one person", "Invisible to the team and to CI"],
        ["Cloud workspace", "Easy sharing inside one product", "Another source of truth to keep in sync"],
        ["Repository files", "Reviewable, portable, CI-native", "Requires discipline about secrets and targets"],
        ["Jetic in the repo", "Model, workflows, and traces together", "The team must own the workflow files"],
      ],
    },
    {
      type: "steps",
      eyebrow: "ADOPTING AS A TEAM",
      title: "Start with the shared surface.",
      items: [
        { title: "Commit", body: "Add .jetic to the repository with a first model.", cmd: "jetic_init" },
        { title: "Agree", body: "Pick the three journeys that define healthy behavior.", cmd: "review" },
        { title: "Run", body: "Make the same command work locally and in CI.", cmd: "jetic_simulate_workflow" },
        { title: "Own", body: "Treat a red workflow like a failing test, with an owner.", cmd: "CODEOWNERS" },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Team habits that stick.",
      items: [
        { tag: "Solution", title: "CI/CD", body: "Make the shared workflows part of every change.", href: "/solutions/ci-cd" },
        { tag: "Solution", title: "Regression testing", body: "Choose the journeys worth protecting.", href: "/solutions/regression-testing" },
        { tag: "Product", title: "Reports", body: "Share the evidence, not just the result.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "TEAM FAQ",
      items: [
        { q: "Do teammates need their own accounts?", a: "The core workflow is file-based. There is no per-seat workspace requirement to run the CLI." },
        { q: "How do we handle secrets?", a: "Keep secret values out of the repository. Environments reference them, and run reports avoid writing raw secrets." },
        { q: "Can we review behavior changes?", a: "Yes. Model and workflow changes appear in the pull request diff and can be required checks." },
        { q: "What belongs in version control?", a: "model.json, workflow files, and whichever run artifacts your team wants to keep. Treat runs as build artifacts." },
      ],
    },
  ],
};

export default function TeamWorkspacesPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Share the model.",
        headlineItalic: "Not the guesswork.",
        body: "Put the API behavior in the repository where the whole team can review it and CI can run it.",
        cta: "Start with Jetic",
        href: "/sign-up",
      }}
    />
  );
}
