"use client";
import MarketingNavbar from "@/components/marketing-ui/marketing-navbar"
import SiteFooter from "@/components/marketing-ui/site-footer"
import Image from "next/image";
import { useState, type ReactNode } from "react";


export default function ExternalAgentPage() {
    return (
        <div className="flex flex-col min-h-screen w-full bg-[#0a0a0a] font-['Inter',system-ui,sans-serif] text-white antialiased">
            <MarketingNavbar />

            <div className="flex-1">
                <ConnectSection />
                <StepsSection />
                <CapabilitiesSection />
                <FaqSection />
            </div>

            <SiteFooter />
        </div>
    )
}



/* ----------------------------- Data ----------------------------- */

const INSTALL_PROMPT = "npx jetic mcp";

type Agent = {
    name: string;
    description: string;
    linkText: string;
    href: string;
    icon: ReactNode;
};

const agents: Agent[] = [
    {
        name: "Codex",
        description:
            "Connect Codex to Jetic to inspect API behavior, work with available testing tools, and investigate simulation results.",
        linkText: "Get Codex →",
        href: "https://chatgpt.com",
        icon: "/images/external-agents/chatgpt.avif"
    },
    {
        name: "Claude Code",
        description:
            "Give Claude access to Jetic's MCP tools to work with your API model and execute supported testing workflows.",
        linkText: "Get Claude Code →",
        href: "https://claude.com/product/claude-code",
        icon: "/images/external-agents/claude.avif"
    },
    {
        name: "Cursor",
        description:
            "Bring Jetic's code-aware API testing context into your Cursor workflow through MCP.",
        linkText: "Get Cursor →",
        href: "https://cursor.com",
        icon: "/images/external-agents/cursor.avif"
    },
    {
        name: "Google Antigravity",
        description:
            "Connect a compatible Antigravity setup to Jetic's available MCP tools and API testing workflows.",
        linkText: "Explore Antigravity →",
        href: "https://antigravity.google",
        icon: "/images/external-agents/antigravity.avif"
    },
];

const steps = [
    {
        title: "1. Set up Jetic CLI",
        body: (
            <>
                Install or initialize Jetic in your <Highlight>Node.js project</Highlight>, then start the MCP
                integration. <span className="mt-3 block text-white/35">You may not need to initialize the
                    project again if it is already configured.</span>
            </>
        ),
        terminal: (
            <>
                <p className="mb-6 text-white/15">
                    Node 22 · your project
                    <br />
                    /Users/paul
                </p>
                <p className="text-white/90">
                    <span className="text-white/60">&gt;</span> npx jetic init
                </p>
                <p className="text-white/90">
                    <span className="text-white/60">&gt;</span> npx jetic mcp
                </p>
            </>
        ),
    },
    {
        title: "2. Connect your AI agent",
        body: (
            <>
                Add Jetic&apos;s MCP server to your supported AI coding environment. Configure the server using
                the command and settings required by that client. <span className="mt-3 block text-white/35">
                    Verify client-specific configuration before relying on a particular setup.</span>
            </>
        ),
        terminal: (
            <>
                <p className="mb-3 text-white/15">● Configure your MCP client</p>
                <p className="mb-6 text-white/15">
                    Add the Jetic MCP server to the agent you use, using the command and settings it requires.
                </p>
                <p className="text-white/90">
                    <span className="text-white/60">&gt;</span> npx jetic mcp
                </p>
            </>
        ),
    },
    {
        title: "3. Run your first API testing workflow",
        body: (
            <>
                Ask your agent to inspect an endpoint, generate a simulation, or investigate a failing API
                request using the Jetic tools available to it. <span className="mt-3 block text-white/35">
                    The agent&apos;s actual actions depend on the tools registered with the MCP server and the
                    permissions you grant.</span>
            </>
        ),
        terminal: (
            <>
                <p className="mb-3 text-white/15">● Connected to your Node.js API project</p>
                <p className="mb-3 text-white/15">What would you like to work on?</p>
                <p className="text-white/90">
                    <span className="text-white/60">&gt;</span> Inspect my API and identify the endpoints that
                    need behavior tests.
                </p>
            </>
        ),
    },
];

