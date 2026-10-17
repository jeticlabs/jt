import { JeticIcon } from "@/components/jetic-icon";
import { MarketingNavbar, SiteFooter } from "@/components/marketing-ui";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "curl vs Jetic: From HTTP requests to code-aware API testing",
    description:
        "curl gives you direct control over HTTP requests. Jetic adds a code-aware, repeatable API testing workflow around your application.",
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
    ["Primary purpose", "Transfer data and make HTTP requests", "Code-aware API testing and simulation workflows"],
    ["Request execution", "Direct command-line requests", "Supported requests and simulations through Jetic workflows"],
    ["API context", "You supply the request details", "Designed to use a model of your API and codebase"],
    ["Repeatability", "Shell scripts and external tooling", "Reusable testing workflows and simulations"],
    ["Multi-step testing", "Scripts and custom orchestration", "Structured workflows where supported"],
    ["AI integration", "Can be used by AI agents as a command-line tool", "MCP integration exposes supported Jetic tools to compatible agents"],
    ["Failure investigation", "Inspect response, status, and output", "Combine available simulation results with API context"],
    ["Automation", "Shell scripts, CI jobs, and other integrations", "Configured workflows and automation capabilities"],
    ["Best fit", "Quick requests, debugging, scripting, and HTTP transfers", "Teams building repeatable, code-aware API testing workflows"],
];

