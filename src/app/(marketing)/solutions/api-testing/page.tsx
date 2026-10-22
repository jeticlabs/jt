import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API testing",
  description:
    "Test the API contract against the real server, with ordered steps, real auth, and a trace for every failure.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Solutions" }, { label: "API testing" }],
  eyebrow: "SOLUTIONS · API TESTING",
  title: "Test the API.",
  titleAccent: "Not the mock.",
  description:
    "A mocked contract can pass while the real endpoint fails. Jetic tests the running API: actual middleware, actual tokens, actual responses, ordered the way a client would call them.",
  primary: { label: "Run a simulation", href: "/product/simulations" },
  secondary: { label: "See the model", href: "/product/api-model" },
  chips: ["Real server", "Contract checks", "Negative paths", "Evidence"],
  terminal: {
    title: "orders-workflow.json",
    lines: [
      { kind: "out", text: "1. login              200   token captured" },
      { kind: "out", text: "2. create order       201   id captured" },
      { kind: "out", text: "3. fetch order        200   schema valid" },
      { kind: "warn", text: "4. pay with bad card  402   expected" },
      { kind: "out", text: "5. retry with valid    200   idempotent" },
      { kind: "ok", text: "✔ 5 passed · 2 captures · trace saved" },
    ],
    footer: "Happy path and negative path in one workflow",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WHAT GETS TESTED",
      title: "The parts a unit test cannot reach.",
      body: "Jetic is aimed at the boundary between your code and the client.",
      items: [
        { title: "Status codes", body: "Each step declares what success looks like, including expected failures.", tag: "HTTP" },
        { title: "Response shape", body: "Validate the payload against the contract before moving on.", tag: "Schema" },
        { title: "Auth flow", body: "Use the real token producer and inject it into protected calls.", tag: "Auth" },
        { title: "State changes", body: "Create, read, update, and delete in the order a client would.", tag: "CRUD" },
        { title: "Validation errors", body: "Assert the exact failure for bad input and missing fields.", tag: "Edges" },
        { title: "Middleware order", body: "The model records the chain, so the test runs against the same guards.", tag: "Model" },
      ],
    },
    {
      type: "table",
      eyebrow: "TEST LAYERS",
      title: "Different questions, different tools.",
      body: "Jetic does not replace unit tests. It covers the questions that only exist over HTTP.",
      head: ["Layer", "Question", "Jetic"],
      rows: [
        ["Unit", "Does this function behave?", "Out of scope"],
        ["Integration", "Do these modules compose?", "Partly, through the real server"],
        ["API contract", "Does the endpoint keep its promise?", "Yes, per step"],
        ["Journey", "Does the sequence work with real state?", "Yes, with capture and inject"],
        ["Regression", "Did this change break a known path?", "Yes, on every run"],
      ],
    },
    {
      type: "split",
      eyebrow: "NEGATIVE PATHS",
      title: "A passing suite should include the failures.",
      body: "The most valuable tests often assert that the API says no for the right reason. Jetic treats an expected error as a normal step outcome.",
      bullets: [
        "Assert 401 for a missing token",
        "Assert 403 for the wrong owner",
        "Assert 422 for an invalid body",
        "Continue the journey after an expected failure",
      ],
      terminal: {
        title: "expect-status",
        lines: [
          { kind: "out", text: "step 4  POST /api/orders/42/pay" },
          { kind: "out", text: "body    { \"card\": \"declined\" }" },
          { kind: "warn", text: "expect  402 Payment Required" },
          { kind: "ok", text: "actual  402 · body.code = card_declined" },
          { kind: "blue", text: "capture errorCode ← body.code" },
          { kind: "ok", text: "✔ negative path passed" },
        ],
      },
      reverse: true,
    },
    {
      type: "steps",
      eyebrow: "HOW A RUN WORKS",
      title: "Order, state, assertion, evidence.",
      items: [
        { title: "Order", body: "The workflow fixes the sequence of calls.", cmd: "steps[]" },
        { title: "State", body: "Capture a value and inject it downstream.", cmd: "capture / inject" },
        { title: "Assert", body: "Declare the expected status for each step.", cmd: "expectStatus" },
        { title: "Trace", body: "Keep the request, response, and timing.", cmd: ".jetic/runs/" },
      ],
    },
    {
      type: "related",
      eyebrow: "KEEP GOING",
      title: "Testing is one part of the loop.",
      items: [
        { tag: "Solution", title: "Regression testing", body: "Turn the suite into a change-by-change guard.", href: "/solutions/regression-testing" },
        { tag: "Product", title: "Simulations", body: "Run deterministic workflows and inspect each step.", href: "/product/simulations" },
        { tag: "Compare", title: "Jetic vs Karate", body: "A testing DSL versus a shared behavioral model.", href: "/compare/karate" },
      ],
    },
    {
      type: "faq",
      eyebrow: "API TESTING FAQ",
      items: [
        { q: "Do I need a running server?", a: "Yes. Simulations send real HTTP requests to the environment you select. Scanning does not need the server." },
        { q: "Can I test error responses?", a: "Yes. Expected status is part of a step, and conditions can assert on captured error codes." },
        { q: "Does Jetic mock external services?", a: "No. It tests your API as it runs. External dependencies need to be available in the target environment." },
        { q: "Can I keep tests next to the code?", a: "Yes. The .jetic folder lives in the repository and can be reviewed with the change that affects it." },
      ],
    },
  ],
};

export default function ApiTestingPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Test what runs.",
        headlineItalic: "Keep what happened.",
        body: "Write the journey once, run it against the real API, and keep the trace when it fails.",
        cta: "Try a simulation",
        href: "/sign-up",
      }}
    />
  );
}
