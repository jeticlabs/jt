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
                href="/docs/guides/jetic-studio"
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
/*  cards (DOM order matters: cursors-layer tours them by index)       */
/*  numbers below are illustrative sample data                         */
/* ------------------------------------------------------------------ */

const MONO = "font-['JetBrains_Mono',ui-monospace,monospace]";

function Model() {
    const rows = [["GET", "12", "100%", "#0099ff"], ["POST", "7", "58%", "#22c55e"], ["PUT", "3", "25%", "#f59e0b"], ["DELETE", "2", "17%", "#ef4444"]];
    return (
        <div className="absolute left-6 top-[56px] w-[152px] text-[8.5px]">
            <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Behavioral model</span>
                <span className="rounded-[3px] border border-[#22c55e]/50 bg-[#22c55e]/15 px-[4px] py-[1px] text-[6.5px] font-semibold text-[#4ade80]">24 ENDPOINTS</span>
            </div>
            <div className="mt-[14px] space-y-[11px]">
                {rows.map(([m, n, w, c]) => (
                    <div key={m}>
                        <div className="flex justify-between text-white/90"><span>{m}</span><span style={{ color: c }}>{n}</span></div>
                        <div className="mt-[5px] h-[4px] w-full rounded-full bg-white/[0.12]"><div className="h-full rounded-full" style={{ width: w, background: c }} /></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const TRACE = [["POST", "/auth/login", "200"], ["POST", "/orders", "201"], ["GET", "/orders/:id", "200"], ["POST", "/refunds", "409"]];

function Traces() {
    return (
        <div className="absolute left-[27px] top-[24px] grid h-[270px] w-[430px] grid-cols-[150px_1fr] overflow-hidden rounded-t-[10px] border border-white/10 bg-[#101010]">
            <style>{`@keyframes jt-node{0%,20%{background:rgba(0,153,255,.2);border-color:#0099ff}25%,100%{background:transparent;border-color:rgba(255,255,255,.12)}}`}</style>
            <div className="border-r border-white/10 p-[10px]">
                <div className="text-[8px] font-semibold text-white">Trace · checkout</div>
                <div className="mt-[10px] space-y-[8px]">
                    {TRACE.map(([m, p, s], i) => (
                        <div key={p} className="flex items-center gap-[5px] rounded-[5px] border px-[6px] py-[5px] text-[7.5px] text-white/80" style={{ animation: "jt-node 8s steps(1) infinite", animationDelay: `${i * 2}s`, borderColor: "rgba(255,255,255,.12)" }}>
                            <span className="text-white/45">{m}</span>
                            <span className="flex-1 truncate">{p}</span>
                            <span style={{ color: s === "409" ? "#f87171" : "#4ade80" }}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`p-[12px] ${MONO} text-[7.5px] leading-[12px] text-white/60`}>
                <div className="text-white/40">response · 201 · 143ms</div>
                <div className="mt-[8px]">{"{"}</div>
                <div className="pl-[8px]">&quot;id&quot;: <span className="text-[#38b6ff]">&quot;ord_7Q2x&quot;</span>,</div>
                <div className="pl-[8px]">&quot;status&quot;: <span className="text-[#4ade80]">&quot;created&quot;</span>,</div>
                <div className="pl-[8px]">&quot;total&quot;: 4200</div>
                <div>{"}"}</div>
            </div>
        </div>
    );
}

function Memory() {
    const rows = [["workflow:accessToken", "eyJhbGciOi…"], ["workflow:userEmail", "user_8f9a@…"], ["workflow:orderId", "ord_7Q2x"]];
    return (
        <div className="absolute left-[25px] top-[26px] w-[200px] rounded-t-[12px] border border-white/10 bg-[#111] p-[14px]">
            <div className="text-[10px] font-semibold text-white">Memory</div>
            <div className="mt-[12px] space-y-[6px]">
                {rows.map(([k, v]) => (
                    <div key={k} className="rounded-[4px] bg-white/[0.08] px-[6px] py-[4px]">
                        <div className={`${MONO} text-[7px] text-white/80`}>{k}</div>
                        <div className={`${MONO} text-[7px] text-white/45`}>{v}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Inspect() {
    return (
        <div className="absolute left-[40px] top-[22px] w-[150px]">
            <div className={`${MONO} text-[8px] font-semibold text-white`}>GET /api/orders/:id</div>
            <div className="mt-[8px] space-y-[1px]">
                <ListRow name="src/routes/orders.ts" value="L42" active swatch="#60a5fa" />
                <ListRow name="param: id" value="path" swatch="#a78bfa" />
                <ListRow name="requireAuth" value="mw" swatch="#f472b6" />
            </div>
        </div>
    );
}

function Keyless() {
    return (
        <div className="absolute left-[62px] top-[18px]">
            <div className="text-[27px] font-bold leading-[1] tracking-[-0.04em] text-white">0 keys</div>
            <div className="bg-gradient-to-b from-white/60 to-transparent bg-clip-text text-[27px] font-bold leading-[1] tracking-[-0.04em] text-transparent">required</div>
        </div>
    );
}

function Changes() {
    const rows = [["+", "POST /api/refunds", "#4ade80"], ["−", "GET /api/legacy", "#f87171"], ["~", "orders.ts changed", "#fbbf24"]];
    return (
        <div className="absolute left-[40px] top-[22px] w-[150px]">
            <div className="flex items-center justify-between text-[7.5px] font-semibold text-white"><span>Changes</span><Plus /></div>
            <div className="mt-[8px] space-y-[1px]">
                {rows.map(([s, t, c]) => (
                    <div key={t} className={`flex h-[16px] items-center gap-[6px] px-[4px] ${MONO} text-[7.5px] text-white/70`}>
                        <span style={{ color: c }}>{s}</span>{t}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Mcp() {
    return (
        <div className="absolute left-[13px] top-[40px] flex h-[30px] w-[240px] items-center rounded-full border border-white/15 bg-black pl-[12px]">
            <span className={`${MONO} text-[8.5px] text-white/55`}>$</span>
            <div className="ml-[10px] flex h-[22px] flex-1 items-center rounded-full bg-white/[0.1] pl-[10px]">
                <span className={`${MONO} whitespace-nowrap text-[8.5px] text-white/85`}>jetic mcp --project ./api</span>
            </div>
        </div>
    );
}

function Report() {
    const stats = [["Endpoints", "24"], ["Workflows", "3"], ["Steps passed", "18/19"], ["Avg step", "142ms"]];
    const bars = [40, 62, 35, 80, 52, 90, 44, 70, 38, 66, 48, 58];
    return (
        <>
            <style>{`@keyframes jt-bar{0%,100%{transform:scaleY(.55)}50%{transform:scaleY(1)}}`}</style>
            <div className="absolute left-[25px] top-[26px] h-[230px] w-[400px] rounded-t-[12px] border border-white/10 bg-gradient-to-b from-[#0d0d0d] to-black">
                <div className="px-[14px] pt-[14px] text-[13px] font-semibold text-white">Simulation report</div>
                <div className="mt-[18px] grid grid-cols-4 px-[14px]">
                    {stats.map(([k, v]) => (
                        <div key={k}><div className="text-[7px] text-white/50">{k}</div><div className="mt-[3px] text-[11px] font-semibold text-white">{v}</div></div>
                    ))}
                </div>
                <div className="mx-[14px] mt-[14px] border-t border-white/10" />
                <div className="mx-[14px] mt-[10px] flex h-[80px] items-end gap-[6px]">
                    {bars.map((h, i) => (
                        <div key={i} className="flex-1 origin-bottom rounded-t-[2px] bg-[#7c6cf0]/70" style={{ height: `${h}%`, animation: `jt-bar ${2.4 + (i % 4) * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            </div>
            <div className="absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/80 to-transparent" />
        </>
    );
}

function Assertions() {
    const rows = [["expectStatus", "201", "pass"], ["condition", "role = admin", "skip"], ["retry", "3 × 1000ms", "ok"], ["onFailure", "continue", "ok"]];
    return (
        <>
            <div className="absolute left-[26px] top-[26px] w-[260px]">
                <div className="text-[8px] text-white/60">Step rules</div>
                <div className="mt-[3px] text-[15px] font-semibold leading-none text-white">5 per step</div>
                <div className="mt-[12px] grid grid-cols-[80px_1fr] border-t border-white/10">
                    {rows.map(([k, v, s]) => (
                        <div key={k} className="col-span-2 grid grid-cols-[80px_1fr_auto] items-center border-b border-white/[0.07] py-[6px] text-[7.5px] text-white/85">
                            <span className={MONO}>{k}</span><span className="text-white/55">{v}</span>
                            <span className={s === "pass" ? "text-[#4ade80]" : "text-white/40"}>{s}</span>
                        </div>
                    ))}
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
                    Not just commands,
                    <br />a full workspace
                </h2>

                <div className="mt-[20px] grid grid-cols-1 auto-rows-[220px] gap-px overflow-hidden rounded-[16px] border border-white/[0.12] bg-white/[0.12] md:auto-rows-[120px] md:grid-cols-3">
                    <Card label="Model" className="md:col-start-1 md:row-span-2 md:row-start-1"><Model /></Card>
                    <Card label="Traces" className="md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-1"><Traces /></Card>
                    <Card label="Memory" className="md:col-start-1 md:row-span-2 md:row-start-3"><Memory /></Card>
                    <Card label="Inspect" className="md:col-start-2 md:row-start-3"><Inspect /></Card>
                    <Card label="Keyless scan" className="md:col-start-3 md:row-start-3"><Keyless /></Card>
                    <Card label="Changes" className="md:col-start-2 md:row-start-4"><Changes /></Card>
                    <Card label="AI IDE (MCP)" className="md:col-start-3 md:row-start-4"><Mcp /></Card>
                    <Card label="Reports" className="md:col-span-2 md:col-start-1 md:row-span-2 md:row-start-5"><Report /></Card>
                    <Card label="Assertions" className="md:col-start-3 md:row-span-2 md:row-start-5"><Assertions /></Card>
                </div>
            </div>
        </section>
    );
}
