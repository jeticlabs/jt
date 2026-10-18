import { JeticIcon } from "@/components/jetic-icon";
import { MarketingNavbar, SiteFooter } from "@/components/marketing-ui";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "curl vs Jetic: One request, or a deterministic, stateful workflow",
    description:
        "curl sends a single HTTP request. Jetic runs ordered JSON steps that capture values from one response and inject them into the next — deterministically, with no model in the loop.",
};

/* ----------------------------- Content ----------------------------- */

const EXPLORE_HREF = "/";
const DOCS_HREF = "/docs";

const navItems = [
    { label: "At a glance", href: "#glance" },
    { label: "Where curl ends", href: "#differences" },
    { label: "Example", href: "#example" },
    { label: "Verdict", href: "#verdict" },
    { label: "FAQ", href: "#faq" },
];

const tableRows = [
    ["Primary purpose", "Send HTTP requests and inspect the response", "Run stateful API journeys from a model of your code"],
    ["How a call is defined", "Flags typed into a shell command", "A JSON step inside a workflow file"],
    ["API context", "You supply the URL, headers, and payload", "The endpoint comes from model.json, built by a static scan of your routes"],
    ["State between calls", "Shell variables and glue code you write", "capture stores response fields in memory; inject sends them into later steps"],
    ["Auth across steps", "Copy the token into every call by hand", "Capture the token once, inject Authorization on each protected step"],
    ["Repeatability", "Whatever the script does on that machine", "The same ordered steps on every run — nothing is inferred at execution time"],
    ["Expectations", "Read the output and compare by eye", "expectStatus asserts each step; continueOnStatus, onFailure and retry cover the edges"],
    ["AI involvement", "An agent can run curl commands", "An agent authors and validates the workflow over MCP; the runner executes it without an LLM"],
    ["Version control", "Scripts, if you keep them", "Workflows and the model are JSON files in .jetic/, reviewed like code"],
    ["Best fit", "One-off requests, headers, quick debugging", "Journeys where the sequence and the state are the thing being tested"],
];

const faqs: { q: string; a: ReactNode }[] = [
    {
        q: "Is Jetic a replacement for curl?",
        a: "No. curl is still the fastest way to send one request and look at what comes back. Jetic covers the layer above it: a model of your endpoints plus ordered, stateful steps that you can re-run.",
    },
    {
        q: "Can Jetic send HTTP requests?",
        a: "Yes. Every workflow step is an HTTP call against a live server, addressed with a method and path from model.json. jetic simulate workflow runs the whole list in order.",
    },
    {
        q: "Can curl do the same journey?",
        a: "Yes, with a shell script and something like jq to pull values out of JSON. You write the token plumbing yourself for every step. Jetic declares the capture and the injection once, in the workflow file.",
    },
    {
        q: "What exactly gets captured?",
        a: "Two directions. captureInput saves resolved request fields before the call — generated emails and passwords you will need again. capture saves response fields after a successful response, using dot-notation paths such as data.tokens.access. Both land in run memory, and later steps read them as {{workflow:key}}.",
    },
    {
        q: "Is the execution deterministic?",
        a: "Yes. The runner walks the JSON steps in order and checks each expectStatus. Conditions, continueOnStatus, onFailure and retry are all written in the file, so nothing is decided by a model at execution time.",
    },
    {
        q: "Do I need an AI provider to run workflows?",
        a: "No. jetic init, jetic scan and jetic simulate workflow are keyless. MCP is there for authoring and validation with an agent, not for executing the run.",
    },
    {
        q: "Can AI coding agents use Jetic through MCP?",
        a: "Yes. The agent builds or edits the workflow with jetic_validate_workflow and jetic_create_workflow, then the CLI runner executes the saved file. The model writes the steps; it does not take part in the run.",
    },
    {
        q: "Does Jetic understand my Node.js codebase?",
        a: "For Express + TypeScript, jetic scan reads tsconfig.json and the router chain: paths, path parameters, nested prefixes, auth middleware, and the source file and line of each route. Schemas and business constraints are added in Studio or through MCP.",
    },
    {
        q: "Can I run the same workflow in CI?",
        a: "Yes. Workflows are files, so a job only needs jetic simulate workflow --workflow .jetic/workflows/<name>.json. Prompts for genuinely unknowable values, such as an OTP, can be supplied through environment variables so the run never blocks.",
    },
];

/* ------------------------- Small components ------------------------- */

