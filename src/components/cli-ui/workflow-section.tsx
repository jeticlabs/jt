"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "./use-motion";

/* lifecycle: init → scan → verify → simulate */
const PHASES = [
  { cmd: "jetic init", out: ".jetic/" },
  { cmd: "jetic scan", out: "model.json" },
  { cmd: "jetic_verify_model", out: "verified model" },
  { cmd: "jetic simulate workflow", out: "trace" },
];
const PRIMS = [
  ["Model", "What exists?"],
  ["Workflow", "What happens?"],
  ["Memory", "What carries between steps?"],
  ["Trace", "What actually ran?"],
];

/* workflow run: status per step, memory keys captured so far, highlighted key */
type S = "i" | "r" | "o" | "y" | "s"; // idle, running, ok, retrying, skipped
const STEPS = [
  { m: "POST", p: "/auth/register", res: "201 · 98ms", note: "captureInput userEmail" },
  { m: "POST", p: "/auth/login", res: "200 · 61ms", note: "capture accessToken" },
  { m: "POST", p: "/auth/verify-2fa", res: "skipped", note: "condition: requires2FA = true" },
  { m: "POST", p: "/orders", res: "201 · 143ms", note: "inject Authorization" },
  { m: "GET", p: "/orders/:id", res: "200 · 54ms", note: "inject Authorization" },
];
const MEM: [string, string][] = [
  ["workflow:userEmail", "user_8f9a@example.com"],
  ["workflow:accessToken", "eyJhbGciOi…"],
  ["workflow:orderId", "ord_7Q2x"],
];
const FRAMES: [string, number, number][] = [
  ["iiiii", 0, -1], ["riiii", 0, -1], ["oiiii", 1, -1], ["oriii", 1, -1],
  ["ooiii", 2, -1], ["oosii", 2, -1], ["oosri", 2, 1], ["oosyi", 2, 1],
  ["oosoi", 3, 1], ["oosor", 3, 2], ["oosoo", 3, 2],
];

const dot: Record<S, string> = {
  i: "border-white/25", r: "border-[#0099ff] bg-[#0099ff]/30 animate-pulse", o: "border-[#22c55e] bg-[#22c55e]",
  y: "border-[#f59e0b] bg-[#f59e0b]/40 animate-pulse", s: "border-white/20 bg-white/10",
};

export default function WorkflowSection() {
  const [ref, inView] = useInView<HTMLElement>();
  const reduced = useReducedMotion();
  const [f, setF] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reduced) { setF(FRAMES.length - 1); setPhase(3); return; }
    if (!inView) return;
    const a = window.setInterval(() => setF((n) => (n + 1) % (FRAMES.length + 2)), 950);
    const b = window.setInterval(() => setPhase((n) => (n + 1) % 4), 1700);
    return () => { clearInterval(a); clearInterval(b); };
  }, [inView, reduced]);

  const [st, mem, hl] = FRAMES[Math.min(f, FRAMES.length - 1)];
  const done = f >= FRAMES.length - 1;

  return (
    <section ref={ref} id="workflow" className="w-full bg-black px-[21px] py-16 font-['Inter',system-ui,sans-serif] text-white antialiased">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[48px]">
          Four commands,
          <br />
          one stateful journey
        </h2>

        {/* lifecycle */}
        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.12] bg-white/[0.12] md:grid-cols-4">
          {PHASES.map((p, i) => (
            <div key={p.cmd} className={`bg-black p-4 transition-opacity duration-500 ${i <= phase ? "opacity-100" : "opacity-35"}`}>
              <div className="font-['JetBrains_Mono',ui-monospace,monospace] text-[12px] text-white">{p.cmd}</div>
              <div className="mt-2 h-[2px] w-full bg-white/10">
                <div className="h-full bg-[#0099ff] transition-[width] duration-[1400ms] ease-out" style={{ width: i <= phase ? "100%" : "0%" }} />
              </div>
              <div className="mt-2 text-[12px] text-white/55">→ {p.out}</div>
            </div>
          ))}
        </div>

        {/* run + memory */}
        <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-white/[0.12] bg-white/[0.12] lg:grid-cols-[1.5fr_1fr]">
          <div className="bg-black p-6">
            <div className="font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/45">
              $ jetic simulate workflow --workflow .jetic/workflows/checkout.json
            </div>
            <ul className="mt-5 space-y-[6px]">
              {STEPS.map((s, i) => {
                const k = st[i] as S;
                return (
                  <li key={s.p} className={`flex items-center gap-3 rounded-[8px] px-3 py-[9px] text-[13px] transition-colors ${k === "r" || k === "y" ? "bg-white/[0.07]" : ""}`}>
                    <span className={`h-[10px] w-[10px] shrink-0 rounded-full border ${dot[k]}`} />
                    <span className="w-[42px] shrink-0 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/45">{s.m}</span>
                    <span className={`flex-1 truncate ${k === "s" ? "text-white/35 line-through" : "text-white/90"}`}>{s.p}</span>
                    <span className="hidden truncate text-[11.5px] text-white/40 sm:block">{k === "y" ? "503 → retry 1/2" : s.note}</span>
                    <span className={`w-[78px] shrink-0 text-right text-[12px] ${k === "o" ? "text-[#4ade80]" : k === "y" ? "text-[#f59e0b]" : "text-white/35"}`}>
                      {k === "o" || k === "s" ? s.res : k === "r" ? "running…" : k === "y" ? "retrying" : "—"}
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className={`mt-4 text-[12.5px] transition-opacity duration-500 ${done ? "text-[#4ade80] opacity-100" : "opacity-0"}`}>
              4 passed · 1 skipped · trace saved
            </div>
          </div>

          <div className="bg-black p-6">
            <div className="text-[15px] font-semibold">Memory</div>
            <div className="mt-1 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/40">.jetic/memory.json</div>
            <ul className="mt-5 space-y-2">
              {MEM.map(([k, v], i) => (
                <li
                  key={k}
                  className={`rounded-[8px] border px-3 py-2 transition-all duration-500 ${i < mem ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"} ${hl === i ? "border-[#0099ff] bg-[#0099ff]/10" : "border-white/10 bg-white/[0.03]"}`}
                >
                  <div className="font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/80">{k}</div>
                  <div className="mt-[2px] truncate font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/45">{v}</div>
                </li>
              ))}
            </ul>
            <div className="mt-5 h-[18px] text-[12px] text-[#38b6ff]">
              {hl === 1 && !done ? "inject → Authorization: Bearer {{workflow:accessToken}}" : hl === 2 && !done ? "path ← {{workflow:orderId}}" : ""}
            </div>
          </div>
        </div>

        {/* primitives */}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
          {PRIMS.map(([a, b]) => (
            <div key={a} className="border-t border-white/[0.12] pt-3">
              <dt className="text-[14px] font-medium">{a}</dt>
              <dd className="mt-1 text-[13px] text-white/55">{b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
