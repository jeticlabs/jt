import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use cases",
  description:
    "Concrete ways teams use Jetic: backend regression, auth flow testing, post-deploy checks, AI-assisted authoring, and shared API knowledge.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Use cases" }],
  eyebrow: "RESOURCES · USE CASES",
  title: "The journey",
  titleAccent: "is the use case.",
  description:
    "Jetic fits wherever an API has to work as a sequence, not just as a single endpoint. These are the situations teams bring to it most often.",
  primary: { label: "Explore solutions", href: "/solutions/backend-developers" },
  secondary: { label: "See a simulation", href: "/product/simulations" },
  chips: ["Regression", "Auth", "Post-deploy", "AI"],
  terminal: {
    title: "use case → workflow",
    lines: [
      { kind: "dim", text: "before deploy   login → create → read" },
      { kind: "out", text: "workflow        checkout.json" },
      { kind: "blue", text: "state           accessToken · orderId" },
      { kind: "ok", text: "✔ run passes locally and in CI" },
      { kind: "out", text: "failure         trace points at the step" },
    ],
    footer: "One artifact, several moments in the lifecycle",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "COMMON SITUATIONS",
      title: "Where a single request is not enough.",
      items: [
        { title: "Backend regression", body: "Protect the flows that depend on auth, ids, and order of operations.", tag: "Backend" },
        { title: "Auth handoff testing", body: "Prove the producer and consumer of a token still agree.", tag: "Auth" },
        { title: "Post-deploy smoke", body: "Run a short, critical journey after a deploy and keep the trace.", tag: "Ops" },
        { title: "AI-assisted authoring", body: "Let an agent draft over MCP; execute the reviewed file on its own.", tag: "AI" },
        { title: "Onboarding context", body: "Show a new teammate how the API is actually used in sequence.", tag: "Teams" },
        { title: "Contract drift review", body: "Turn a behavior change into a visible diff beside the source change.", tag: "Review" },
      ],
    },
    {
      type: "table",
      eyebrow: "BY ROLE",
      title: "Same artifact, different value.",
      body: "The workflow is useful to more than one person on the team.",
      head: ["Role", "What they get", "Where to start"],
      rows: [
        ["Backend developer", "A fast check on the journey they just changed", "Solutions · Backend developers"],
        ["QA engineer", "A reviewable behavior suite with traces", "Solutions · API testing"],
        ["Platform engineer", "A deterministic step in the pipeline", "Solutions · CI/CD"],
        ["Tech lead", "A shared model and evidence for review", "Solutions · Team workspaces"],
        ["AI agent", "Typed tools for modeling and drafting", "Solutions · AI-assisted testing"],
        ["New teammate", "A readable map of real API usage", "Product · API model"],
      ],
    },
    {
      type: "split",
      eyebrow: "SCENARIO",
      title: "A checkout flow is a small system.",
      body: "Login, cart, order, payment, and confirmation are five calls with four handoffs. Jetic makes each handoff explicit and checks the status at every stage.",
      bullets: [
        "Token captured once, injected where needed",
        "Cart and order ids flow forward",
        "A declined payment is an expected step, not a crash",
        "The trace shows where the sequence diverged",
      ],
      terminal: {
        title: "checkout journey",
        lines: [
          { kind: "out", text: "1. login           200  token" },
          { kind: "out", text: "2. add item        201  cartId" },
          { kind: "out", text: "3. create order    201  orderId" },
          { kind: "warn", text: "4. pay (declined)  402  expected" },
          { kind: "out", text: "5. pay (valid)     200  receipt" },
          { kind: "ok", text: "✔ sequence verified" },
        ],
      },
    },
    {
      type: "related",
      eyebrow: "BY SOLUTION",
      title: "Pick the closest fit.",
      items: [
        { tag: "Solution", title: "Backend developers", body: "The source-first path from route to trace.", href: "/solutions/backend-developers" },
        { tag: "Solution", title: "API testing", body: "Contracts, auth, and negative paths.", href: "/solutions/api-testing" },
        { tag: "Solution", title: "Regression testing", body: "Keep the journey green after every change.", href: "/solutions/regression-testing" },
        { tag: "Solution", title: "CI/CD", body: "One deterministic step in the pipeline.", href: "/solutions/ci-cd" },
        { tag: "Solution", title: "AI-assisted testing", body: "Agent-authored, runner-verified.", href: "/solutions/ai-assisted-testing" },
        { tag: "Solution", title: "Team workspaces", body: "Behavior shared through the repository.", href: "/solutions/team-workspaces" },
      ],
    },
  ],
};

export default function UseCasesPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Find your flow.",
        headlineItalic: "Keep it working.",
        body: "Choose the journey your team would notice first if it broke, and start there.",
        cta: "See the solutions",
        href: "/solutions/backend-developers",
      }}
    />
  );
}
