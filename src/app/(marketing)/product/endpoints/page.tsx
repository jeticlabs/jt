import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Endpoints",
  description:
    "Every Express route, its parameters, middleware chain, request body, responses, and source location — resolved from code and ready to simulate.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Product", href: "/product" }, { label: "Endpoints" }],
  eyebrow: "PRODUCT · ENDPOINTS",
  title: "Every route, its middleware, and the",
  titleAccent: "file it came from.",
  description:
    "Endpoints are the atoms of the model. Jetic resolves them from your Express router chain instead of asking you to retype URLs, so parameters and auth requirements stay attached to the code that defines them.",
  primary: { label: "Scan your routes", href: "/docs/start/getting-started" },
  secondary: { label: "Understand the model", href: "/product/api-model" },
  chips: ["Nested routers", "Path params", "Middleware order", "Source line"],
  terminal: {
    title: "jetic scan",
    lines: [
      { kind: "cmd", text: "jetic scan" },
      { kind: "dim", text: "parsing tsconfig.json · ts-morph AST · server not started" },
      { kind: "out", text: "app.use('/api/orders', ordersRouter) → resolved" },
      { kind: "blue", text: "GET    /api/orders/:id      src/routes/orders.ts:42" },
      { kind: "blue", text: "POST   /api/orders/checkout src/routes/orders.ts:67" },
      { kind: "blue", text: "POST   /api/auth/login      src/routes/auth.ts:18" },
      { kind: "ok", text: "✔ 24 endpoints → .jetic/model.json" },
    ],
    footer: "Methods · paths · params · middleware · provenance",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "ENDPOINT RECORD",
      title: "A complete picture of a call before you make it.",
      body: "Each endpoint entry is intentionally explicit. The same record powers inspect, simulation, and reporting.",
      items: [
        { title: "Method + path", body: "The exact route, including nested prefixes and dynamic segments.", tag: "Identity" },
        { title: "Path parameters", body: "Names, types, formats, and whether each one is required.", tag: "Input" },
        { title: "Query + headers", body: "Pagination, filters, auth headers, cookies, and defaults.", tag: "Input" },
        { title: "Request body", body: "Field types, required flags, enums, examples, and constraints.", tag: "Input" },
        { title: "Middleware", body: "Auth, rate limit, parsers, validation, and custom handlers in order.", tag: "Chain" },
        { title: "Responses", body: "Expected status codes, fields, examples, and ownership checks.", tag: "Output" },
      ],
    },
    {
      type: "split",
      eyebrow: "INSPECT",
      title: "Ask one endpoint what it expects.",
      body: "jetic inspect resolves a single endpoint without starting the server. It is the fastest way to confirm a parameter, an auth requirement, or the source behind a route before writing a step.",
      bullets: [
        "Read the full middleware chain in execution order",
        "See path, query, header, and body inputs together",
        "Follow a link straight back to the handler",
        "Check response shapes before asserting on them",
      ],
      terminal: {
        title: "jetic inspect",
        lines: [
          { kind: "cmd", text: "jetic inspect endpoint GET /api/orders/:id" },
          { kind: "out", text: "source      src/routes/orders.ts:42" },
          { kind: "out", text: "params      id (path, uuid, required)" },
          { kind: "out", text: "middleware  requireAuth → rateLimit" },
          { kind: "out", text: "response    200 Order" },
          { kind: "out", text: "            404 NotFound" },
          { kind: "ok", text: "✔ endpoint resolved from model.json" },
        ],
      },
      link: { label: "See workflows", href: "/product/workflows" },
    },
    {
      type: "steps",
      eyebrow: "FROM ROUTER TO MODEL",
      title: "How a route becomes an endpoint.",
      items: [
        { title: "Read tsconfig", body: "The scanner starts from the TypeScript project, not a running server.", cmd: "tsconfig.json" },
        { title: "Resolve routers", body: "Nested prefixes and imported routers are flattened into full paths.", cmd: "app.use(…)" },
        { title: "Walk handlers", body: "Middleware, params, and response calls are attached to each route.", cmd: "router.get(…)" },
        { title: "Write model", body: "Each route lands in model.json with its source file and line.", cmd: ".jetic/model.json" },
      ],
    },
    {
      type: "table",
      eyebrow: "FIELD REFERENCE",
      title: "What an endpoint record looks like.",
      head: ["Field", "What it captures", "Why it matters"],
      rows: [
        ["method", "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD", "A step addresses an endpoint by method and path together."],
        ["path", "Express route with :params and nesting resolved", "No hand-typed URLs that drift from the code."],
        ["parameters", "Path, query, header, cookie, and body inputs", "Simulation can generate values and validate required fields."],
        ["middleware", "Ordered chain including auth and rate limits", "Explains the 401, 403, or 429 you should expect."],
        ["security", "Scheme names the endpoint requires", "Protected steps can consume a captured token."],
        ["responses", "Status codes, fields, examples, ownership checks", "Assertions are grounded in the documented contract."],
        ["source", "File and line of the route definition", "Failures can be traced back to the handler."],
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Connect endpoints to contracts and runs.",
      items: [
        { tag: "Contracts", title: "Schema & security", body: "Add request and response shapes, auth schemes, and ownership rules.", href: "/product/schema-security" },
        { tag: "Execution", title: "Workflows", body: "Chain endpoints into ordered steps that carry memory.", href: "/product/workflows" },
        { tag: "Evidence", title: "Reports", body: "Inspect the request and response for every step of a run.", href: "/product/reports" },
      ],
    },
    {
      type: "faq",
      eyebrow: "ENDPOINT FAQ",
      items: [
        {
          q: "Does the server need to be running to scan?",
          a: "No. The scan is static. It reads tsconfig.json and the router source with ts-morph, so it works before the app boots.",
        },
        {
          q: "Are mounted routers resolved?",
          a: "Yes. Import resolution and nested-router flattening turn app.use prefixes into full endpoint paths. Routes conditionally mounted at runtime may need manual correction.",
        },
        {
          q: "What about endpoints without auth?",
          a: "They are recorded with an empty security requirement. Workflows then run them without an Authorization header unless you inject one explicitly.",
        },
        {
          q: "Can I add an endpoint by hand?",
          a: "Yes. Use jetic_add_endpoint through MCP or edit model.json directly. Verification will flag duplicate routes or unbound path parameters.",
        },
      ],
    },
  ],
};

export default function EndpointsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Stop retyping",
        headlineItalic: "routes.",
        body: "Scan once and every endpoint carries its parameters, middleware, and source line into the workflow you build.",
        cta: "Install Jetic CLI",
        href: "/docs/start/getting-started",
      }}
    />
  );
}
