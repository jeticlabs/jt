import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schema & Security",
  description:
    "Request and response schemas, business constraints, security schemes, ownership checks, and secret references — declared once in the Jetic model.",
};

const page: PageDefinition = {
  crumbs: [
    { label: "Jetic", href: "/" },
    { label: "Product", href: "/product" },
    { label: "Schema & Security" },
  ],
  eyebrow: "PRODUCT · SCHEMA & SECURITY",
  title: "Know the contract before",
  titleAccent: "you call it.",
  description:
    "A route tells you where to send a request. A schema tells you whether the response is correct. Jetic keeps request shapes, response fields, auth schemes, and ownership rules next to the endpoint they describe.",
  primary: { label: "Read the model docs", href: "/docs" },
  secondary: { label: "See workflows", href: "/product/workflows" },
  chips: ["JSON schemas", "Bearer + API key", "Ownership checks", "Secret refs"],
  terminal: {
    title: ".jetic/model.json — security",
    lines: [
      { kind: "out", text: '"securitySchemes": {' },
      { kind: "out", text: '  "bearerAuth": {' },
      { kind: "out", text: '    "type": "http", "scheme": "bearer",' },
      { kind: "blue", text: '    "obtainedFrom": "POST /api/auth/login"' },
      { kind: "out", text: "  }," },
      { kind: "out", text: '  "apiKey": { "type": "apiKey", "in": "header", "name": "x-api-key" }' },
      { kind: "out", text: "}," },
      { kind: "out", text: '"ownership": { "ownerField": "userId", "mustMatchAuthClaim": "sub" }' },
    ],
    footer: "Token producers feed protected steps automatically",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "THE CONTRACT",
      title: "Schemas that do real work in a run.",
      body: "Jetic does not treat schemas as documentation. They drive value generation, required-field checks, response validation, and the auth chain between steps.",
      items: [
        { title: "Request schemas", body: "Field types, required flags, formats, enums, defaults, and examples.", tag: "Input" },
        { title: "Response schemas", body: "Status-specific fields that assertions can validate after a call.", tag: "Output" },
        { title: "Business constraints", body: "Min length, patterns, and conditional rules lifted from handler logic.", tag: "Rules" },
        { title: "Security schemes", body: "Bearer, API key, cookie, and OAuth2 definitions with scopes.", tag: "Auth" },
        { title: "Token producers", body: "The login endpoint that issues a value later steps consume as a header.", tag: "Chain" },
        { title: "Ownership rules", body: "Which resource field must match which auth claim to allow access.", tag: "Authz" },
      ],
    },
    {
      type: "split",
      eyebrow: "AUTH CHAINS",
      title: "Capture the token once. Inject it everywhere.",
      body: "A security scheme can name the endpoint that produces its credential. When a workflow runs that endpoint, Jetic captures the token into memory and later protected steps consume it without extra plumbing.",
      bullets: [
        "Producer and consumer endpoints stay linked in the model",
        "Authorization headers are generated from captured memory",
        "API keys and cookie values use the same chain",
        "Scopes are validated for OAuth2 requirements",
      ],
      terminal: {
        title: "auth-chain",
        lines: [
          { kind: "cmd", text: "jetic_validate_workflow" },
          { kind: "ok", text: "✔ POST /api/auth/login produces accessToken" },
          { kind: "ok", text: "✔ GET /api/orders consumes bearerAuth" },
          { kind: "ok", text: "✔ GET /api/users/:id consumes bearerAuth + ownership" },
          { kind: "warn", text: "! POST /api/admin/refund requires scope admin" },
          { kind: "out", text: "inject header:Authorization ← Bearer {{workflow:accessToken}}" },
        ],
      },
      link: { label: "How workflows carry state", href: "/product/workflows" },
    },
    {
      type: "specs",
      eyebrow: "SECURITY MODEL",
      title: "Explicit rules, reviewable in a file.",
      body: "Security behavior is data in the model and conditions in the workflow, not hidden inside a test script.",
      rows: [
        { k: "Authentication", v: "Declare a scheme per endpoint. The runner adds the required header only when the step consumes a captured or configured value." },
        { k: "Authorization", v: "Ownership rules compare a resource field with an auth claim. A mismatch is a failed check, not a silent pass." },
        { k: "Rate limits", v: "Rate-limit middleware is recorded with its window and max. Negative tests can expect 429 with continueOnStatus." },
        { k: "Secrets", v: "Environment variables and secret references are resolved at run time. Values are never written into run reports." },
        { k: "Validation", v: "Request and response schemas constrain generated values and assert the shape that came back." },
        { k: "Failure modes", v: "401, 403, 404, and 409 are first-class expectations rather than unexpected errors." },
      ],
      note: "Jetic records the security behavior it can verify. It does not claim to be a penetration-testing tool or a replacement for a security review.",
    },
    {
      type: "table",
      eyebrow: "SCHEME SUPPORT",
      title: "Credentials the model understands.",
      head: ["Scheme", "Where it goes", "How workflows use it"],
      rows: [
        ["Bearer", "Authorization header", "Capture the token from its producer; inject it on protected steps."],
        ["API key", "Header, query, or cookie", "Reference the key in the model; the runner places it in the declared location."],
        ["Cookie", "Cookie header", "Cookie session values are supplied as headers or captured from a login step."],
        ["OAuth2", "Authorization header with scopes", "Scopes are declared per endpoint; the producer is recorded for the token exchange."],
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Put the contract to work.",
      items: [
        { tag: "Execution", title: "Workflows", body: "Consume schemes, capture tokens, and assert captured memory.", href: "/product/workflows" },
        { tag: "Validation", title: "Simulations", body: "Check status codes and response shapes on every step.", href: "/product/simulations" },
        { tag: "Evidence", title: "Reports", body: "See which headers were injected and what came back.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "SCHEMA FAQ",
      items: [
        {
          q: "Do I have to write schemas for every endpoint?",
          a: "No. The scanner gets you a working model without them. Screens and constraints improve coverage and make assertions stronger, but they are additive.",
        },
        {
          q: "Where do secrets live?",
          a: "Values are supplied through environment variables or secret references. The model stores the reference, not the secret, and reports redact sensitive values.",
        },
        {
          q: "Can Jetic test unauthorized access?",
          a: "Yes. Set the expected status to 401 or 403 and use continueOnStatus where a failure is the behavior under test. The trace records what was sent and returned.",
        },
        {
          q: "What if an endpoint returns multiple shapes?",
          a: "Model each status code separately under responses. Simulation asserts the expected status and validates against that status's schema.",
        },
      ],
    },
  ],
};

export default function SchemaSecurityPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Contracts first.",
        headlineItalic: "Confidence after.",
        body: "Declare the request, the response, and the credential once. Then let every workflow reuse the same rules.",
        cta: "Explore the docs",
        href: "/docs",
      }}
    />
  );
}
