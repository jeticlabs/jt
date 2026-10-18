"use client"
import Link from "next/link";
import CrystalizedBall from "../crystallized-ball";

/* edit the copy / links here */
const COPY = {
  headline: "Scan once. Simulate",
  headlineItalic: "everything.",
  body: "Install the CLI, run jetic init and jetic scan, and your Express routes become a behavioral model in .jetic/model.json. Then replay stateful workflows against a live server. No AI key required.",
  cta: "Get started",
  href: "/docs/start/getting-started",
};

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="relative w-full overflow-hidden bg-[#0a0a0a] font-['Inter',system-ui,sans-serif] text-white antialiased"
    >
      <div className="mx-auto grid min-h-[540px] max-w-[1248px] items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-[54px]">
        {/* copy */}
        <div className="flex flex-col items-start">
          <h2 className="font-['Instrument_Serif',Georgia,serif] text-[52px] font-normal leading-[1] tracking-[-0.045em] text-white md:text-[60px]">
            {COPY.headline} <em className="italic">{COPY.headlineItalic}</em>
          </h2>

          <p className="mt-[26px] max-w-[430px] text-[16px] leading-[25px] text-[#a1a1a8]">
            {COPY.body}
          </p>

          <div className="mt-[34px] flex items-center gap-5">
          <Link
            href={COPY.href}
            className="inline-flex h-[42px] items-center gap-[12px] rounded-[12px] bg-[#fafafa] px-[22px] text-[14px] font-medium text-[#0a0a0a] transition-colors hover:bg-white"
          >
            {COPY.cta}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <a href="https://github.com/JeticLabs/jetic-cli" className="text-[14px] text-white/60 hover:text-white">
            View on GitHub
          </a>
          </div>
        </div>

        {/* dithered image */}
        <div className="relative h-[240px] w-full lg:h-[320px]">
          <CrystalizedBall
            preset="plasma"
            color="#4462f4"
            size={0.7}
            crackle={0.85}
            fill={0.5}
            interactive
            hoverStrength={0.7}
            strands={6}
            flares={0.65}
            glow={0.9}
            sparks={0.6}
            particleCount={15000}
            motion="rise"
            particleShape="square"
            depth={0.6}
            sway={0.5}
            twinkle={0.5}
            haze={0.7}
            dustSpeed={1}
            speed={1}
            intro
            paused={false}
          />
        </div>
      </div>
    </section>
  );
}