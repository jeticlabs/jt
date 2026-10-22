import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Model",
  description:
    "A versioned behavioral model of your Express API: routes, parameters, middleware, schemas, security, and source provenance in .jetic/model.json.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "API Model" }],
  eyebrow: "PRODUCT · API MODEL",
  title: "A living model of what your API",
  titleAccent: "actually does.",
  description:
    "model.json is the single source Jetic reads from and writes to. It records your routes, their middleware, their inputs and outputs, and the exact line of code each one came from — so every workflow step is anchored to reality.",
  primary: { label: "Scan your API", href: "/docs/start/getting-started" },
  secondary: { label: "See endpoints", href: "/product/endpoints" },
  chips: ["Versioned JSON", "Source linked", "Hand-editable", "Diff friendly"],
  terminal: {
    title: ".jetic/model.json",
    lines: [
      { kind: "out", text: "{" },
      { kind: "out", text: '  "version": 1,' },
      { kind: "out", text: '  "project": { "framework": "express", "language": "typescript" },' },
      { kind: "out", text: '  "securitySchemes": {' },
      { kind: "out", text: '    "bearerAuth": { "type": "http", "scheme": "bearer", "obtainedFrom": "POST /api/auth/login" }' },
      { kind: "out", text: "  }," },
      { kind: "out", text: '  "endpoints": [' },
      { kind: "blue", text: '    { "method": "GET", "path": "/api/orders/:id", "middleware": ["auth"],' },
      { kind: "blue", text: '      "source": { "file": "src/routes/orders.ts", "line": 42 } }' },
      { kind: "out", text: "  ]" },
      { kind: "out", text: "}" },
    ],
    footer: "24 endpoints · 6 schemas · 2 security schemes",
  },
  blocks: [
    {
      type: "stats",
      items: [
        { value: "1", label: "File every Jetic surface agrees on" },
        { value: "Line", label: "Level provenance for every route" },
        { value: "JSON", label: "Readable, diffable, and commit-ready" },
        { value: "Live", label: "Change scanner keeps the model current" },
      ],
    },
    {
      type: "features",
      eyebrow: "WHAT THE MODEL HOLDS",
      title: "Everything a test needs to know about an endpoint.",
      body: "The model is intentionally explicit. Nothing is inferred at execution time, so a run can be reviewed before it ever touches a server.",
      items: [
        {
          title: "Route identity",
          body: "Method and path, including nested router prefixes and path parameters.",
          tag: "Route",
        },
        {
          title: "Middleware chain",
          body: "Auth, validation, rate limits, parsers, and custom handlers in execution order.",
        },
        {
          title: "Request contract",
          body: "Body fields, types, required flags, formats, enums, and business constraints.",
        },
        {
          title: "Response contract",
          body: "Status codes, response fields, examples, and which outcomes enforce ownership.",
        },
        {
          title: "Security schemes",
          body: "Bearer, API key, cookie, and OAuth2 definitions, including the token producer.",
        },
        {
          title: "Source provenance",
          body: "The file and line for each handler, so the model can be traced back to code.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "HOW IT STAYS CURRENT",
      title: "Built by scan, refined by you.",
      body: "The scanner gets you a complete first pass. The model is plain JSON, so you can fill gaps or correct details without waiting for a release.",
      sections: [
        {
          heading: "1. Static scan",
          paragraphs: [
            "jetic scan reads tsconfig.json, resolves imports, and walks the Express router chain. It writes a first model with methods, paths, middleware, parameters, and source locations.",
          ],
        },
        {
          heading: "2. Review and enrich",
          paragraphs: [
            "Open the model in Jetic Studio or your editor. Add schemas, business constraints, security schemes, ownership rules, and response shapes that static analysis cannot infer on its own.",
          ],
          bullets: [
            "Schemas can be added per endpoint or reused across a resource.",
            "Security schemes declare where the token comes from, so later steps can inject it automatically.",
            "Constraints such as minimum password length or required-if rules become reviewable data.",
          ],
        },
        {
          heading: "3. Change-aware updates",
          paragraphs: [
            "When jetic dev is running, the ChangeScanner records edited source files in changes.json. Before rescanning, Jetic reads only those files, updates the affected endpoints, and clears the change log.",
          ],
        },
        {
          heading: "4. Verify before you run",
          paragraphs: [
            "jetic_verify_model checks duplicate routes, unbound path parameters, invalid status codes, missing responses, dangling source links, and unknown security schemes. The model must pass before a workflow is simulated.",
          ],
        },
      ],
    },
    {
      type: "split",
      eyebrow: "PROVENANCE",
      title: "Every step can point back to a line of code.",
      body: "When a workflow fails, the question is rarely just which request failed. It is which route, which handler, and which change introduced the behavior. Source links make that answer concrete.",
      bullets: [
        "Endpoint rows carry file and line references",
        "Middleware entries keep their execution order",
        "Dangling source links are caught during verification",
        "The change scanner maps edits back to affected routes",
      ],
      terminal: {
        title: "jetic inspect endpoint GET /api/orders/:id",
        lines: [
          { kind: "cmd", text: "jetic inspect endpoint GET /api/orders/:id" },
          { kind: "out", text: "source      src/routes/orders.ts:42" },
          { kind: "out", text: "params      id (path)" },
          { kind: "out", text: "middleware  requireAuth → rateLimit" },
          { kind: "out", text: "response    200 Order, 404 NotFound" },
          { kind: "ok", text: "✔ provenance traced to file + line" },
        ],
      },
      reverse: true,
      link: { label: "Explore endpoints", href: "/product/endpoints" },
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "The model, one layer at a time.",
      items: [
        { tag: "Routes", title: "Endpoints", body: "How routes, parameters, and middleware are represented.", href: "/product/endpoints" },
        { tag: "Contracts", title: "Schema & security", body: "Wire the request and response shapes into the model.", href: "/product/schema-security" },
        { tag: "Execution", title: "Workflows", body: "Turn model entries into ordered, stateful steps.", href: "/product/workflows" },
      ],
    },
    {
      type: "faq",
      eyebrow: "MODEL FAQ",
      items: [
        {
          q: "Is model.json safe to edit by hand?",
          a: "Yes. It is plain JSON with a stable shape. Studio and the MCP tools edit the same file, and jetic_verify_model catches structural mistakes before a run.",
        },
        {
          q: "What happens when I add a new route?",
          a: "Run jetic scan again. With merge mode, new routes are upserted and hand-added endpoints are kept. With overwrite mode, the endpoints array is replaced.",
        },
        {
          q: "Does every route need a schema?",
          a: "No. A route can be scanned and simulated with what is known. Schemas and constraints make validation stronger, but missing fields are reported as warnings rather than blocking every run.",
        },
        {
          q: "Can the model reference files outside the project?",
          a: "Source paths are resolved inside the project. Dangling links are reported by verification so the model does not silently point at a file that no longer exists.",
        },
      ],
    },
  ],
};

export default function ApiModelPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Model once.",
        headlineItalic: "Run anywhere.",
        body: "Scan your routes, enrich the model where it matters, and let every workflow reuse the same source of truth.",
        cta: "Get started",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
