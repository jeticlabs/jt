"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "A checkout flow with retries and webhooks",
  "Test login, then refresh an expired token",
  "Three failed payments, then a successful retry",
  "Verify the refund webhook arrives intact",
];

const TYPE_MIN_MS = 34;
const TYPE_JITTER_MS = 46;
const HOLD_MS = 1600;
const DELETE_MS = 16;
const START_DELAY_MS = 500;
const RESTART_DELAY_MS = 350;

export default function PromptBox() {
  const [prompt, setPrompt] = useState("");
  const [focused, setFocused] = useState(false);
  const [typed, setTyped] = useState("");
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Typewriter: runs only while the box is empty and unfocused.
  useEffect(() => {
    if (prompt !== "" || focused || reducedMotion) return;
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer = 0;

    const tick = () => {
      const full = PHRASES[phrase];
      if (!deleting) {
        char += 1;
        setTyped(full.slice(0, char));
        if (char >= full.length) {
          deleting = true;
          timer = window.setTimeout(tick, HOLD_MS);
          return;
        }
        timer = window.setTimeout(tick, TYPE_MIN_MS + Math.random() * TYPE_JITTER_MS);
      } else {
        char -= 1;
        setTyped(full.slice(0, Math.max(0, char)));
        if (char <= 0) {
          deleting = false;
          phrase = (phrase + 1) % PHRASES.length;
          timer = window.setTimeout(tick, RESTART_DELAY_MS);
          return;
        }
        timer = window.setTimeout(tick, DELETE_MS);
      }
    };

    timer = window.setTimeout(tick, START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [prompt, focused, reducedMotion]);

  const showStatic = prompt === "" && (focused || reducedMotion);
  const showFaux = prompt === "";

  return (
    <div className="relative mt-[26px] h-[140px] w-full max-w-[672px] rounded-[28px] border border-white/[0.13] bg-white/[0.012]">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        spellCheck={false}
        aria-label="Describe the API flow you want to simulate"
        className="absolute left-0 top-0 h-[96px] w-full resize-none bg-transparent px-[25px] pt-[21px] text-[16px] leading-[22px] text-white caret-white outline-none"
      />
      {showFaux && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[25px] top-[21px] flex items-center text-[16px] leading-[22px] text-white/45"
        >
          {showStatic ? PHRASES[0] : typed}
          {!showStatic && (
            <span
              className="ml-[1px] inline-block h-[16px] w-[2px] bg-white/80"
              style={
                reducedMotion
                  ? undefined
                  : { animation: "hp-blink 1s steps(1) infinite" }
              }
            />
          )}
        </div>
      )}

      <div className="absolute inset-x-[13px] bottom-[12px] flex items-center justify-between">
        <button className="flex items-center gap-[8px] pl-[12px] text-[13.5px] text-white/55 hover:text-white/80">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 4v16M4 12h16" />
          </svg>
          Blank simulation
        </button>
        <button className="flex h-[36px] items-center gap-[8px] rounded-[10px] bg-white px-[16px] text-[13.5px] font-medium text-[#0a0a0a] transition-colors hover:bg-white/90">
          Start simulating
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
