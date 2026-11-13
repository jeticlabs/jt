"use client";

import { useEffect, useRef, useState } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

const sans = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"] });

/* ---------- data ---------- */

type MarkKind = "blue" | "gray" | "red" | "range";
type Mark = { k: MarkKind; left: number; width: number };
type Row = { label: string; dur: string; marks: Mark[]; muted?: boolean };

const ROWS: Row[] = [
  { label: "Planned: find the order, check the policy, draft a reply", dur: "778ms", marks: [{ k: "blue", left: 0, width: 10 }] },
  { label: "Found order #4821, Jonas Weber, annual plan", dur: "451ms", marks: [{ k: "gray", left: 11.5, width: 5 }] },
  {
    label: "The invoice service timed out, so it tried again",
    dur: "742ms",
    marks: [{ k: "red", left: 12, width: 3 }, { k: "gray", left: 17, width: 4 }],
  },
  { label: "Checked the refund policy: annual plans prorate, §4", dur: "864ms", marks: [{ k: "range", left: 21.5, width: 11.5 }] },
  { label: "Drafted a reply offering $1,067, prorated", dur: "1.06s", marks: [{ k: "blue", left: 22.5, width: 12.5 }] },
];

const STEPS = [
  { name: "plan", kind: "Model", note: "Outlined three steps", dur: "778ms" },
  { name: "orders.lookup", kind: "Tool", note: "Order #4821, annual plan", dur: "451ms" },
  { name: "invoices.get", kind: "Tool", note: "Timed out once, retried", dur: "742ms", warn: true },
  { name: "policy.read", kind: "Tool", note: "Annual plans prorate, §4", dur: "864ms" },
  { name: "reply.draft", kind: "Model", note: "Offered $1,067, prorated", dur: "1.06s" },
];

const BASE = { wait: 2860, think: 1830, tools: 491, retry: 287 };
const REFUND_CALL_MS = 612;