const faqs = [
    {
        q: "Do I need to configure an MCP server manually?",
        a: "Jetic exposes its available API testing tools through MCP. You need to configure your AI coding agent to connect to Jetic using the supported CLI command and the configuration required by your client.",
    },
    {
        q: "Which AI coding agents does Jetic support?",
        a: "Jetic is designed to work with AI coding environments that support MCP, including compatible configurations of Claude Code, Cursor, and Codex. Exact setup steps and available capabilities depend on each client's MCP support.",
    },
    {
        q: "What can my AI agent do with Jetic?",
        a: "Your agent can use Jetic's exposed tools to work with supported API testing workflows. Depending on the configured tools, this can include inspecting API context, working with endpoints, creating simulations, and investigating results.",
    },
    {
        q: "Does Jetic understand my codebase?",
        a: "Jetic is designed around code-aware API testing. Its project model provides API context that can help compatible agents work with your Node.js application's endpoints and behavior. The available context depends on your project's configuration and indexing.",
    },
    {
        q: "Can the agent run API simulations for me?",
        a: "Yes, when the relevant simulation tools are exposed and configured. The agent can use natural-language instructions to initiate supported workflows instead of requiring you to navigate every step manually. Execution permissions and environment configuration still apply.",
    },
    {
        q: "Does Jetic use AI tokens every time I run a simulation?",
        a: "Jetic's core value proposition is deterministic API workflows without requiring AI inference for every run. AI usage depends on whether you invoke an AI agent or an AI-powered feature; it is separate from deterministic simulation execution.",
    },
    {
        q: "Is it safe to connect an AI agent to my API?",
        a: "Treat the connection like any other development tool with access to your project. Review the permissions granted to the agent, protect credentials, use appropriate test environments, and verify any state-changing operations before execution. Actual access depends on the MCP tools and permissions configured.",
    },
    {
        q: "What happens if a simulation fails?",
        a: "Use the simulation results and available API context to investigate the failure. A connected agent can help analyze the output and suggest a fix, while you retain control over code changes and verification.",
    },
    {
        q: "Do I need Jetic's web dashboard to use the CLI?",
        a: "The CLI and MCP integration are intended to bring Jetic workflows into your development environment. The dashboard can provide a visual interface for inspecting your API model, simulations, and reports, depending on which features you use.",
    },
];

const capabilities = [
    {
        title: "Endpoints",
        body: "Explore your API model and understand the endpoints available for testing.",
        icon: (
            <>
                <path d="M2.5 4.5h6M2.5 8h6M2.5 11.5h6" />
                <circle cx="12" cy="8" r="2.2" />
            </>
        ),
    },
    {
        title: "Schemas & dependencies",
        body: "Use available schema and dependency context to understand API inputs, relationships, and expected behavior.",
        icon: (
            <>
                <rect x="2.5" y="2.5" width="5" height="4" rx="1.2" />
                <rect x="8.5" y="9.5" width="5" height="4" rx="1.2" />
                <path d="M5 6.5V10a1.5 1.5 0 0 0 1.5 1.5H8.5" />
            </>
        ),
    },
    {
        title: "Simulations",
        body: "Create and run supported API simulations through natural-language instructions and available Jetic tools.",
        icon: (
            <>
                <path d="M3 13V7M6.5 13V3.5M10 13V8.5M13 13V5" />
            </>
        ),
    },
    {
        title: "Behavior validation",
        body: "Validate API responses and expected behavior against the checks supported by your testing workflows.",
        icon: (
            <>
                <path d="M3 8.5 6 11.5 13 4.5" />
            </>
        ),
    },
    {
        title: "Failure investigation",
        body: "Investigate failed requests and simulation results with help from your AI coding agent.",
        icon: (
            <>
                <circle cx="7" cy="7" r="4" />
                <path d="m10 10 3 3" />
            </>
        ),
    },
    {
        title: "CLI & MCP workflows",
        body: "Bring supported Jetic operations directly into compatible AI coding environments.",
        icon: (
            <>
                <rect x="2.5" y="3.5" width="11" height="9" rx="1.8" />
                <path d="m5.2 7 1.6 1.5L5.2 10M8.5 10.5h2.5" />
            </>
        ),
    },
];

/* ------------------------- Small helpers ------------------------- */

function Highlight({ children }: { children: ReactNode }) {
    return <span className="rounded bg-white/10 px-1 text-white">{children}</span>;
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="flex w-[208px] items-center justify-between rounded-lg bg-[#141414] px-3.5 py-2.5 font-mono text-[11px] text-white/90 transition-colors hover:bg-[#1c1c1c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
            <span>{copied ? "Copied" : "Copy MCP command"}</span>
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.3">
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.8" />
                <path d="M10.5 5.5V4a1.8 1.8 0 0 0-1.8-1.8H4A1.8 1.8 0 0 0 2.2 4v4.7A1.8 1.8 0 0 0 4 10.5h1.5" />
            </svg>
        </button>
    );
}

/* ---------------------------- Sections ---------------------------- */