const faqs: { q: string; a: ReactNode }[] = [
    {
        q: "Is Jetic a replacement for curl?",
        a: "No. curl is a mature, powerful HTTP tool, and it stays the simplest option for quick requests. Jetic gives developers a more structured, code-aware approach to API testing alongside it.",
    },
    {
        q: "Can Jetic execute HTTP requests?",
        a: "Yes, through supported requests and simulations in Jetic workflows. For one-off requests where you only need to inspect a response, curl is still a fast choice.",
    },
    {
        q: "Can curl perform automated API testing?",
        a: "Yes. curl can be scripted and run in CI jobs. You define the steps, the checks, and the orchestration yourself, usually with shell scripts or other tooling.",
    },
    {
        q: "What makes Jetic different from a collection of curl scripts?",
        a: "Jetic works from a model of your API and codebase and organizes testing into reusable workflows and simulations. With curl scripts, you assemble and maintain each of those pieces yourself.",
    },
    {
        q: "Can AI coding agents use Jetic through MCP?",
        a: "Yes. Jetic's MCP integration exposes supported Jetic tools to compatible agents. Which tools are available depends on your Jetic setup.",
    },
    {
        q: "Can I use Jetic in CI/CD pipelines?",
        a: "Jetic supports configured workflows and automation capabilities. Check the documentation for the integrations available for your pipeline.",
    },
    {
        q: "Does Jetic understand my Node.js codebase?",
        a: "Jetic is designed to build a model of your API and codebase, including endpoints, schemas, and dependency information. See the documentation for supported frameworks and project setups.",
    },
    {
        q: "Does Jetic require AI inference for every simulation?",
        a: "Not necessarily. AI agents can drive Jetic through MCP, but the simulations themselves are reusable workflows. The exact behavior depends on the tools and integrations you configure.",
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
                curl vs Jetic: From HTTP requests to code-aware API testing
            </h1>
            <CurlToJetic />

            <div className="mt-5 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div className="max-w-[560px] text-[13px] leading-[1.55] text-white/55">
                    <p>
                        curl gives you a direct way to send requests and inspect responses. Jetic builds on the
                        API testing workflow with code-aware context, reusable simulations, and tools designed
                        for developers who need to understand and validate how their APIs behave.
                    </p>
                    <p className="mt-3">
                        Use curl for direct requests. Use Jetic when your API testing workflow needs more
                        context, structure, and repeatability.
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
                    <p className="mb-5 text-xs text-white/45">Send HTTP requests. Inspect responses. Script your workflow.</p>
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
                    <p className="mb-5 text-xs text-white/45">Model API behavior. Build simulations. Reuse testing workflows.</p>
                    <Window title="GET /api/users/:id">
                        <ul className="space-y-2">
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">valid user</span>
                                <Pill tone="ok">200</Pill>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">missing user</span>
                                <Pill tone="warn">404</Pill>
                            </li>
                            <li className="flex items-center justify-between">
                                <span className="text-white/80">invalid ID</span>
                                <Pill tone="err">400</Pill>
                            </li>
                        </ul>
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
                curl can be scripted, automated, and run in CI/CD. The difference is how much of the testing
                context and workflow you assemble yourself.
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
            label: "Jetic: Code-aware testing context",
            body: "Work with the endpoint, schema, and dependency information represented in Jetic's project model rather than manually reconstructing the full context for every task.",
            visual: (
                <Window title="API model" className="w-full max-w-[330px]">
                    <ul className="space-y-1.5 text-white/80">
                        <li><span className="text-emerald-300">GET </span>/api/users/:id</li>
                        <li><span className="text-sky-300">POST</span> /api/users</li>
                        <li className="pl-4 text-white/40">schema: User</li>
                        <li className="pl-4 text-white/40">depends on: db.users</li>
                    </ul>
                </Window>
            ),
        },
        {
            title: "Move beyond one-off requests",
            label: "Jetic: Reusable API simulations",
            body: "Build repeatable workflows for testing API behavior and examining results, with the exact capabilities determined by the tools and integrations available in Jetic.",
            visual: (
                <Window title="simulations" className="w-full max-w-[330px]">
                    <ul className="space-y-2">
                        {[
                            ["valid user", "ok", "200"],
                            ["missing user", "warn", "404"],
                            ["invalid ID", "err", "400"],
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
            body: "Use curl where direct HTTP control is the simplest solution, and Jetic where an integrated API testing workflow brings more value.",
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
            <Heading className="max-w-[520px]">From a single request to a complete simulation</Heading>
            <p className="mt-3 max-w-[520px] text-[13px] leading-[1.55] text-white/55">
                The same API testing task in both tools. curl can reach many of the same outcomes with
                scripts and additional tooling.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
                <div className="bg-black p-6">
                    <h3 className="text-[13px] font-medium">With curl</h3>
                    <Window title="terminal" className="mt-4">
                        <p className="text-white/90">
                            <span className="text-white/40">$ </span>curl -i http://localhost:3000/api/users/123
                        </p>
                    </Window>
                    <p className="mt-4 text-xs leading-[1.5] text-white/50">
                        Send the request and inspect the HTTP response. More complex scenarios can be scripted,
                        but you must define the steps and checks yourself.
                    </p>
                </div>

                <div className="bg-black p-6">
                    <h3 className="text-[13px] font-medium">With Jetic</h3>
                    <Window title="agent task" className="mt-4">
                        <p className="text-white/90">Inspect GET /api/users/:id.</p>
                        <p className="text-white/90">Generate a simulation for a valid user,</p>
                        <p className="text-white/90">a missing user, and an invalid ID.</p>
                        <p className="text-white/90">Validate the expected response behavior.</p>
                    </Window>
                    <p className="mt-4 text-xs leading-[1.5] text-white/50">
                        An example natural-language task for a compatible agent using Jetic&apos;s exposed tools.
                        The actual simulation and assertions depend on what your setup supports.
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
            body: "when you need to make a quick HTTP request, inspect headers, debug an endpoint, or write a small shell script.",
        },
        {
            title: "Choose Jetic",
            body: "when you want code-aware API context, reusable simulations, and a structured workflow for understanding and validating API behavior.",
        },
        {
            title: "Use both",
            body: "Use curl where direct HTTP control is the simplest solution, and use Jetic where an integrated API testing workflow brings more value.",
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



function Panel({
    name,
    tagline,
    className = "",
    children,
}: {
    name: string;
    tagline: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={`w-full rounded-2xl border border-white/10 bg-black p-5 md:w-[56%] ${className}`}
        >
            <h3 className="text-base font-medium tracking-[-0.01em]">{name}</h3>
            <p className="mb-4 mt-1 text-xs leading-[1.5] text-white/50">{tagline}</p>
            {children}
        </div>
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