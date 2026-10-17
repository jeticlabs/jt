import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  shared bits                                                        */
/* ------------------------------------------------------------------ */

function Arrow() {
    return (
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 6h8M6.5 2.5 10 6 6.5 9.5" />
        </svg>
    );
}

function Info() {
    return (
        <span className="ml-[2px] inline-flex h-[7px] w-[7px] items-center justify-center rounded-full bg-white/35 text-[5px] font-bold leading-none text-black">
            i
        </span>
    );
}

function Card({
    label,
    id,
    className = "",
    children,
}: {
    label: string;
    id?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div id={id} className={`group relative overflow-hidden bg-black ${className}`}>
            {children}
            {/* bottom fade so panels dissolve behind the label */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-14 bg-gradient-to-t from-black via-black/70 to-transparent" />
            <a
                href="#"
                className="absolute bottom-[12px] left-[12px] z-10 flex items-center gap-[6px] text-[11.5px] font-medium text-white"
            >
                {label}
                <span className="transition-transform group-hover:translate-x-[2px]">
                    <Arrow />
                </span>
            </a>
        </div>
    );
}

function Plus() {
    return <span className="text-[10px] leading-none text-white/80">+</span>;
}

function ListRow({
    name,
    value,
    active,
    faded,
    indent = 0,
    swatch,
}: {
    name: string;
    value?: string;
    active?: boolean;
    faded?: boolean;
    indent?: number;
    swatch?: string;
}) {
    return (
        <div
            className={`flex h-[16px] items-center gap-[5px] rounded-[4px] pr-[5px] text-[7.5px] ${active ? "bg-white/[0.1] text-white" : "text-white/70"
                } ${faded ? "opacity-40" : ""}`}
            style={{ paddingLeft: 4 + indent * 11 }}
        >
            <span
                className="h-[8px] w-[8px] shrink-0 rounded-[2px]"
                style={{ background: swatch ?? "rgba(255,255,255,0.28)" }}
            />
            <span className="flex-1 truncate">{name}</span>
            {value && <span className="text-white/45">{value}</span>}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  1. run health                                                      */
/* ------------------------------------------------------------------ */

function RunHealth() {
    const rows = [
        { k: "checkout-flow", v: "1.1s", w: "72%" },
        { k: "auth-refresh", v: "640ms", w: "42%" },
        { k: "refund-chain", v: "2.4s", w: "95%" },
    ];
    return (
        <div className="absolute left-6 top-[56px] w-[152px] text-[8.5px]">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Run history</span>
                <span className="rounded-[3px] border border-[#22c55e]/50 bg-[#22c55e]/15 px-[4px] py-[1px] text-[6.5px] font-semibold text-[#4ade80]">
                    PASSING
                </span>
            </div>
            <div className="mt-[14px] space-y-[11px]">
                {rows.map((r) => (
                    <div key={r.k}>
                        <div className="flex items-center justify-between">
                            <span className="text-white/90">
                                {r.k}
                                <Info />
                            </span>
                            <span className="font-medium text-[#0099ff]">{r.v}</span>
                        </div>
                        <div className="mt-[5px] h-[4px] w-full rounded-full bg-white/[0.12]">
                            <div className="h-full rounded-full bg-[#0099ff]" style={{ width: r.w }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  2. repositories                                                    */
/* ------------------------------------------------------------------ */

const REPO_TREE = [
    { n: "acme-api", d: 0 },
    { n: "main", d: 1, c: "128" },
    { n: "staging", d: 1, c: "64", active: true },
    { n: "billing-svc", d: 0 },
    { n: "search-api", d: 0 },
    { n: "feature/retries", d: 1, c: "12" },
    { n: "webhooks", d: 0 },
    { n: "docs", d: 0 },
];

const REPO_ROWS = [
    { t: "checkout-flow · 200 OK", c: "pass", pass: true },
    { t: "auth-refresh · 401 case", c: "pass", pass: true },
    { t: "refund-chain · timeout", c: "fail", pass: false },
    { t: "webhook-relay · retries", c: "pass", pass: true },
    { t: "search-query · latency", c: "pass", pass: true },
];

function Repositories() {
    return (
        <div className="absolute left-[27px] top-[24px] grid h-[270px] w-[430px] grid-cols-[128px_1fr] overflow-hidden rounded-t-[10px] border border-white/10 bg-[#101010]">
            {/* sidebar */}
            <div className="border-r border-white/10">
                <div className="flex h-[24px] items-center gap-[10px] border-b border-white/10 px-[8px] text-[7.5px]">
                    <span className="rounded-[4px] bg-white/[0.12] px-[6px] py-[3px] font-medium text-white">Repositories</span>
                    <span className="text-white/45">Branches</span>
                </div>
                <div className="space-y-[1px] px-[6px] pt-[6px]">
                    {REPO_TREE.map((r) => (
                        <div
                            key={r.n}
                            className={`flex h-[15px] items-center gap-[5px] rounded-[4px] pr-[6px] text-[7.5px] ${r.active ? "bg-white/[0.1] text-white" : "text-white/60"
                                }`}
                            style={{ paddingLeft: 4 + r.d * 12 }}
                        >
                            <span className="h-[7px] w-[7px] shrink-0 rounded-[2px] border border-white/40" />
                            <span className="flex-1">{r.n}</span>
                            {r.c && <span className="text-white/45">{r.c}</span>}
                        </div>
                    ))}
                    <div className="flex h-[15px] items-center gap-[5px] pl-[4px] text-[7.5px] text-white/35">
                        <span>+</span> Add…
                    </div>
                </div>
            </div>

            {/* table */}
            <div className="min-w-0">
                <div className="flex h-[24px] items-center gap-[10px] border-b border-white/10 px-[10px] text-white/70">
                    <Plus />
                    <span className="text-[8px] leading-none">⇅</span>
                    <span className="text-[8px] leading-none">≡</span>
                    <span className="text-[8px] leading-none">⌕</span>
                </div>
                <div className="grid h-[22px] grid-cols-[41px_103px_52px_1fr] items-center border-b border-white/10 text-[7px] text-white/45">
                    <span className="pl-[16px]">
                        <span className="block h-[7px] w-[7px] rounded-[2px] border border-white/35" />
                    </span>
                    <span>Simulation</span>
                    <span>Runs</span>
                    <span>Status</span>
                </div>
                {REPO_ROWS.map((r, i) => (
                    <div
                        key={i}
                        className="grid h-[26px] grid-cols-[41px_103px_52px_1fr] items-center border-b border-white/[0.07] text-[7px] text-white/80"
                    >
                        <span className="pl-[16px]">
                            <span className="block h-[7px] w-[7px] rounded-[2px] border border-white/35" />
                        </span>
                        <span className="truncate pr-[8px] font-medium">{r.t}</span>
                        <span>
                            <span className={`block h-[17px] w-[34px] rounded-[3px] ${r.pass ? "bg-[#22c55e]/30" : "bg-[#ef4444]/30"}`} />
                        </span>
                        <span>
                            <span className={`rounded-[4px] px-[6px] py-[2px] text-white/70 ${r.pass ? "bg-[#22c55e]/15" : "bg-[#ef4444]/15"}`}>{r.c}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  3. environments                                                    */
/* ------------------------------------------------------------------ */

function Environments() {
    return (
        <div className="absolute left-[25px] top-[26px] h-[230px] w-[230px] rounded-t-[12px] border border-white/10 bg-[#111] p-[14px]">
            <div className="text-[10px] font-semibold text-white">Environment</div>

            <div className="mt-[14px] flex gap-[10px] text-[7px]">
                <div className="w-[98px] shrink-0">
                    <div className="text-white/55">Base URL</div>
                    <div className="mt-[4px] truncate rounded-[4px] bg-white/[0.08] px-[6px] py-[4px] text-[7px] font-medium text-white">
                        https://api.acme.com…
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="text-white/55">Scope</div>
                    <div className="mt-[4px] truncate rounded-[4px] bg-white/[0.08] px-[6px] py-[4px] text-white">/staging</div>
                </div>
            </div>

            <div className="mt-[12px] text-[7px] text-white/55">Notes</div>
            <div className="mt-[4px] rounded-[4px] bg-white/[0.08] px-[6px] py-[5px] text-[7px] leading-[9.5px] text-white">
                Staging mirrors production. Secrets stay server-side and never
                ship inside runs.
            </div>

            <div className="mt-[16px] text-[7px] text-white/40">Secret refs</div>
            <div className="mt-[4px] flex gap-[4px]">
                <span className="rounded-[4px] bg-white/[0.08] px-[6px] py-[3px] font-mono text-[7px] text-white/70">
                    JETIC_API_KEY ••••••
                </span>
                <span className="rounded-[4px] bg-white/[0.08] px-[6px] py-[3px] font-mono text-[7px] text-white/70">
                    STRIPE_SK ••••••
                </span>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  4 + 5. approvals / workspaces                                      */
/* ------------------------------------------------------------------ */

function Approvals() {
    return (
        <div className="absolute left-[40px] top-[22px] w-[122px]">
            <div className="flex items-center justify-between text-[7.5px] font-semibold text-white">
                <span>Approvals</span>
                <Plus />
            </div>
            <div className="mt-[8px] space-y-[1px]">
                <ListRow name="replay failed run" value="2m" active swatch="#60a5fa" />
                <ListRow name="run checkout-flow" value="5m" swatch="#9ca3af" />
                <ListRow name="delete staging sim" value="1h" indent={1} swatch="#a78bfa" />
                <ListRow name="rotate secret ref" value="3h" indent={1} faded swatch="#f472b6" />
            </div>
        </div>
    );
}

function Workspaces() {
    return (
        <div className="absolute left-[40px] top-[22px] w-[122px]">
            <div className="flex items-center justify-between text-[7.5px] font-semibold text-white">
                <span>Workspaces</span>
                <Plus />
            </div>
            <div className="mt-[8px] space-y-[1px]">
                <ListRow name="acme-prod" value="128" active />
                <ListRow name="staging" value="64%" />
                <ListRow name="personal" value="12" faded />
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  6. replay                                                          */
/* ------------------------------------------------------------------ */

function Replay() {
    return (
        <>
            {/* silky wave */}
            <div className="absolute -left-[30px] top-[66px] h-[70px] w-[290px] -rotate-[10deg] rounded-[100%] bg-gradient-to-r from-transparent via-white/25 to-white/5 blur-[8px]" />
            <div className="absolute -left-[10px] top-[84px] h-[60px] w-[260px] -rotate-[10deg] rounded-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-[10px]" />
            <div className="absolute left-[62px] top-[18px]">
                <div className="text-[27px] font-bold leading-[1] tracking-[-0.04em] text-white">100%</div>
                <div className="bg-gradient-to-b from-white/60 to-transparent bg-clip-text text-[27px] font-bold leading-[1] tracking-[-0.04em] text-transparent">
                    replayable
                </div>
            </div>
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  7. security                                                        */
/* ------------------------------------------------------------------ */

function Security() {
    return (
        <div className="absolute left-[13px] top-[40px] flex h-[30px] w-[240px] items-center rounded-full border border-white/15 bg-black pl-[12px]">
            <div className="flex items-center gap-[10px] text-white/55">
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 6H2M5.5 2.5 2 6l3.5 3.5" />
                </svg>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6h8M6.5 2.5 10 6 6.5 9.5" />
                </svg>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 6a4 4 0 1 1-1.2-2.8M10 2v2.5H7.5" />
                </svg>
            </div>
            <div className="ml-[14px] flex h-[22px] flex-1 items-center gap-[7px] rounded-full bg-white/[0.1] pl-[4px]">
                <span className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#0a66ff]">
                    <svg width="7" height="8" viewBox="0 0 10 12" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round">
                        <rect x="1.5" y="5" width="7" height="6" rx="1.2" />
                        <path d="M3 5V3.5a2 2 0 0 1 4 0V5" />
                    </svg>
                </span>
                <span className="whitespace-nowrap text-[8.5px] text-white/85">https://app.jetic.dev</span>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  8. run analytics                                                   */
/* ------------------------------------------------------------------ */

function RunAnalytics() {
    const stats = [
        { k: "Simulations", v: "128" },
        { k: "Runs today", v: "1.7k", dot: true },
        { k: "Pass rate", v: "98.2%" },
        { k: "Avg run", v: "1.1s" },
    ];
    return (
        <>
            <div className="absolute left-[25px] top-[26px] h-[230px] w-[400px] rounded-t-[12px] border border-white/10 bg-gradient-to-b from-[#0d0d0d] to-black">
                <div className="px-[14px] pt-[14px] text-[13px] font-semibold text-white">Run analytics</div>

                <div className="mt-[18px] grid grid-cols-4 px-[14px]">
                    {stats.map((s) => (
                        <div key={s.k}>
                            <div className="flex items-center gap-[3px] text-[7px] text-white/50">
                                {s.k}
                                {s.dot && <span className="h-[5px] w-[5px] rounded-full bg-[#0099ff]" />}
                            </div>
                            <div className="mt-[3px] text-[11px] font-semibold text-white">{s.v}</div>
                        </div>
                    ))}
                </div>

                <div className="mx-[14px] mt-[14px] border-t border-white/10" />
                <div className="px-[14px] pt-[6px] text-[7px] text-white/40">2.4k</div>

                {/* chart */}
                <svg className="absolute left-[14px] top-[118px]" width="370" height="90" viewBox="0 0 370 90" preserveAspectRatio="none" fill="none">
                    <defs>
                        <linearGradient id="pv" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0" stopColor="#7c6cf0" stopOpacity="0.35" />
                            <stop offset="1" stopColor="#7c6cf0" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0 62 L25 52 L50 58 L75 36 L100 48 L125 30 L150 52 L175 38 L200 46 L225 22 L250 42 L275 33 L300 50 L325 36 L350 44 L370 40 V90 H0 Z"
                        fill="url(#pv)"
                    />
                    <path
                        d="M0 62 L25 52 L50 58 L75 36 L100 48 L125 30 L150 52 L175 38 L200 46 L225 22 L250 42 L275 33 L300 50 L325 36 L350 44 L370 40"
                        stroke="#7c6cf0"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M0 78 L25 70 L50 74 L75 58 L100 66 L125 52 L150 70 L175 60 L200 66 L225 46 L250 62 L275 55 L300 68 L325 58 L350 64 L370 60"
                        stroke="#3b82f6"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                    />
                </svg>

                {/* tooltip */}
                <div className="absolute left-[216px] top-[101px] w-[96px] rounded-[6px] border border-white/10 bg-[#161616] p-[6px] text-[7px] shadow-lg">
                    <div className="text-white/55">Oct 16, 2026</div>
                    <div className="mt-[4px] flex items-center justify-between">
                        <span className="flex items-center gap-[4px] text-white/80">
                            <span className="h-[5px] w-[5px] rounded-full bg-[#7c6cf0]" />
                            Runs
                        </span>
                        <span className="text-white">1,240</span>
                    </div>
                    <div className="mt-[3px] flex items-center justify-between">
                        <span className="flex items-center gap-[4px] text-white/80">
                            <span className="h-[5px] w-[5px] rounded-full bg-[#3b82f6]" />
                            Failures
                        </span>
                        <span className="text-white">31</span>
                    </div>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/80 to-transparent" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  9. assertions                                                      */
/* ------------------------------------------------------------------ */

function Assertions() {
    return (
        <>
            <div className="absolute left-[26px] top-[26px] w-[260px]">
                <div className="text-[8px] text-white/60">Pass rate</div>
                <div className="mt-[3px] text-[15px] font-semibold leading-none text-white">98.2%</div>

                <div className="mt-[12px] h-[51px] w-full rounded-[3px] bg-gradient-to-r from-[#0099ff] via-[#0066cc] to-black" />

                <div className="mt-[10px] grid grid-cols-[95px_49px_1fr] border-b border-t border-white/10 py-[5px] text-[7px] text-white/45">
                    <span>Check</span>
                    <span>Runs</span>
                    <span>Failed</span>
                </div>
                <div className="grid grid-cols-[95px_49px_1fr] items-center border-b border-white/[0.07] py-[6px] text-[7.5px] text-white/85">
                    <span className="flex items-center gap-[4px] whitespace-nowrap">
                        <span className="h-[5px] w-[5px] rounded-full bg-[#a78bfa]" />
                        status is 200
                        <span className="rounded-[3px] bg-[#22c55e]/25 px-[3px] py-[1px] text-[5.5px] font-semibold text-[#4ade80]">
                            HEALTHY
                        </span>
                    </span>
                    <span>1,240</span>
                    <span className="text-white/45">12</span>
                </div>
                <div className="grid grid-cols-[95px_49px_1fr] items-center py-[6px] text-[7.5px] text-white/85">
                    <span className="flex items-center gap-[4px] whitespace-nowrap">
                        <span className="h-[5px] w-[5px] rounded-full bg-[#3b82f6]" />
                        latency &lt; 500ms
                    </span>
                    <span>1,180</span>
                    <span className="text-white/45">31</span>
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/70 to-transparent" />
        </>
    );
}

/* ------------------------------------------------------------------ */
/*  section                                                            */
/* ------------------------------------------------------------------ */

export default function PlatformSection() {
    return (
        <section id="platform-section" className="w-full bg-black px-[21px] py-[20px] font-['Inter',system-ui,sans-serif] text-white antialiased">


            <div className="mx-auto ">
                <h2 className="text-[22px] font-semibold leading-[1.15] tracking-[-0.03em]">
                    Not just prompts,
                    <br />a full workspace
                </h2>

                <div className="mt-[20px] grid grid-cols-1 auto-rows-[220px] gap-px overflow-hidden rounded-[16px] border border-white/[0.12] bg-white/[0.12] md:auto-rows-[120px] md:grid-cols-3">
                    <Card label="Run health" id="platform-runs" className="md:col-start-1 md:row-span-2 md:row-start-1">
                        <RunHealth />
                    </Card>

                    <Card label="Repositories" id="platform-repos" className="md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-1">
                        <Repositories />
                    </Card>

                    <Card label="Environments" className="md:col-start-1 md:row-span-2 md:row-start-3">
                        <Environments />
                    </Card>

                    <Card label="Approvals" className="md:col-start-2 md:row-start-3">
                        <Approvals />
                    </Card>

                    <Card label="Replay" className="md:col-start-3 md:row-start-3">
                        <Replay />
                    </Card>

                    <Card label="Workspaces" className="md:col-start-2 md:row-start-4">
                        <Workspaces />
                    </Card>

                    <Card label="Security" className="md:col-start-3 md:row-start-4">
                        <Security />
                    </Card>

                    <Card label="Run analytics" id="platform-analytics" className="md:col-span-2 md:col-start-1 md:row-span-2 md:row-start-5">
                        <RunAnalytics />
                    </Card>

                    <Card label="Assertions" id="platform-assertions" className="md:col-start-3 md:row-span-2 md:row-start-5">
                        <Assertions />
                    </Card>
                </div>
            </div>
        </section>
    );
}
