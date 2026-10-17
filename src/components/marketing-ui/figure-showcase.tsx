"use client";

import { useState } from "react";
import DitherVeil from "@/components/dither-veil";

const FIGS = [
  "AUTH FLOW",
  "CHECKOUT CART",
  "WEBHOOK RELAY",
  "RATE LIMIT",
  "SEARCH QUERY",
  "NodeJS APIs",
];

export default function FigureShowcase() {
  const [fig, setFig] = useState(5);

  return (
    <>
      {/* figure */}
      <div className="mt-[26px] flex h-[20vh] w-full items-center justify-center">
        <DitherVeil
          src="/node.png"
          pattern="floyd"
          pixelSize={2}
          inkColor="#0a0a0a"
          paperColor="#f4f1ea"
          revealRadius={200}
          softness={0.6}
          linger={1}
          fit="contain"
          rimColor="#a78bfa"
          palette="duotone"
          levels={2}
          contrast={1.15}
          brightness={0}
          rim={0}
          reverse={false}
          wander={false}
          clickBurst
        />
      </div>

      {/* caption + pager */}
      <div className="mt-[20px] flex w-full max-w-[420px] items-center justify-between font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] tracking-[0.18em] text-white/40">
        <span>
          FIG. {String(fig + 1).padStart(2, "0")} · {FIGS[fig]}
        </span>
        <div className="flex items-center gap-[6px]">
          {FIGS.map((_, i) => (
            <button
              key={i}
              aria-label={`Figure ${i + 1}`}
              onClick={() => setFig(i)}
              className={`h-[4px] w-[4px] rounded-full transition-colors ${i === fig ? "bg-white" : "bg-white/30"
                }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
