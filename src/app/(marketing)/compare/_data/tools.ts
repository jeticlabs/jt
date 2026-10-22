import type { PageDefinition, RelatedItem } from "@/components/marketing-ui";

export type CompareTool = {
  slug: string;
  name: string;
  category: string;
  accent: string;
  description: string;
  terminalThem: string;
  chips: string[];
  rows: [string, string, string][];
  splitTitle: string;
  splitBody: string;
  bullets: string[];
  chooseThem: string;
  chooseJetic: string;
  useBoth: string;
  faqs: { q: string; a: string }[];
};

const related: RelatedItem[] = [
  {
    tag: "Product",
    title: "Workflows",
    body: "Ordered steps with capture, inject, conditions, and retries.",
    href: "/product/workflows",
  },
  {
    tag: "Product",
    title: "Simulations",
    body: "Deterministic execution with status checks and stored traces.",
    href: "/product/simulations",
  },
  {
    tag: "Compare",
    title: "All comparisons",
    body: "See how Jetic fits next to the rest of the toolchain.",
    href: "/compare",
  },
];

export function comparePage(tool: CompareTool): PageDefinition {
  return {
    crumbs: [
      { label: "Jetic", href: "/" },
      { label: "Compare", href: "/compare" },
      { label: tool.name },
    ],
    eyebrow: `COMPARE · ${tool.category.toUpperCase()}`,
    title: `Jetic vs ${tool.name}:`,
    titleAccent: tool.accent,
    description: tool.description,
    primary: { label: "Try Jetic", href: "/docs/start/getting-started" },
    secondary: { label: "View all comparisons", href: "/compare" },
    chips: tool.chips,
    terminal: {
      title: `jetic vs ${tool.slug}`,
      lines: [
        { kind: "dim", text: `${tool.name}: ${tool.terminalThem}` },
        { kind: "blue", text: "jetic: model → workflow → memory → trace" },
        { kind: "cmd", text: "jetic simulate workflow --workflow .jetic/workflows/checkout.json" },
        { kind: "ok", text: "✔ login              200   captured accessToken" },
        { kind: "ok", text: "✔ create order       201   injected Authorization" },
        { kind: "ok", text: "✔ fetch order        200   trace saved" },
      ],
      footer: "Deterministic execution · no model in the run",
    },
    blocks: [
      {
        type: "table",
        eyebrow: "AT A GLANCE",
        title: `${tool.name} vs Jetic at a glance`,
        body: "The tools overlap at the request layer. They diverge once the test becomes a sequence with state.",
        head: ["Comparison", tool.name, "Jetic"],
        rows: tool.rows,
      },
      {
        type: "split",
        eyebrow: "THE DIFFERENCE",
        title: tool.splitTitle,
        body: tool.splitBody,
        bullets: tool.bullets,
        terminal: {
          title: "checkout-flow.json",
          lines: [
            { kind: "out", text: "1. login        POST /api/auth/login" },
            { kind: "blue", text: "   capture      accessToken ← data.tokens.access" },
            { kind: "out", text: "2. create order POST /api/orders" },
            { kind: "blue", text: "   inject       Authorization: Bearer {{workflow:accessToken}}" },
            { kind: "out", text: "3. fetch order  GET  /api/orders/{{workflow:orderId}}" },
            { kind: "ok", text: "✔ 3 passed · trace saved" },
          ],
        },
        link: { label: "How state flows between steps", href: "/product/workflows" },
      },
      {
        type: "specs",
        eyebrow: "CHOOSE",
        title: "Two tools, two jobs.",
        body: "Jetic is not trying to be the only thing in your stack. It is trying to be the layer that verifies behavior.",
        rows: [
          { k: `Choose ${tool.name}`, v: tool.chooseThem },
          { k: "Choose Jetic", v: tool.chooseJetic },
          { k: "Use both", v: tool.useBoth },
        ],
      },
      { type: "faq", eyebrow: "COMPARISON FAQ", items: tool.faqs },
      { type: "related", eyebrow: "KEEP GOING", title: "Follow the comparison into the product.", items: related },
    ],
  };
}