function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={`text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[34px] ${className}`}>
            {children}
        </h2>
    );
}

function Button({ href, primary, children }: { href: string; primary?: boolean; children: ReactNode }) {
    return (
        <a
            href={href}
            className={
                primary
                    ? "rounded-md bg-white px-3.5 py-2 text-xs font-medium text-black transition-colors hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    : "rounded-md bg-white/10 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            }
        >
            {children}
        </a>
    );
}

function Window({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
    return (
        <div className={`overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0c] ${className}`}>
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full bg-white/15" />
                <span className="ml-2 font-mono text-[10px] text-white/40">{title}</span>
            </div>
            <div className="p-4 font-mono text-[11px] leading-[1.7]">{children}</div>
        </div>
    );
}

function Pill({ tone, children }: { tone: "ok" | "warn" | "err"; children: ReactNode }) {
    const color =
        tone === "ok" ? "bg-emerald-400/15 text-emerald-300" : tone === "warn" ? "bg-amber-400/15 text-amber-300" : "bg-rose-400/15 text-rose-300";
    return <span className={`rounded px-1.5 py-0.5 text-[10px] ${color}`}>{children}</span>;
}

/* ----------------------------- Sections ----------------------------- */

function Hero() {
    return (
        <section className="mx-auto max-w-[1080px] px-6 pb-24 pt-14">
            <p className="mb-6 flex items-center gap-2 text-xs text-white/60">
                <span className="font-semibold text-white">Jetic</span>
                <span className="text-white/25">/</span>
                <span className="font-mono">curl</span>
            </p>

            <h1 className="max-w-[640px] text-[36px] font-medium leading-[1.05] tracking-[-0.035em] sm:text-[44px]">
                curl vs Jetic: one HTTP request, or a deterministic workflow
            </h1>
            <CurlToJetic />

            <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-[560px] text-[13px] leading-[1.55] text-white/55">
                    <p>
                        curl sends one request and prints what came back. Jetic runs a workflow: an ordered list
                        of JSON steps where each response can be captured into memory and injected into the next
                        call, so a login token, a generated email, or a workspace ID carries through the whole
                        journey.
                    </p>
                    <p className="mt-3">
                        The runner is deterministic. Steps execute in order, every expectStatus is checked, and
                        no model decides what happens mid-run.
                    </p>
                </div>
                <div className="flex shrink-0 gap-2">
                    <Button href={EXPLORE_HREF} primary>
                        Explore Jetic
                    </Button>
                    <Button href={DOCS_HREF}>View Documentation</Button>
                </div>
            </div>

            {/* Hero visual: terminal vs workflow */}
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
                <div className="bg-black p-5">
                    <p className="mb-1 text-sm font-medium">curl</p>
                    <p className="mb-5 text-xs text-white/45">One request, one response. You hold the state.</p>
                    <Window title="terminal">
                        <p className="text-white/90">
                            <span className="text-white/40">$ </span>curl -i http://localhost:3000/api/users/123
                        </p>
                        <p className="mt-3 text-emerald-300">HTTP/1.1 200 OK</p>
                        <p className="text-white/45">content-type: application/json</p>
                        <p className="mt-2 text-white/70">{`{ "id": 123, "name": "Ada" }`}</p>
                    </Window>
                </div>
                <div className="bg-black p-5">
                    <p className="mb-1 text-sm font-medium">Jetic</p>
                    <p className="mb-5 text-xs text-white/45">Ordered steps. Captured state. Injected headers.</p>
                    <Window title="user-onboarding.json">
                        <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">1 register</span>
                                <Pill tone="ok">201</Pill>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">2 login</span>
                                <Pill tone="ok">200</Pill>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">3 create order</span>
                                <Pill tone="ok">201</Pill>
                            </li>
                        </ul>
                        <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-[10px] text-white/40">
                            <p>
                                capture <span className="text-white/70">accessToken</span> ← data.tokens.access
                            </p>
                            <p>
                                inject <span className="text-white/70">header:Authorization</span>
                            </p>
                        </div>
                    </Window>
                </div>
            </div>
        </section>
    );
}

function StickyNav() {
    return (
        <nav
            aria-label="Page sections"
            className="sticky top-0 z-10 border-y border-white/10 bg-black/80 backdrop-blur"
        >
            <ul className="mx-auto flex max-w-[1080px] gap-6 overflow-x-auto px-6 py-3 text-xs text-white/55">
                {navItems.map((item) => (
                    <li key={item.href} className="shrink-0">
                        <a href={item.href} className="transition-colors hover:text-white focus-visible:text-white">
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function Glance() {
    return (
        <section id="glance" className="mx-auto max-w-[1080px] scroll-mt-16 px-6 py-20">
            <Heading className="max-w-[420px]">Jetic vs curl at a glance</Heading>
            <p className="mt-3 max-w-[520px] text-[13px] leading-[1.55] text-white/55">
                curl can be scripted and run in CI, and for a single endpoint it usually is the right tool. The
                difference shows up once a test has more than one step: curl moves data between calls through
                your shell, Jetic keeps it in workflow memory.
            </p>

            <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[720px] border-collapse text-left text-[11px]">
                    <thead>
                        <tr className="border-b border-white/10 bg-[#0c0c0c]">
                            <th scope="col" className="w-[18%] px-4 py-3 font-medium">Comparison</th>
                            <th scope="col" className="w-[38%] px-4 py-3 font-medium">curl</th>
                            <th scope="col" className="w-[44%] px-4 py-3 font-medium">Jetic</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map(([label, curl, jetic]) => (
                            <tr key={label} className="border-b border-white/10 align-top last:border-b-0">
                                <th scope="row" className="px-4 py-3.5 font-medium text-white">{label}</th>
                                <td className="px-4 py-3.5 leading-[1.5] text-white/50">{curl}</td>
                                <td className="px-4 py-3.5 leading-[1.5] text-white/50">{jetic}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function Differences() {
    const cells: { title: string; label: string; body: string; visual: ReactNode }[] = [
        {
            title: "Start with the request",
            label: "curl: Direct HTTP control",
            body: "Send requests, specify headers, pass payloads, and inspect the response. curl remains an excellent tool for quick debugging and low-level HTTP work.",
            visual: (
                <Window title="terminal" className="w-full max-w-[330px]">
                    <p className="text-white/90">
                        <span className="text-white/40">$ </span>curl -i -X POST \
                    </p>
                    <p className="pl-4 text-white/90">-H &quot;Content-Type: application/json&quot; \</p>
                    <p className="pl-4 text-white/90">-d &apos;{`{"name":"Ada"}`}&apos; \</p>
                    <p className="pl-4 text-white/90">localhost:3000/api/users</p>
                    <p className="mt-2 text-emerald-300">HTTP/1.1 201 Created</p>
                </Window>
            ),
        },
        {
            title: "Understand the API",
            label: "Jetic: the route, not a hand-typed URL",
            body: "jetic scan reads tsconfig.json and walks the Express router chain — nested prefixes, path parameters, auth middleware, and the source file and line behind each route — then writes them to model.json. Steps reference an endpoint by method and path.",
            visual: (
                <Window title="model.json" className="w-full max-w-[330px]">
                    <ul className="space-y-1.5 text-white/80">
                        <li><span className="text-emerald-300">GET </span>/api/users/:id</li>
                        <li><span className="text-sky-300">POST</span> /api/users</li>
                        <li className="pl-4 text-white/40">middleware: auth</li>
                        <li className="pl-4 text-white/40">source: routes/users.ts:42</li>
                    </ul>
                </Window>
            ),
        },
        {
            title: "Let the response carry the next request",
            label: "Jetic: capture → memory",
            body: "capture writes response fields into run memory using dot-notation paths; captureInput remembers generated request values before the call. Later steps read them as {{workflow:key}}, so the token from step 2 is the Authorization header in step 3.",
            visual: (
                <Window title="capture" className="w-full max-w-[330px]">
                    <p className="text-white/80">
                        2 login <span className="text-emerald-300">200</span>
                    </p>
                    <p className="mt-2 text-white/40">capture</p>
                    <ul className="mt-1 space-y-1 text-white/80">
                        <li>accessToken <span className="text-white/40">data.tokens.access</span></li>
                        <li>userId <span className="text-white/40">data.user.id</span></li>
                    </ul>
                    <p className="mt-3 text-white/40">inject</p>
                    <ul className="mt-1 space-y-1 text-white/80">
                        <li>header:Authorization</li>
                    </ul>
                </Window>
            ),
        },
        {
            title: "Re-run the same sequence",
            label: "Jetic: deterministic execution",
            body: "A workflow is JSON in .jetic/workflows/. Steps run in order and each expectStatus is asserted; retry, continueOnStatus and onFailure are written in the file. Same file in, same sequence out — no model picks the path.",
            visual: (
                <Window title="workflow" className="w-full max-w-[330px]">
                    <ul className="space-y-2">
                        {[
                            ["1 register", "ok", "201"],
                            ["2 login", "ok", "200"],
                            ["3 create order", "ok", "201"],
                        ].map(([name, tone, code]) => (
                            <li key={name} className="flex items-center justify-between text-white/80">
                                <span>{name}</span>
                                <Pill tone={tone as "ok" | "warn" | "err"}>{code}</Pill>
                            </li>
                        ))}
                    </ul>
                </Window>
            ),
        },
        {
            title: "Use them together",
            label: "curl + Jetic",
            body: "Probe a single request with curl while you are figuring out the payload. Once the sequence matters, encode it as a workflow and let the runner replay it.",
            visual: (
                <div className="flex w-full max-w-[330px] items-center justify-center gap-3 font-mono text-[11px]">
                    <span className="rounded-lg border border-white/15 px-4 py-3 text-white/80">curl</span>
                    <span className="text-white/30">+</span>
                    <span className="rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white">Jetic</span>
                </div>
            ),
        },
    ];

    return (
        <section id="differences" className="mx-auto max-w-[1080px] scroll-mt-16 px-6 py-20">
            <Heading className="max-w-[460px]">Where curl ends and Jetic begins</Heading>

            <div className="mt-10 grid overflow-hidden rounded-[28px] border border-white/10 md:grid-cols-2">
                {cells.map((cell, i) => (
                    <article
                        key={cell.title}
                        className={[
                            "flex flex-col p-6",
                            i % 2 === 0 ? "md:border-r md:border-white/10" : "",
                            i < 2 ? "border-b border-white/10" : "",
                            i === 2 ? "border-b border-white/10 md:border-b-0" : "",
                        ].join(" ")}
                    >
                        <div className="flex min-h-[200px] flex-1 items-center justify-center pb-8 pt-4">{cell.visual}</div>
                        <p className="text-xs text-white/40">{cell.label}</p>
                        <h3 className="mt-1 text-[13px] font-medium">{cell.title}</h3>
                        <p className="mt-1.5 max-w-[360px] text-xs leading-[1.5] text-white/50">{cell.body}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function Example() {
    return (
        <section id="example" className="mx-auto max-w-[1080px] scroll-mt-16 px-6 py-20">
            <Heading className="max-w-[520px]">From one command to one workflow</Heading>
            <p className="mt-3 max-w-[520px] text-[13px] leading-[1.55] text-white/55">
                The same three-step journey: register, log in, create an order. Both versions work. The
                difference is who moves the token between step 2 and step 3.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
                <div className="bg-black p-6">
                    <h3 className="text-[13px] font-medium">With curl</h3>
                    <Window title="terminal" className="mt-4">
                        <pre className="overflow-x-auto whitespace-pre text-white/85">{`# register
curl -s -X POST localhost:3000/api/users \\
  -H 'content-type: application/json' \\
  -d '{"email":"ada@example.com","password":"s3cret"}'

# log in, then pull the token out yourself
TOKEN=$(curl -s -X POST localhost:3000/api/auth/login \\
  -H 'content-type: application/json' \\
  -d '{"email":"ada@example.com","password":"s3cret"}' \\
  | jq -r .data.tokens.access)

# create an order as that user
curl -i -X POST localhost:3000/api/orders \\
  -H "authorization: Bearer $TOKEN"`}</pre>
                    </Window>
                    <p className="mt-4 text-xs leading-[1.5] text-white/50">
                        Works, but the token only exists in your shell. Every new step means another variable,
                        another jq path, and another chance to point at the wrong environment.
                    </p>
                </div>

                <div className="bg-black p-6">
                    <h3 className="text-[13px] font-medium">With Jetic</h3>
                    <Window title=".jetic/workflows/user-onboarding.json" className="mt-4">
                        <pre className="overflow-x-auto whitespace-pre text-white/85">{`{
  "name": "User onboarding",
  "steps": [
    { "name": "1. Register", "method": "POST", "path": "/api/users",
      "expectStatus": 201,
      "body": { "email": "{{faker.internet.email}}" },
      "captureInput": { "workflow:email": "email" } },

    { "name": "2. Log in", "method": "POST", "path": "/api/auth/login",
      "body": { "email": "{{workflow:email}}" },
      "capture": { "workflow:accessToken": "data.tokens.access" } },

    { "name": "3. Create order", "method": "POST", "path": "/api/orders",
      "inject": { "header:Authorization": "Bearer {{workflow:accessToken}}" } }
  ]
}`}</pre>
                    </Window>
                    <p className="mt-4 text-xs leading-[1.5] text-white/50">
                        The runner generates the email, remembers it, captures the token from the login
                        response, and injects it as a header. Re-run it with{" "}
                        <span className="font-mono text-white/70">jetic simulate workflow</span> — same file,
                        same order, same result.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Verdict() {
    const items = [
        {
            title: "Choose curl",
            body: "when you need to send one request, inspect headers, debug an endpoint, or write a small shell script. Nothing beats it for a direct HTTP call.",
        },
        {
            title: "Choose Jetic",
            body: "when the test is a journey: capture the token from login, reuse the generated email, inject the header on every protected step, and re-run the same JSON file tomorrow.",
        },
        {
            title: "Use both",
            body: "Probe with curl while you work out a payload, then encode the sequence as a workflow once the order of steps starts to matter.",
        },
    ];

    return (
        <section id="verdict" className="mx-auto max-w-[1080px] scroll-mt-16 px-6 py-20">
            <Heading className="max-w-[560px]">
                You don&apos;t need to replace curl. You need the right testing workflow.
            </Heading>
            <p className="mt-3 text-[13px] text-white/55">When should you use curl or Jetic?</p>

            <div className="mt-10 grid overflow-hidden rounded-2xl border border-white/10 md:grid-cols-3">
                {items.map((item, i) => (
                    <div
                        key={item.title}
                        className={[
                            "p-6",
                            i < 2 ? "border-b border-white/10 md:border-b-0 md:border-r" : "",
                        ].join(" ")}
                    >
                        <h3 className="text-[13px] font-medium">{item.title}</h3>
                        <p className="mt-2 text-xs leading-[1.55] text-white/50">{item.body}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 flex gap-2">
                <Button href={EXPLORE_HREF} primary>
                    Try Jetic
                </Button>
                <Button href={DOCS_HREF}>Read the documentation</Button>
            </div>
        </section>
    );
}

function Faq() {
    return (
        <section
            id="faq"
            className="mx-auto grid max-w-[1080px] scroll-mt-16 gap-10 px-6 py-20 md:grid-cols-[1fr_1.9fr]"
        >
            <Heading>Frequently asked questions</Heading>
            <div className="divide-y divide-white/10 border-y border-white/10">
                {faqs.map((item) => (
                    <details key={item.q} className="group py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[13px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                            {item.q}
                            <svg
                                viewBox="0 0 16 16"
                                className="h-3.5 w-3.5 shrink-0 text-white/50 transition-transform group-open:rotate-45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            >
                                <path d="M8 3v10M3 8h10" />
                            </svg>
                        </summary>
                        <p className="mt-2.5 max-w-[560px] text-xs leading-[1.6] text-white/50">{item.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}


function CurlToJetic() {
    return (
        <section
            aria-label="From curl to Jetic"
            className="mx-auto max-w-[1080px] bg-black px-6 py-16 text-white"
        >
            <div className="relative flex flex-col gap-4 md:block md:h-[560px]">
                {/* Z line (desktop only): top bar, diagonal, bottom bar */}
                <svg
                    aria-hidden
                    className="pointer-events-none absolute inset-0 hidden h-full w-full text-white/15 md:block"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    fill="none"
                >
                    <path
                        d="M0 0 H100 L0 100 H100"
                        stroke="currentColor"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* Top-left: curl */}

                <Image src="/images/cli-tools/curl.png" alt="curl" width={500} height={500} />


                {/* Mobile-only connector */}
                <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="mx-auto h-4 w-4 text-white/30 md:hidden"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M8 2v11M3.5 9 8 13.5 12.5 9" />
                </svg>

                {/* Bottom-right: Jetic */}
                <div
                    className="md:absolute md:bottom-0 md:right-0"
                >
                    <div className="flex items-center gap-4 text-6xl font-light"><JeticIcon size={100} /></div>
                </div>
            </div>
        </section>
    );
}
/* ------------------------------- Page ------------------------------- */

export default function CurlVsJeticPage() {
    return (
        <main className="min-h-screen scroll-smooth bg-black font-sans text-white antialiased">
            <MarketingNavbar />
            <Hero />
            <StickyNav />
            <Glance />
            <Differences />
            <Example />
            <Verdict />
            <Faq />
            <SiteFooter />
        </main>
    );
}