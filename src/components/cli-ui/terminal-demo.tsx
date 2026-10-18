"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "./use-motion";

type Kind = "c" | "o" | "g" | "d" | "b";
/** c = typed command, o = output, g = success, d = dim, b = blue highlight */
const SCENES: { name: string; title: string; lines: [Kind, string][] }[] = [
  {
    name: "INIT", title: "Scaffold",
    lines: [
      ["c", "jetic init"],
      ["g", "✔ created jetic.config.json"],
      ["g", "✔ scaffolded .jetic/"],
      ["g", "✔ wrote empty .jetic/model.json"],
      ["d", "next: jetic scan"],
    ],
  },
  {
    name: "SCAN", title: "Scan source",
    lines: [
      ["c", "jetic scan"],
      ["d", "parsing tsconfig.json · ts-morph AST · server not started"],
      ["o", "app.use('/api/orders', ordersRouter)  →  resolved"],
      ["b", "GET    /api/orders/:id      src/routes/orders.ts:42"],
      ["b", "POST   /api/orders/checkout src/routes/orders.ts:67"],
      ["b", "POST   /api/auth/login      src/routes/auth.ts:18"],
      ["g", "✔ 24 endpoints → .jetic/model.json"],
    ],
  },
  {
    name: "INSPECT", title: "Inspect",
    lines: [
      ["c", "jetic inspect endpoint GET /api/orders/:id"],
      ["o", "source      src/routes/orders.ts:42"],
      ["o", "params      id (path)"],
      ["o", "middleware  requireAuth"],
      ["g", "✔ provenance traced to file + line"],
    ],
  },
  {
    name: "SIMULATE", title: "Simulate",
    lines: [
      ["c", "jetic simulate workflow --workflow .jetic/workflows/checkout.json"],
      ["g", "✔ 1. register          201   98ms"],
      ["g", "✔ 2. login             200   61ms   captured workflow:accessToken"],
      ["g", "✔ 3. create order      201  143ms   injected Authorization"],
      ["g", "✔ 4. fetch order       200   54ms"],
      ["b", "4 passed · trace saved · open it with jetic dev"],
    ],
  },
];

const COLOR: Record<Kind, string> = {
  c: "text-white", o: "text-white/70", g: "text-[#4ade80]", d: "text-white/40", b: "text-[#38b6ff]",
};

export default function TerminalDemo() {
  const [fig, setFig] = useState(1);
  const [pos, setPos] = useState({ l: 0, c: 0 });
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const lines = SCENES[fig].lines;

  useEffect(() => {
    if (reduced) { setPos({ l: lines.length, c: 0 }); return; }
    setPos({ l: 0, c: 0 });
    if (!inView) return;
    let l = 0, c = 0, id = 0;
    const go = (ms: number, f: () => void) => { id = window.setTimeout(f, ms); };
    const step = () => {
      if (l >= lines.length) { go(2600, () => setFig((f) => (f + 1) % SCENES.length)); return; }
      const [k, s] = lines[l];
      if (k === "c" && c < s.length) { c++; setPos({ l, c }); go(28, step); }
      else { l++; c = 0; setPos({ l, c }); go(k === "c" ? 450 : 230, step); }
    };
    go(350, step);
    return () => window.clearTimeout(id);
  }, [fig, inView, reduced, lines]);

  return (
    <>
      <div ref={ref} className="mt-[34px] w-full max-w-[672px] overflow-hidden rounded-[14px] border border-white/[0.13] bg-white/[0.02]">
        <div className="flex h-[34px] items-center gap-[7px] border-b border-white/10 px-[14px]">
          {[0, 1, 2].map((i) => <span key={i} className="h-[9px] w-[9px] rounded-full bg-white/[0.16]" />)}
          <span className="ml-3 font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] text-white/40">~/express-shop</span>
        </div>
        <div
          aria-label={`Terminal demo: ${SCENES[fig].title}`}
          className="h-[218px] overflow-hidden px-[18px] py-[14px] font-['JetBrains_Mono',ui-monospace,monospace] text-[12px] leading-[21px]"
        >
          {lines.map(([k, s], i) => {
            if (i > pos.l) return null;
            const typing = k === "c" && i === pos.l;
            const text = typing ? s.slice(0, pos.c) : s;
            if (i === pos.l && k !== "c") return null;
            return (
              <div key={i} className={`whitespace-pre ${COLOR[k]}`}>
                {k === "c" && <span className="mr-2 text-white/40">$</span>}
                {text}
                {typing && <span className="ml-[1px] inline-block h-[13px] w-[7px] translate-y-[2px] bg-white/80" style={{ animation: "hp-blink 1s steps(1) infinite" }} />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-[18px] flex w-full max-w-[420px] items-center justify-between font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] tracking-[0.18em] text-white/40">
        <span>STEP {String(fig + 1).padStart(2, "0")} · {SCENES[fig].name}</span>
        <div className="flex items-center gap-[6px]">
          {SCENES.map((s, i) => (
            <button
              key={s.name}
              aria-label={`Show ${s.title}`}
              onClick={() => setFig(i)}
              className={`h-[4px] w-[4px] rounded-full transition-colors ${i === fig ? "bg-white" : "bg-white/30"}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
