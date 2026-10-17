import { MarketingNavbar } from "@/components/marketing-ui";
import { inter } from "./fonts";
import type { CSSProperties } from "react";
import { JeticAnimatedIcon } from "@/components/jetic-animated-icon";
import Image from "next/image";

function DotGrid() {
  const cols = 6;
  const rows = 5;
  const gap = 3.4;
  const step = 0.09; // seconds of delay per diagonal step

  return (
    <svg width="20" height="17" viewBox="0 0 20 17" fill="white" aria-hidden="true">
      <style>{`
        .jetic-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: jetic-dot-wave 1.6s ease-in-out infinite;
          animation-delay: var(--d);
        }
        @keyframes jetic-dot-wave {
          0%, 60%, 100% { opacity: var(--o); transform: scale(1); }
          30%           { opacity: 1;        transform: scale(1.45); }
        }
        @media (prefers-reduced-motion: reduce) {
          .jetic-dot { animation: none; }
        }
      `}</style>

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const topRight = r === 0 && c >= cols - 2;
          const base = topRight ? 0.95 : 0.22 + ((r + c) % 3) * 0.06;

          return (
            <circle
              key={`${r}-${c}`}
              className="jetic-dot"
              cx={1.2 + c * gap}
              cy={1.2 + r * gap}
              r={0.9}
              opacity={base}
              style={
                {
                  "--o": base,
                  "--d": `${(r + c) * step}s`,
                } as CSSProperties
              }
            />
          );
        })
      )}
    </svg>
  );
}
export default function NotFound() {
  return (
    <main
      className={`${inter.className} jetic-surface flex min-h-screen w-screen flex-col items-center justify-center`}
    >

      <JeticAnimatedIcon />
      <div className="flex flex-col items-start px-6 mt-10">

        <h1 className="mt-[18px] text-[18px] font-medium leading-[24px] tracking-[-0.01em] text-white">
          Page not found
        </h1>

        <p className="jetic-muted mt-[6px] max-w-[230px] text-[14.5px] leading-[21px]">
          That page moved. We probably forgot to add a redirect here.
        </p>

        <div className="mt-[18px] flex items-center gap-[8px]">
          <a
            href="/"
            className="jetic-btn-light flex h-[34px] w-auto items-center whitespace-nowrap rounded-[10px] px-[14px] text-[13.5px] font-medium tracking-[-0.01em]"
          >
            Back home
          </a>
          <a
            href="mailto:hello@example.com"
            className="jetic-btn flex h-[34px] w-auto items-center whitespace-nowrap rounded-[10px] px-[14px] text-[13.5px] font-medium tracking-[-0.01em]"
          >
            Let us know
          </a>
        </div>
      </div>
    </main>
  );
}