function ConnectSection() {
    return (
        <section className="mx-auto max-w-[992px] px-11 pb-16 pt-14">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                JETIC CLI · MCP INTEGRATION
            </p>
            <h2 className="max-w-[560px] text-[40px] font-medium leading-[1.05] tracking-tight">
                Connect Jetic to Claude Code, Cursor, Codex, and more.
            </h2>

            <div className="mt-4 flex items-end justify-between gap-6">
                <p className="max-w-[470px] text-[13px] leading-[1.45] text-white/55">
                    Bring code-aware API testing into your AI coding workflow. Connect Jetic to your preferred
                    AI agent through MCP, give it context about your Node.js API, and work with endpoints,
                    schemas, and simulations without manually navigating every step.
                </p>
                <a
                    href="/features"
                    className="hidden shrink-0 text-xs font-medium text-white hover:text-white/70 sm:block"
                >
                    Explore Jetic Agent →
                </a>
            </div>

            <div className="mt-11 grid grid-cols-1 overflow-hidden rounded-[28px] border border-white/10 md:grid-cols-2">
                {agents.map((agent, i) => (
                    <div
                        key={agent.name}
                        className={[
                            "p-5 pb-6",
                            i % 2 === 0 ? "md:border-r md:border-white/10" : "",
                            i < 2 ? "border-b border-white/10" : "",
                            i === 2 ? "border-b border-white/10 md:border-b-0" : "",
                        ].join(" ")}
                    >
                        <Image src={agent.icon} alt={agent.name} width={24} height={24} className="mb-6 h-9 w-9 overflow-hidden rounded-[10px]" />
                        <h3 className="text-base font-normal">{agent.name}</h3>
                        <p className="mt-2 max-w-[215px] text-[11px] leading-[1.45] text-white/45">
                            {agent.description}{" "}
                            <a href={agent.href} className="text-white underline underline-offset-2">
                                {agent.linkText}
                            </a>
                        </p>
                        <div className="mt-6">
                            <CopyButton text={INSTALL_PROMPT} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function StepsSection() {
    return (
        <section className="mx-auto max-w-[900px] px-6 py-16">
            <h2 className="max-w-[460px] text-[32px] font-medium leading-[1.12] tracking-tight">
                Connect your AI agent to Jetic in three steps
            </h2>
            <p className="mt-3 max-w-[560px] text-[13px] leading-[1.5] text-white/50">
                Give your AI coding agent access to Jetic&apos;s API testing tools and start working with your
                project in natural language.
            </p>

            <div className="mt-12 grid grid-cols-1 overflow-hidden rounded-[22px] border border-white/10 md:grid-cols-3">
                {steps.map((step, i) => (
                    <div key={step.title} className={i < 2 ? "md:border-r md:border-white/10" : ""}>
                        <div className="h-[170px] overflow-hidden border-b border-white/10 p-5 pt-[75px] font-mono text-[9px] leading-[1.5]">
                            {step.terminal}
                        </div>
                        <div className="p-5 pb-6">
                            <h3 className="text-[13px] font-medium">{step.title}</h3>
                            <p className="mt-2 text-[11px] leading-[1.5] text-white/50">{step.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FaqSection() {
    return (
        <section className="mx-auto grid max-w-[1000px] grid-cols-1 gap-10 px-6 py-20 md:grid-cols-[1fr_1.9fr]">
            <h2 className="text-[34px] font-medium leading-[1.05] tracking-tight">
                Frequently asked questions
            </h2>
            <dl className="space-y-9">
                {faqs.map((item) => (
                    <div key={item.q}>
                        <dt className="text-xs font-medium text-white">{item.q}</dt>
                        <dd className="mt-1.5 text-xs leading-[1.5] text-white/50">{item.a}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}

function CapabilitiesSection() {
    return (
        <section className="mx-auto max-w-[900px] px-6 py-20">
            <h2 className="max-w-[360px] text-[32px] font-medium leading-[1.12] tracking-tight">
                What AI agents can do with Jetic
            </h2>
            <p className="mt-3 max-w-[560px] text-[13px] leading-[1.5] text-white/50">
                Give your AI coding agent the context and tools to work with your API testing workflow, from
                understanding endpoints to investigating simulation results.
            </p>

            <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 md:grid-cols-3">
                {capabilities.map((cap, i) => (
                    <div
                        key={cap.title}
                        className={[
                            "p-4 pb-5",
                            i % 3 !== 2 ? "md:border-r md:border-white/10" : "",
                            i < 3 ? "md:border-b md:border-white/10" : "",
                            "border-b border-white/10 md:[&]:border-b-0",
                            i < 3 ? "md:!border-b" : "",
                        ].join(" ")}
                    >
                        <svg
                            viewBox="0 0 16 16"
                            className="mb-4 h-4 w-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {cap.icon}
                        </svg>
                        <h3 className="text-xs font-medium">{cap.title}</h3>
                        <p className="mt-1 max-w-[210px] text-[11px] leading-[1.45] text-white/50">{cap.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