const fmt = (ms: number) =>
  ms < 1000
    ? `${Math.round(ms)}ms`
    : ms < 60000
      ? `${(ms / 1000).toFixed(2)}s`
      : `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;

type Phase = "waiting" | "sending" | "approved" | "denied";

/* ---------- styles (keyframes + textures) ---------- */

const CSS = `
@keyframes rc-stripes { to { background-position: 6px 0; } }
@keyframes rc-grow-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes rc-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes rc-pop { from { opacity: 0; transform: translateY(6px) scale(.97); } to { opacity: 1; transform: none; } }
@keyframes rc-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes rc-draw { to { stroke-dashoffset: 0; } }
.rc-rise { animation: rc-rise .45s cubic-bezier(.2,.7,.2,1) both; }
.rc-pop  { animation: rc-pop .4s cubic-bezier(.2,.8,.2,1) both; }
.rc-fade { animation: rc-fade .25s ease both; }
.rc-grow { transform-origin: left center; animation: rc-grow-x .6s cubic-bezier(.2,.7,.2,1) both; }
.rc-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: rc-draw .4s .1s ease-out forwards; }
.rc-hatch {
  background-color: #fbf4e0;
  background-image: linear-gradient(135deg, #b07d0a 0, #b07d0a 14%, transparent 14%, transparent 86%, #b07d0a 86%, #b07d0a 100%);
  background-size: 6px 6px;
}
.rc-hatch.rc-live { animation: rc-stripes .8s linear infinite; }
.rc-dots {
  background-color: var(--c);
  background-image:
    radial-gradient(rgba(255,255,255,.8) .7px, transparent 1px),
    radial-gradient(rgba(255,255,255,.5) .6px, transparent .9px),
    radial-gradient(rgba(0,0,0,.2) .6px, transparent .9px);
  background-size: 3px 3px, 5px 5px, 7px 7px;
  background-position: 0 0, 1px 2px, 3px 1px;
}
@media (prefers-reduced-motion: reduce) {
  .rc-rise, .rc-pop, .rc-fade, .rc-grow, .rc-hatch.rc-live { animation: none !important; }
  .rc-draw { animation: none !important; stroke-dashoffset: 0; }
}
`;

/* ---------- small pieces ---------- */

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function MarkEl({ m, delay }: { m: Mark; delay: number }) {
  const color = { blue: "#5584f5", gray: "#6a6b72", red: "#ec6670", range: "#8b8d93" }[m.k];
  return (
    <span className="absolute inset-y-0 flex items-center" style={{ left: `${m.left}%`, width: `${m.width}%` }}>
      <span className="rc-grow block h-[10px] w-full" style={{ animationDelay: `${delay}ms` }}>
        {m.k === "range" ? (
          <span className="relative block h-full w-full">
            <span className="absolute left-0 top-0 h-full w-px" style={{ background: color }} />
            <span className="absolute right-0 top-0 h-full w-px" style={{ background: color }} />
            <span className="absolute left-0 right-0 top-1/2 h-px" style={{ background: color }} />
          </span>
        ) : (
          <span className="block h-full w-full rounded-full" style={{ background: color }} />
        )}
      </span>
    </span>
  );
}

function StoryRow({ row, i, base = 350 }: { row: Row; i: number; base?: number }) {
  const delay = base + i * 90;
  return (
    <li
      className="rc-rise grid h-[41px] grid-cols-[10px_minmax(0,1fr)_150px_57px] items-center gap-x-[13px]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`h-2 w-2 rounded-full ${row.muted ? "bg-[#b4b8c1]" : "bg-[#1f9078]"}`} />
      <span className="truncate text-[15px] text-[#1b1b1f]">{row.label}</span>
      <span className="relative h-full">
        <span className="absolute left-0 right-0 top-1/2 h-px bg-[#e7e9ef]" />
        <span className="absolute left-[73.3%] top-1/2 h-5 w-px -translate-y-1/2 bg-[#b9c3ef]" />
        {row.marks.map((m, j) => (
          <MarkEl key={j} m={m} delay={delay + 120 + j * 80} />
        ))}
      </span>
      <span className="text-right text-[13.5px] tabular-nums text-[#7d808a]">{row.dur}</span>
    </li>
  );
}

/* ---------- main component ---------- */

export default function RunReviewCard() {
  const [view, setView] = useState<"story" | "steps">("story");
  const [phase, setPhase] = useState<Phase>("waiting");
  const [wait, setWait] = useState(BASE.wait);
  const waitRef = useRef(BASE.wait);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const live = phase === "waiting" || phase === "sending";

  // live "paused" counter
  useEffect(() => {
    if (!live) return;
    const start = performance.now();
    const from = waitRef.current;
    const id = setInterval(() => {
      waitRef.current = from + (performance.now() - start);
      setWait(waitRef.current);
    }, 40);
    return () => clearInterval(id);
  }, [live]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const approve = () => {
    if (phase !== "waiting") return;
    setPhase("sending");
    timer.current = setTimeout(() => setPhase("approved"), 1400);
  };

  const tools = BASE.tools + (phase === "approved" ? REFUND_CALL_MS : 0);
  const sum = wait + BASE.think + tools + BASE.retry;
  const cap = Math.max(5720, sum + 250);

  const segs = [
    { key: "wait", label: "Waiting on you", ms: wait, color: "#a9770f" },
    { key: "think", label: "Thinking", ms: BASE.think, color: "#3f6cf0" },
    { key: "tools", label: "Tools", ms: tools, color: "#56565c" },
    { key: "retry", label: "Retries", ms: BASE.retry, color: "#ef4b4b" },
  ];

  const rows: Row[] = [...ROWS];
  if (phase === "approved")
    rows.push({ label: "Sent the refund to Visa •• 4021", dur: fmt(REFUND_CALL_MS), marks: [{ k: "gray", left: 37, width: 4.5 }] });
  if (phase === "denied")
    rows.push({ label: "Refund denied, nothing was sent", dur: "–", marks: [], muted: true });

  const heading =
    phase === "approved"
      ? ["Approved,", `refund sent after ${fmt(wait)} paused.`]
      : phase === "denied"
        ? ["Denied,", `nothing refunded after ${fmt(wait)}.`]
        : ["Waiting on you,", `paused ${fmt(wait)} so far.`];

  return (
    <main className={`${sans.className} flex min-h-screen items-center justify-center bg-white p-4 text-[#1b1b1f]`}>
      <style>{CSS}</style>

      <section
        aria-label="Refund request run"
        className="min-h-[612px] w-full max-w-[686px] rounded-[36px] border border-[#ececf0] bg-white p-7 shadow-[0_1px_2px_rgba(16,24,40,.04),0_16px_48px_-16px_rgba(16,24,40,.1)]"
      >
        {/* header */}
        <header className="flex items-center justify-between gap-4">
          <p className={`${mono.className} text-[12.5px] tracking-[0.03em] text-[#7b86a0]`}>
            REFUND-REQUEST · RUN_EP8NQY · $0.017 · 5.0k tokens
          </p>

          <div role="tablist" aria-label="View" className="relative grid shrink-0 grid-cols-2 rounded-[14px] bg-[#f2f2f4] p-[3px]">
            <span
              aria-hidden
              className="absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-[11px] border border-[#e4e4e8] bg-white shadow-[0_1px_2px_rgba(16,24,40,.08)] transition-transform duration-300 ease-[cubic-bezier(.3,.8,.3,1)]"
              style={{ transform: view === "story" ? "translateX(0)" : "translateX(100%)" }}
            />
            {(["story", "steps"] as const).map((v) => (
              <button
                key={v}
                role="tab"
                aria-selected={view === v}
                onClick={() => setView(v)}
                className={`relative z-10 h-[26px] rounded-[11px] px-3.5 text-[14px] capitalize outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#3f6cf0]/50 ${view === v ? "font-medium text-[#1b1b1f]" : "text-[#6f727c] hover:text-[#1b1b1f]"
                  }`}
              >
                {v}
              </button>
            ))}
          </div>
        </header>

        {/* headline */}
        <h1 className="mt-6 text-[22px] leading-tight tracking-[-0.01em] tabular-nums">
          <span key={heading[0]} className="rc-fade text-[#18181b]">{heading[0]}</span>{" "}
          <span className="text-[#8c8f98]">{heading[1]}</span>
        </h1>

        {/* time bar */}
        <div className="mt-5 flex h-5 gap-[2px]" role="img" aria-label="Time breakdown of the run">
          {segs.map((s, i) => (
            <div
              key={s.key}
              className={`rc-grow rounded-[3px] ${s.key === "wait" ? `rc-hatch ${live ? "rc-live" : ""}` : "rc-dots"}`}
              style={{ flex: `${s.ms} 0 0%`, animationDelay: `${i * 110}ms`, ["--c" as string]: s.color }}
            />
          ))}
          <div
            className="rc-grow rc-dots rounded-[3px]"
            style={{ flex: `${Math.max(cap - sum, 0)} 0 0%`, animationDelay: "440ms", ["--c" as string]: "#ececef" }}
          />
        </div>

        {/* legend */}
        <ul className="mt-4 flex flex-wrap gap-x-[22px] gap-y-2 text-[14px] tabular-nums">
          {segs.map((s) => (
            <li key={s.key} className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] rounded-[3px]" style={{ background: s.color }} />
              <span className="text-[#26262a]">{s.label}</span>
              <span className="text-[#8c8f98]">{fmt(s.ms)}</span>
            </li>
          ))}
        </ul>

        {/* body */}
        <div className="mt-[22px]">
          {view === "story" ? (
            <div key="story" className="rc-fade">
              <div className="grid grid-cols-[10px_minmax(0,1fr)_150px_57px] gap-x-[13px]">
                <span className={`${mono.className} col-span-2 text-[11.5px] tracking-[0.12em] text-[#8a93a8]`}>WHAT IT DID</span>
                <span className={`${mono.className} relative text-[11.5px] tracking-[0.06em] text-[#8a93a8]`}>
                  0S
                  <span className="absolute left-[73.3%] top-0 whitespace-nowrap pl-px">8.00s</span>
                </span>
              </div>
              <ul className="mt-2">
                {rows.map((r, i) => (
                  <StoryRow key={r.label} row={r} i={i} base={i < ROWS.length ? 350 : 0} />
                ))}
              </ul>
            </div>
          ) : (
            <div key="steps" className="rc-fade">
              <span className={`${mono.className} text-[11.5px] tracking-[0.12em] text-[#8a93a8]`}>STEP LOG</span>
              <ul className="mt-2">
                {STEPS.map((s, i) => (
                  <li
                    key={s.name}
                    className="rc-rise grid grid-cols-[10px_minmax(0,1fr)_auto] items-center gap-x-[13px] py-[7px]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className={`h-2 w-2 rounded-full ${s.warn ? "bg-[#ec6670]" : "bg-[#1f9078]"}`} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span className={`${mono.className} text-[13.5px]`}>{s.name}</span>
                        <span className="rounded-md bg-[#f2f2f4] px-1.5 py-px text-[11.5px] text-[#6f727c]">{s.kind}</span>
                      </span>
                      <span className="block truncate text-[13.5px] text-[#7d808a]">{s.note}</span>
                    </span>
                    <span className="text-[13.5px] tabular-nums text-[#7d808a]">{s.dur}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* approval */}
        <div
          key={phase === "approved" || phase === "denied" ? phase : "ask"}
          className="rc-pop -mx-[9px] mt-2 flex items-center gap-4 rounded-[22px] border border-[#ececf0] bg-white p-[17px] shadow-[0_2px_4px_rgba(16,24,40,.04),0_12px_30px_-10px_rgba(16,24,40,.16)]"
          style={{ animationDelay: phase === "waiting" ? "950ms" : "0ms" }}
        >
          {phase === "approved" ? (
            <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="9" fill="#1f9078" />
              <path className="rc-draw" pathLength="1" d="M6 10.4l2.7 2.7L14 7.6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : phase === "denied" ? (
            <span className="ml-1 h-2 w-2 shrink-0 rounded-full bg-[#b4b8c1]" />
          ) : (
            <span className="relative ml-1 flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a9770f] opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a9770f]" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-medium text-[#18181b]">
              {phase === "approved" ? "Refunded $1,067 to Jonas Weber" : phase === "denied" ? "Refund denied" : "Refund $1,067 to Jonas Weber"}
            </p>
            <p className="mt-0.5 truncate text-[13.5px] text-[#7d808a]">
              {phase === "approved"
                ? "POST /refunds · 200 OK · Visa •• 4021"
                : phase === "denied"
                  ? "No request was sent to the payment service."
                  : "POST /refunds · $1,067 to Visa •• 4021"}
            </p>
          </div>

          {phase === "denied" ? (
            <button
              onClick={() => setPhase("waiting")}
              className="h-10 shrink-0 rounded-xl bg-[#f1f1f3] px-4 text-[15px] font-medium text-[#18181b] outline-none transition hover:bg-[#e8e8eb] focus-visible:ring-2 focus-visible:ring-[#3f6cf0]/50 active:scale-[.97]"
            >
              Review again
            </button>
          ) : phase !== "approved" ? (
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setPhase("denied")}
                disabled={phase === "sending"}
                className="h-10 rounded-xl bg-[#f1f1f3] px-4 text-[15px] font-medium text-[#18181b] outline-none transition hover:bg-[#e8e8eb] focus-visible:ring-2 focus-visible:ring-[#3f6cf0]/50 active:scale-[.97] disabled:opacity-50"
              >
                Deny
              </button>
              <button
                onClick={approve}
                disabled={phase === "sending"}
                className="flex h-10 min-w-[88px] items-center justify-center gap-2 rounded-xl bg-[#161616] px-4 text-[15px] font-semibold text-white outline-none transition hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-[#3f6cf0]/60 focus-visible:ring-offset-2 active:scale-[.97] disabled:cursor-wait"
              >
                {phase === "sending" ? (
                  <>
                    <Spinner />
                    Sending
                  </>
                ) : (
                  "Approve"
                )}
              </button>
            </div>
          ) : null}
        </div>

        <p className="sr-only" role="status">
          {phase === "approved" ? "Refund approved and sent." : phase === "denied" ? "Refund denied." : ""}
        </p>
      </section>
    </main>
  );
}
