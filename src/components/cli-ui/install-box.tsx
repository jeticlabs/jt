"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "./use-motion";

const INSTALL = "npm install -g jetic-cli";
const PHRASES = [INSTALL, "jetic init", "jetic scan", "jetic simulate workflow --list", "jetic dev"];

export default function InstallBox() {
  const [typed, setTyped] = useState(0);
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const phrase = reduced ? INSTALL : PHRASES[i];

  useEffect(() => {
    if (reduced) return;
    let c = 0, del = false, id = 0;
    const tick = () => {
      const full = PHRASES[i];
      if (!del) {
        c++; setTyped(c);
        if (c >= full.length) { del = true; id = window.setTimeout(tick, 1800); return; }
        id = window.setTimeout(tick, 34 + Math.random() * 40);
      } else {
        c--; setTyped(Math.max(0, c));
        if (c <= 0) { setI((n) => (n + 1) % PHRASES.length); return; }
        id = window.setTimeout(tick, 14);
      }
    };
    id = window.setTimeout(tick, 400);
    return () => window.clearTimeout(id);
  }, [i, reduced]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(INSTALL); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="relative mt-[26px] h-[116px] w-full max-w-[672px] rounded-[28px] border border-white/[0.13] bg-white/[0.012]">
      <div className="absolute left-[25px] top-[21px] flex items-center font-['JetBrains_Mono',ui-monospace,monospace] text-[15px] leading-[22px] text-white">
        <span className="mr-3 text-white/40">$</span>
        {reduced ? phrase : phrase.slice(0, typed)}
        {!reduced && <span className="ml-[1px] inline-block h-[16px] w-[2px] bg-white/80" style={{ animation: "hp-blink 1s steps(1) infinite" }} />}
      </div>
      <div className="absolute inset-x-[13px] bottom-[12px] flex items-center justify-between">
        <span className="pl-[12px] text-[13px] text-white/45">Node.js 20+ · ISC license · no AI key needed</span>
        <button
          onClick={copy}
          className="flex h-[36px] items-center gap-[8px] rounded-[10px] bg-white px-[16px] text-[13.5px] font-medium text-[#0a0a0a] transition-colors hover:bg-white/90"
        >
          {copied ? "Copied" : "Copy install"}
        </button>
      </div>
      <Link href="/docs/start/getting-started" className="sr-only">Getting started</Link>
    </div>
  );
}