export function getCompareTool(slug: string): CompareTool {
  const tool = COMPARE_TOOLS.find((entry) => entry.slug === slug);
  if (!tool) {
    throw new Error(`Unknown compare tool: ${slug}`);
  }
  return tool;
}

export const COMPARE_TOOLS: CompareTool[] = [
  {
    slug: "postman",
    name: "Postman",
    category: "API clients",
    accent: "a workspace, or a workflow?",
    description:
      "Postman is a broad API platform: collections, environments, mocks, monitors, and collaboration. Jetic is narrower by design: it models your Express code and runs stateful workflows deterministically. The question is which layer you need.",
    terminalThem: "collections, manual requests, scripts, shared workspace",
    chips: ["Collections", "Code-aware", "Deterministic", "Traceable"],
    rows: [
      ["Primary shape", "Collections of saved requests organized by hand", "A behavioral model scanned from source plus ordered workflows"],
      ["Source awareness", "You keep requests in sync with code manually", "Routes, params, middleware, and line numbers come from code"],
      ["State between calls", "Variables and scripts you maintain per collection", "capture and inject declared once in the workflow file"],
      ["Execution", "Collection runner with pre-request and test scripts", "Deterministic JSON runner with no model in the loop"],
      ["Auth", "Configured per request or inherited from an environment", "Security schemes with explicit producer and consumer steps"],
      ["Evidence", "Run results, console output, and monitors", "Full request/response trace per step under .jetic/runs"],
      ["Best fit", "Broad manual, collaborative, multi-protocol API work", "Code-aware regression journeys for Node.js teams"],
    ],
    splitTitle: "Collections are a catalog. Workflows are a sequence.",
    splitBody:
      "A Postman collection is excellent for exploring an API. A Jetic workflow is an executable sequence: the login token is captured, injected into the next call, and the whole run is replayable from one file.",
    bullets: [
      "Endpoints come from the router chain, not a manually typed URL",
      "Captured memory replaces per-collection variable plumbing",
      "Every status expectation is part of the file, not a script",
      "Run traces keep the request, response, and source link together",
    ],
    chooseThem:
      "when you need a shared catalog, manual exploration, mocking, monitors, or a broad API platform across many protocols.",
    chooseJetic:
      "when the test is a journey and you want the route, the token, and the expected status to come from your code.",
    useBoth:
      "explore and document in Postman, then encode the durable regression journey in Jetic.",
    faqs: [
      {
        q: "Can Jetic import my Postman collection?",
        a: "Jetic is source-first rather than collection-first. The scanner builds endpoints from Express code; collections are not the starting point.",
      },
      {
        q: "Does Jetic replace Postman scripts?",
        a: "Workflow semantics such as capture, inject, conditions, retry, and expected status are declarative fields instead of ad hoc scripts.",
      },
      {
        q: "Can I still use Postman for manual testing?",
        a: "Yes. Jetic covers the repeatable, stateful layer. Postman remains a good place for exploratory calls.",
      },
      {
        q: "Which is better for a Node.js backend?",
        a: "Postman is broader. Jetic is more specific: Express + TypeScript source, behavioral model, deterministic workflows, and traces.",
      },
    ],
  },
  {
    slug: "insomnia",
    name: "Insomnia",
    category: "API clients",
    accent: "requests, or stateful runs?",
    description:
      "Insomnia is a focused API client with strong request design, environments, and plugins. Jetic starts one layer lower: it reads the API from your code and runs ordered, stateful workflows against it.",
    terminalThem: "design requests, environments, plugins, manual chaining",
    chips: ["API client", "Environments", "Stateful", "Traces"],
    rows: [
      ["Starting point", "A request you design in the client", "A model scanned from your Express routes"],
      ["Organization", "Workspaces and request collections", "Endpoints, workflows, and runs in .jetic/"],
      ["State", "Environment variables and template tags", "Workflow memory written by capture and read by inject"],
      ["Auth", "Configured per request or inherited", "Schemes linked to the endpoint that produces the token"],
      ["Automation", "Inso CLI and collection runs", "Deterministic workflow runner with CI-friendly files"],
      ["Debugging", "Timeline and response inspection", "Per-step trace with requests, responses, and captures"],
      ["Best fit", "Interactive API design and debugging", "Behavioral regression journeys for Express services"],
    ],
    splitTitle: "Designing a request is not the same as proving a journey.",
    splitBody:
      "Insomnia is fast at the individual call. Jetic is built for the part that follows: several calls in order, with values that must survive from one response to the next and a trace that explains what happened.",
    bullets: [
      "No environment-variable choreography between steps",
      "Expected status lives beside the step it belongs to",
      "Preflight catches an unreachable environment before step one",
      "The same file runs locally and in CI",
    ],
    chooseThem:
      "when you want an interactive client for designing, inspecting, and debugging individual requests.",
    chooseJetic:
      "when you want an ordered journey whose state and assertions are reviewed as code.",
    useBoth:
      "design and inspect in Insomnia while the durable regression path lives in Jetic.",
    faqs: [
      {
        q: "Is Jetic an Insomnia replacement?",
        a: "No. Insomnia is an interactive client. Jetic is a behavioral model and a deterministic workflow runner.",
      },
      {
        q: "Can Jetic use my Insomnia environment?",
        a: "Environments in Jetic declare base URLs and secret references. They are part of the model rather than an imported client environment.",
      },
      {
        q: "Does Jetic support plugins?",
        a: "Jetic exposes its own tooling and extension points through the CLI and MCP. Third-party client plugins are not part of the run path.",
      },
      {
        q: "Which is better for CI?",
        a: "Jetic is designed for CI: save the workflow, run one command, keep the trace, and fail the job on a real regression.",
      },
    ],
  },
  {
    slug: "bruno",
    name: "Bruno",
    category: "API clients",
    accent: "files in git, or a model of the code?",
    description:
      "Bruno is an offline, git-friendly API client where collections live as files. Jetic shares the file-first instinct but goes further: the files describe a behavioral model and ordered runs, not just saved requests.",
    terminalThem: "offline collections, git-native files, request scripts",
    chips: ["Git-native", "Offline", "Model", "Deterministic"],
    rows: [
      ["Files in git", "Collections and requests stored as plain files", "model.json, workflows, memory, and run traces in .jetic/"],
      ["Source awareness", "Requests stay manually aligned with routes", "Endpoints, middleware, and source lines come from code"],
      ["State", "Variables and scripts inside the collection", "capture and inject in a workflow step"],
      ["Secrets", "Environment files and secret variables", "Secret references resolved at run time and redacted in reports"],
      ["Execution", "Collection runner", "Ordered workflow runner with assertions and failure modes"],
      ["Evidence", "Response history", "Full per-step trace with captures and timings"],
      ["Best fit", "Offline, git-first manual API work", "Code-aware behavior tests that live beside the source"],
    ],
    splitTitle: "Git-native is the starting point, not the whole story.",
    splitBody:
      "Bruno gets collections into the repository, which is a real improvement over opaque cloud state. Jetic goes one step further by deriving the endpoints from the repository and making the execution sequence a reviewable artifact.",
    bullets: [
      "The route definition remains the source of truth",
      "State moving between calls is explicit, not scripted",
      "A run produces evidence rather than just a response log",
      "Workflows can be reviewed in the same pull request as the code",
    ],
    chooseThem:
      "when you want an offline, git-friendly client for authoring and manually running requests.",
    chooseJetic:
      "when you want the repository to also hold the behavioral model, the ordered workflow, and the trace.",
    useBoth:
      "keep Bruno for manual exploration and Jetic for the repeatable, stateful path.",
    faqs: [
      {
        q: "Does Jetic store its data in git too?",
        a: "Yes. The .jetic folder contains model.json, workflow files, memory, and run artifacts. Commit what your team should share.",
      },
      {
        q: "Is Jetic offline?",
        a: "Scanning and editing are local. A simulation sends real HTTP requests to the environment you choose.",
      },
      {
        q: "Do I write requests by hand in Jetic?",
        a: "Endpoints come from a scan. Workflows reference those endpoints, so you are not retyping paths and parameters.",
      },
      {
        q: "Can the two coexist in one repo?",
        a: "Yes. They are independent file-based tools and do not conflict.",
      },
    ],
  },
  {
    slug: "hoppscotch",
    name: "Hoppscotch",
    category: "API clients",
    accent: "fast requests, or repeatable journeys?",
    description:
      "Hoppscotch is a lightweight, browser-first API client built for speed. Jetic is built for the opposite end of the workflow: the repeatable, stateful journey that needs to pass tomorrow as well as today.",
    terminalThem: "fast browser requests, collections, environments",
    chips: ["Lightweight", "Browser-first", "Stateful", "CI"],
    rows: [
      ["Interaction", "Fast, browser-based request sending", "File-based workflows run from the CLI or Studio"],
      ["Context", "You supply the URL and payload", "Endpoints and parameters come from the scanned model"],
      ["State", "Environments and variables", "Workflow memory with capture and inject"],
      ["Assertions", "Test scripts in the client", "Declarative expected status and response validation"],
      ["Repeatability", "Collection runs", "Same JSON file and same order on every run"],
      ["CI fit", "CLI collection runner", "One-command deterministic workflow runner"],
      ["Best fit", "Quick manual calls and lightweight collaboration", "Regression journeys for code-aware Node.js teams"],
    ],
    splitTitle: "Speed at the keyboard is not the same as confidence in the pipeline.",
    splitBody:
      "Hoppscotch shines when a developer needs to send a request right now. Jetic is for the sequence you want to keep sending the same way after every change.",
    bullets: [
      "The endpoint list is generated from your Express code",
      "Login tokens and generated values carry through the run",
      "Assertions are part of the workflow file",
      "Traces make a failure explainable after the fact",
    ],
    chooseThem:
      "when you want a fast, lightweight client for ad hoc requests and quick collaboration.",
    chooseJetic:
      "when the important path is a multi-step journey that must be replayed in CI.",
    useBoth:
      "use Hoppscotch for the first exploratory call, then encode the settled journey in Jetic.",
    faqs: [
      {
        q: "Does Jetic run in the browser?",
        a: "The model and workflows are files, and Studio is a local web IDE. Execution targets your API environment from your machine or CI.",
      },
      {
        q: "Can I extend Jetic with scripts?",
        a: "The workflow surface is declarative. Conditions, retries, captures, and failure modes cover the run logic without arbitrary scripts.",
      },
      {
        q: "Which one is better for quick debugging?",
        a: "Hoppscotch, for a single request. Jetic, when the failure depends on what happened in earlier steps.",
      },
      {
        q: "Do they overlap?",
        a: "Both send HTTP requests. Jetic adds the code-derived model, workflow memory, deterministic execution, and stored traces.",
      },
    ],
  },
  {
    slug: "yaak",
    name: "Yaak",
    category: "API clients",
    accent: "a client, or a system of record?",
    description:
      "Yaak is a modern desktop API client focused on a clean request experience. Jetic is a system of record for API behavior: the model, the workflows, and the run evidence stay in your repository.",
    terminalThem: "desktop request client, collections, environments",
    chips: ["Desktop", "Model", "Memory", "Evidence"],
    rows: [
      ["Focus", "A polished client for sending and inspecting requests", "A behavioral model plus deterministic workflow execution"],
      ["Where data lives", "Client collections and workspaces", ".jetic/ files inside the project"],
      ["API context", "Manually kept URLs and parameters", "Scanned routes, middleware, and source provenance"],
      ["State", "Variables and request chaining", "capture and inject with workflow memory"],
      ["Assertions", "Per-request checks", "Per-step expected status and schema validation"],
      ["Review", "Shared collections and history", "Workflow diffs and run traces reviewed like code"],
      ["Best fit", "Daily manual API exploration", "Repeatable behavior verification across a team"],
    ],
    splitTitle: "A beautiful client still needs a durable plan.",
    splitBody:
      "Yaak is pleasant for the request in front of you. Jetic is for the plan that has to survive a refactor: which endpoint, which token, which order, and which expected result.",
    bullets: [
      "Routes are linked to the source that defines them",
      "The sequence is reviewable before it runs",
      "A failure produces a trace, not a lost console",
      "The same file works for a developer and for CI",
    ],
    chooseThem:
      "when you want a modern, comfortable desktop client for day-to-day request work.",
    chooseJetic:
      "when behavior needs to be recorded, reviewed, and repeated by the whole team.",
    useBoth:
      "use Yaak to explore and Jetic to lock the behavior in.",
    faqs: [
      {
        q: "Can Yaak and Jetic share requests?",
        a: "They are separate tools. Jetic builds endpoints from source rather than importing client collections.",
      },
      {
        q: "Is Jetic a desktop app?",
        a: "Jetic has a CLI and a local web IDE called Studio. Both read the same .jetic files.",
      },
      {
        q: "Can I inspect a run visually?",
        a: "Yes. Studio presents a run as a step graph and lets you open the request and response for each step.",
      },
      {
        q: "Which is better for a team?",
        a: "Jetic, when the team needs shared, reviewable behavior. Yaak, when the need is individual request work.",
      },
    ],
  },
  {
    slug: "httpie",
    name: "HTTPie",
    category: "CLI & agentic tools",
    accent: "readable calls, or repeatable state?",
    description:
      "HTTPie makes HTTP pleasant from the terminal: readable output, sensible defaults, and a friendly syntax. Jetic keeps the terminal-first ethos but raises the unit of work from one request to an ordered, stateful workflow.",
    terminalThem: "one readable request at a time",
    chips: ["Terminal-first", "Stateful", "Deterministic", "CI"],
    rows: [
      ["Unit of work", "A single request", "A workflow with ordered steps"],
      ["Syntax", "Expressive CLI arguments", "A JSON file validated against the model"],
      ["API context", "You provide the URL and payload", "Endpoints and parameters come from a source scan"],
      ["State", "Shell variables and piping", "capture and inject in workflow memory"],
      ["Assertions", "Inspect the output", "Expected status and schema validation per step"],
      ["Repeatability", "Rerun the command", "Rerun the same ordered file"],
      ["Best fit", "Quick, readable HTTP calls", "Multi-step journeys with auth and state"],
    ],
    splitTitle: "The terminal is the right home. The request is the wrong unit.",
    splitBody:
      "Individual commands are great until step four depends on a token from step two. Jetic keeps the terminal workflow but makes the dependency explicit and replayable.",
    bullets: [
      "No jq pipelines to move a token between calls",
      "The API contract is read from the model, not retyped",
      "Expected outcomes are checked automatically",
      "A run is stored and can be opened later",
    ],
    chooseThem:
      "when you want the fastest readable way to send one request or debug a single endpoint.",
    chooseJetic:
      "when the value is in the order of calls and the state they pass along.",
    useBoth:
      "probe with HTTPie, then encode the stable sequence in Jetic.",
    faqs: [
      {
        q: "Is Jetic a curl or HTTPie replacement?",
        a: "No. Jetic operates above the single-request layer. For a quick call, HTTPie remains the shorter path.",
      },
      {
        q: "Do I still write commands?",
        a: "You write or generate a workflow file. The runner executes the steps; you do not retype the shell command for each stage.",
      },
      {
        q: "Can I use Jetic in a shell script?",
        a: "Yes. jetic simulate workflow returns a non-zero exit code on failure, so it composes with CI and shell automation.",
      },
      {
        q: "Does Jetic support custom headers?",
        a: "Yes, through step headers and inject. Auth schemes can add Authorization automatically from captured memory.",
      },
    ],
  },
  {
    slug: "ai-coding-agents",
    name: "AI coding agents",
    category: "CLI & agentic tools",
    accent: "an author, or a runner?",
    description:
      "AI coding agents are excellent at reading a codebase and drafting work. Jetic uses that strength for authoring, then hands execution to a deterministic runner. The agent writes the workflow; the runner proves it.",
    terminalThem: "natural-language authoring, tool calls, variable behavior",
    chips: ["MCP", "Authoring", "Deterministic runner", "No AI key"],
    rows: [
      ["Role", "Reads context and drafts changes", "Models the API and executes ordered workflows"],
      ["Execution", "Model-driven tool calls", "Deterministic JSON runner, no model in the run"],
      ["Code context", "Broad repository understanding", "Source-linked endpoints, middleware, and constraints"],
      ["Repeatability", "Can vary between sessions", "Same file and same sequence every time"],
      ["Cost", "Model usage per interaction", "No inference cost for scan or execution"],
      ["Review", "Prompt and transcript", "Workflow diff and stored run trace"],
      ["Best fit", "Authoring, refactoring, and investigation", "Repeatable behavior verification"],
    ],
    splitTitle: "Let the agent write. Let the runner decide.",
    splitBody:
      "Jetic exposes MCP tools so an agent can inspect the model, add endpoints, scaffold workflows, validate them, and run simulations. The saved file is what executes later — not the conversation that produced it.",
    bullets: [
      "The agent works with typed tools instead of guessing URLs",
      "Scaffolding derives bodies and auth chains from the model",
      "Validation catches broken references before a run",
      "Execution remains deterministic and reviewable",
    ],
    chooseThem:
      "when the task is exploratory: understand a codebase, draft a change, or investigate a failure.",
    chooseJetic:
      "when the task is repeatable: prove the same behavior after every change.",
    useBoth:
      "connect the agent to Jetic over MCP so authoring is fast and execution stays deterministic.",
    faqs: [
      {
        q: "Does Jetic need an AI provider?",
        a: "No. The CLI, scanner, verifier, and workflow runner are keyless. MCP is the bridge when you want an agent to author.",
      },
      {
        q: "Can an agent run simulations?",
        a: "Yes, when the simulation tools are exposed and configured. The agent invokes them; the deterministic runner does the work.",
      },
      {
        q: "Is the output of an agent trusted blindly?",
        a: "No. Workflows are validated and can be reviewed before execution. The agent's reasoning is not part of the run.",
      },
      {
        q: "Which agents work with Jetic?",
        a: "Any client that supports MCP can connect. Claude Code, Cursor, Codex, and similar environments are the common setups.",
      },
    ],
  },
  {
    slug: "ai-api-workflows",
    name: "AI-powered API workflows",
    category: "CLI & agentic tools",
    accent: "generated steps, or reviewed files?",
    description:
      "AI-powered workflow tools generate steps from a prompt and often execute them with a model in the loop. Jetic separates those concerns: AI can help author, but the artifact that runs is a reviewed, deterministic file.",
    terminalThem: "generated steps, model in the execution loop",
    chips: ["Reviewable", "Deterministic", "Versioned", "Traceable"],
    rows: [
      ["Artifact", "Generated plan or agent transcript", "A JSON workflow committed to the repository"],
      ["Execution", "Often model-driven at run time", "Fixed ordered steps with no inference"],
      ["Repeatability", "May vary with model or context", "Same file, same order, same checks"],
      ["Cost", "Inference per run or interaction", "No inference cost for execution"],
      ["Auditability", "Prompt and response history", "Workflow diff plus request-level trace"],
      ["Change control", "Rarely versioned like code", "Reviewed in a pull request like source"],
      ["Best fit", "Exploration and flexible automation", "Stable regression journeys"],
    ],
    splitTitle: "A prompt is a proposal. A workflow is a contract.",
    splitBody:
      "Jetic treats the AI output as a draft. The workflow it produces is validated against the behavioral model, reviewed like code, and then executed without a model deciding what step comes next.",
    bullets: [
      "Generated steps are scaffolded from the actual model",
      "Validation runs before anything is sent",
      "The saved file is the only thing executed",
      "Traces show what happened without asking a model to explain it",
    ],
    chooseThem:
      "when the workflow itself must adapt at run time to unknown inputs.",
    chooseJetic:
      "when the behavior should be fixed, reviewed, and replaid after every change.",
    useBoth:
      "use an AI tool to draft the first version, then move the stable path into Jetic.",
    faqs: [
      {
        q: "Is Jetic an AI workflow builder?",
        a: "It can be authored through MCP, but its core is a deterministic runner over a behavioral model. AI is optional.",
      },
      {
        q: "Why avoid a model in the run?",
        a: "Determinism, cost, and reviewability. If the sequence is known, a fixed file is easier to trust and debug.",
      },
      {
        q: "Can I edit an AI-generated workflow?",
        a: "Yes. It is plain JSON. You can change steps, add conditions, and validate the result.",
      },
      {
        q: "What happens when the API changes?",
        a: "Rescan the model, verify it, and update the affected workflow. The diff shows exactly what changed.",
      },
    ],
  },
  {
    slug: "readyapi",
    name: "ReadyAPI",
    category: "Testing & simulation",
    accent: "enterprise suites, or source-first journeys?",
    description:
      "ReadyAPI is a mature, enterprise-focused API testing suite with broad protocol coverage and a deep feature surface. Jetic is a narrower, source-first alternative for Node.js teams that want the model to come from the code.",
    terminalThem: "enterprise test suites, broad protocol coverage, GUI authoring",
    chips: ["Source-first", "Lightweight", "Stateful", "CI"],
    rows: [
      ["Setup", "Install a desktop suite and author tests in the UI", "Install a CLI and scan the Express project"],
      ["Source awareness", "Tests live beside the API, not derived from it", "Model is derived from routes, middleware, and source lines"],
      ["Protocol breadth", "Broad: SOAP, GraphQL, JDBC, JMS, and more", "Focused on HTTP APIs for Express + TypeScript today"],
      ["State", "Property transfer and scripts between steps", "capture and inject declared in the workflow file"],
      ["Assertions", "Rich assertion library and data-driven tests", "Expected status, schema validation, conditions, retries"],
      ["CI fit", "Commercial runner and integrations", "One command, file-based workflows, stored traces"],
      ["Best fit", "Large enterprises with heterogeneous protocols", "Node.js teams that want code-aware behavior tests"],
    ],
    splitTitle: "Breadth is valuable until it becomes overhead.",
    splitBody:
      "ReadyAPI covers protocols and enterprise scenarios that Jetic does not. Jetic trades that breadth for a tighter loop: scan your Express source, review a small model, and run stateful journeys in the terminal.",
    bullets: [
      "No desktop suite required for the core loop",
      "The endpoint contract is derived from the repository",
      "Workflows are small enough to review in a pull request",
      "Execution has no model or proprietary runtime dependency",
    ],
    chooseThem:
      "when you need broad protocol coverage, enterprise governance, or a mature GUI suite.",
    chooseJetic:
      "when your surface is an Express HTTP API and the source should drive the tests.",
    useBoth:
      "keep ReadyAPI for the enterprise protocols while Jetic covers the Node.js HTTP journeys.",
    faqs: [
      {
        q: "Does Jetic support SOAP or JDBC?",
        a: "The current scanner and workflow runner focus on HTTP APIs for Express + TypeScript. Other stacks can be modeled manually, but broad protocol coverage is not the goal yet.",
      },
      {
        q: "Is Jetic enterprise-ready?",
        a: "It is designed for team workflows with reviewable files, environments, secret references, and CI-friendly execution. Evaluate it against your specific governance requirements.",
      },
      {
        q: "Can I migrate ReadyAPI tests?",
        a: "There is no automatic suite import. The model and workflow format are different by design; start with the journeys that matter most.",
      },
      {
        q: "Which is faster to adopt?",
        a: "Jetic, for a Node.js project: install the CLI, run init and scan, and the first model exists in minutes.",
      },
    ],
  },
  {
    slug: "karate",
    name: "Karate",
    category: "Testing & simulation",
    accent: "a DSL, or a behavioral model?",
    description:
      "Karate is a well-established testing framework with its own DSL, strong API assertions, and a mature CI story. Jetic starts from the application source and keeps the workflow as JSON over a shared behavioral model.",
    terminalThem: "a testing DSL, feature files, Java ecosystem",
    chips: ["No DSL", "Source model", "JSON workflows", "Traces"],
    rows: [
      ["Authoring", "A dedicated DSL in feature files", "JSON workflows over endpoints from model.json"],
      ["API context", "URLs and payloads written in the test", "Routes, params, and middleware scanned from source"],
      ["State", "Variables and call results in the DSL", "capture and inject in workflow memory"],
      ["Assertions", "Rich built-in matching and schema checks", "Expected status, schema validation, conditions, retries"],
      ["Runtime", "JVM-based test runner", "Node.js CLI for Node.js projects"],
      ["Evidence", "Reports and logs", "Per-step trace with requests, responses, and captures"],
      ["Best fit", "Teams comfortable with a testing DSL and JVM", "Node.js teams that want the model and workflow in one format"],
    ],
    splitTitle: "A DSL is powerful. A model is shared.",
    splitBody:
      "Karate gives testers a expressive language. Jetic keeps the API description separate from the test, so the same model can feed scanning, authoring, validation, execution, and reporting.",
    bullets: [
      "No new test language to learn for the core flow",
      "The endpoint list is generated, not transcribed",
      "Studio and MCP read the same model as the runner",
      "Workflows stay small and diffable",
    ],
    chooseThem:
      "when your team already invests in the Karate DSL or needs its JVM ecosystem and matching features.",
    chooseJetic:
      "when you want a source-derived model and a CLI-first workflow loop in Node.js.",
    useBoth:
      "keep Karate for suites that already work and use Jetic for the code-aware Express journeys.",
    faqs: [
      {
        q: "Is Jetic a framework like Karate?",
        a: "Jetic is a CLI and behavioral model with a deterministic workflow runner, not a general-purpose test DSL.",
      },
      {
        q: "Do I write feature files?",
        a: "No. You write or scaffold JSON workflows whose steps reference model endpoints.",
      },
      {
        q: "Can Jetic run in a JVM pipeline?",
        a: "The runner is a Node.js CLI, so the job needs Node.js available. It can still be called from any CI system.",
      },
      {
        q: "Which is better for non-developers?",
        a: "Karate's DSL may be friendlier to dedicated testers. Jetic is aimed at developers who want the source to drive the model.",
      },
    ],
  },
  {
    slug: "rest-assured",
    name: "REST Assured",
    category: "Testing & simulation",
    accent: "Java tests, or language-agnostic workflows?",
    description:
      "REST Assured is a mature Java library for writing HTTP API tests in code. Jetic keeps the test definition language-agnostic and data-driven, with the API model shared across the CLI, Studio, and MCP.",
    terminalThem: "Java test code, JUnit/TestNG, build-tool integration",
    chips: ["Language-agnostic", "JSON workflows", "Model-driven", "CI"],
    rows: [
      ["Language", "Java (or another JVM language)", "JSON workflows executed by the Jetic CLI"],
      ["Test style", "Code with a fluent request/assertion API", "Ordered steps over model endpoints"],
      ["API context", "URLs and payloads written in test code", "Routes, middleware, and source lines scanned from the app"],
      ["State", "Java variables and helper methods", "capture and inject in workflow memory"],
      ["Assertions", "Hamcrest and JUnit assertions", "Expected status, schema validation, conditions, retries"],
      ["Reports", "Build-tool reports and logs", "Stored per-step traces under .jetic/runs"],
      ["Best fit", "JVM teams that want tests in Java", "Polyglot teams that want the behavior artifact outside a language"],
    ],
    splitTitle: "Code tests are flexible. Shared artifacts are portable.",
    splitBody:
      "REST Assured is a strong fit when the test belongs in the Java codebase. Jetic is a better fit when the behavior needs to be reviewed by people who do not live in that codebase, and executed by CI without a build.",
    bullets: [
      "The workflow is language-agnostic JSON",
      "Endpoints come from the application model, not test constants",
      "State between calls is declared, not coded",
      "A trace is available without reading a build report",
    ],
    chooseThem:
      "when your team is JVM-first and wants tests versioned with the Java service.",
    chooseJetic:
      "when multiple services or languages share one behavior artifact and a common runner.",
    useBoth:
      "keep unit-level REST Assured tests and use Jetic for cross-service journeys.",
    faqs: [
      {
        q: "Does Jetic generate Java tests?",
        a: "No. Jetic executes JSON workflows. It does not emit REST Assured code.",
      },
      {
        q: "Can Jetic test a Java API?",
        a: "Yes, over HTTP. The static scanner currently targets Express + TypeScript, so a non-Express service would need a hand-built model.",
      },
      {
        q: "Which is more portable?",
        a: "Jetic workflows, because they are plain JSON and do not require a JVM build to run.",
      },
      {
        q: "Can both run in the same pipeline?",
        a: "Yes. They are independent steps in a CI job.",
      },
    ],
  },
];
