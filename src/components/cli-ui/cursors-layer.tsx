"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  config                                                             */
/* ------------------------------------------------------------------ */

/** DOM order of the cards inside #platform-section */
const CARD = {
  model: 0,
  traces: 1,
  memory: 2,
  inspect: 3,
  keyless: 4,
  changes: 5,
  mcp: 6,
  report: 7,
  assertions: 8,
} as const;

interface CursorDef {
  name: string;
  /** hero resting position */
  left: string;
  top: number;
  bg: string;
  fg: string;
  /** swoop direction of the scroll-driven flight */
  arc: 1 | -1;
  /** cards this cursor visits, in order. First one is where it lands. */
  tour: number[];
}

const CURSORS: CursorDef[] = [
  {
    name: "model-watcher", left: "11.56%", top: 283, bg: "#16a34a", fg: "#052e16", arc: 1,
    tour: [CARD.model, CARD.inspect, CARD.memory, CARD.keyless],
  },
  {
    name: "workflow-impact", left: "84.2%", top: 349, bg: "#ea580c", fg: "#fff7ed", arc: -1,
    tour: [CARD.traces, CARD.mcp, CARD.assertions, CARD.changes],
  },
  {
    name: "Claude Code", left: "14.53%", top: 620, bg: "#3b82f6", fg: "#eff6ff", arc: -1,
    tour: [CARD.report, CARD.changes, CARD.memory, CARD.traces],
  },
  {
    name: "Cursor", left: "80.2%", top: 672, bg: "#d97706", fg: "#1c1002", arc: 1,
    tour: [CARD.assertions, CARD.keyless, CARD.report, CARD.mcp],
  },
];

const TRAIL = 12;

/** which cursor performs the pricing demo (index into CURSORS) */
const LEAD = 0;
/** interface cards in DOM order: Terminal(0) Studio(1) MCP(2) */
const PRO = 2;
const PICK_LABEL = "Connect your editor";

/** final CTA: horizontal gap between the lined-up cursors (px) */
const CTA_SPACING = 34;
/** final CTA: delay between each cursor's departure (ms) */
const CTA_STAGGER = 220;
/** final CTA: padding of the first highlight ring and growth per cursor (px) */
const CTA_RING_PAD = 3;
const CTA_RING_STEP = 4;

/* ------------------------------------------------------------------ */
/*  helpers                                                            */
/* ------------------------------------------------------------------ */

const clamp = (n: number, a = 0, b = 1) => Math.min(b, Math.max(a, n));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const hash = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/** deterministic landing spot inside a card, as a fraction of its size */
const spot = (ci: number, wi: number) => ({
  fx: 0.28 + 0.44 * hash(ci * 7 + wi * 3 + 1),
  fy: 0.2 + 0.45 * hash(ci * 5 + wi * 11 + 2),
});

interface Rect { x: number; y: number; w: number; h: number }
interface Pt { x: number; y: number }
interface Seg {
  x0: number; y0: number; x1: number; y1: number;
  c1x: number; c1y: number; c2x: number; c2y: number;
  t0: number; dur: number;
}
interface Runner {
  init: boolean;
  x: number; y: number;
  mode: "scroll" | "tour";
  wi: number;
  seg: Seg | null;
  segN: number;
  arrivedAt: number;
  holdUntil: number;
  clicked: boolean;
  speed: number;
  hist: Pt[];
}
interface PricingState {
  active: boolean;
  step: number; // 0 Free, 1 Basic, 2 Pro
  parked: boolean;
  arrivedAt: number;
  holdUntil: number;
}
interface CtaState {
  active: boolean;
  parked: boolean[];
}
interface View {
  root: HTMLDivElement;
  drift: HTMLDivElement;
  label: HTMLSpanElement;
  pointer: SVGSVGElement;
  outline: HTMLDivElement;
  ripple: HTMLDivElement;
  trail: SVGGElement;
}

const bezier = (s: Seg, t: number): Pt => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return {
    x: a * s.x0 + b * s.c1x + c * s.c2x + d * s.x1,
    y: a * s.y0 + b * s.c1y + c * s.c2y + d * s.y1,
  };
};

/** curved path from `from` to `to`; `dir` (+1/-1) picks the bulge side */
const makeSeg = (from: Pt, to: Pt, now: number, dir: number): Seg => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bulge = len * 0.3 * dir;
  return {
    x0: from.x, y0: from.y, x1: to.x, y1: to.y,
    c1x: from.x + dx * 0.2 + nx * bulge,
    c1y: from.y + dy * 0.2 + ny * bulge,
    c2x: from.x + dx * 0.8 + nx * bulge * 0.5,
    c2y: from.y + dy * 0.8 + ny * bulge * 0.5,
    t0: now,
    dur: Math.min(1700, 650 + len * 0.85),
  };
};

/* ------------------------------------------------------------------ */
/*  one cursor's DOM                                                   */
/* ------------------------------------------------------------------ */

function CursorView({
  def,
  index,
  register,
}: {
  def: CursorDef;
  index: number;
  register: (i: number, v: View) => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const drift = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pointer = useRef<SVGSVGElement>(null);
  const outline = useRef<HTMLDivElement>(null);
  const ripple = useRef<HTMLDivElement>(null);
  const trail = useRef<SVGGElement>(null);

  useEffect(() => {
    register(index, {
      root: root.current!,
      drift: drift.current!,
      label: label.current!,
      pointer: pointer.current!,
      outline: outline.current!,
      ripple: ripple.current!,
      trail: trail.current!,
    });
  }, [index, register]);

  return (
    <>
      {/* motion trail */}
      <svg className="absolute left-0 top-0 overflow-visible" width="1" height="1">
        <g ref={trail} style={{ opacity: 0 }}>
          {Array.from({ length: TRAIL }).map((_, k) => (
            <circle
              key={k}
              r={3.2 * (1 - k / TRAIL) + 0.5}
              fill={def.bg}
              fillOpacity={0.5 * (1 - k / TRAIL)}
            />
          ))}
        </g>
      </svg>

      {/* "selected" / hover frame on the card it is visiting */}
      <div
        ref={outline}
        className="absolute rounded-[8px] opacity-0 transition-opacity duration-300"
        style={{
          border: `1.5px solid ${def.bg}`,
          background: `${def.bg}14`,
          boxShadow: `0 0 24px ${def.bg}33`,
        }}
      />

      {/* click ripple */}
      <div ref={ripple} className="absolute left-0 top-0 h-0 w-0">
        <span
          className="absolute -left-[14px] -top-[14px] h-[28px] w-[28px] rounded-full opacity-0"
          style={{ border: `2px solid ${def.bg}` }}
        />
      </div>

      {/* the cursor itself */}
      <div
        ref={root}
        className="absolute left-0 top-0 will-change-transform"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      >
        <div
          ref={drift}
          className="cursor-drift"
          style={{
            animationDuration: `${4.5 + index * 0.9}s`,
            animationDelay: `${-index * 1.3}s`,
          }}
        >
          <svg ref={pointer} width="16" height="20" viewBox="0 0 16 20" fill="none" style={{ transformOrigin: "2px 2px" }}>
            <path
              d="M1.5 1.5v14.2l3.6-3.2 2.6 5.8 2.3-1-2.5-5.7h4.9L1.5 1.5Z"
              fill="#fff"
              stroke={def.bg}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span
            ref={label}
            className="absolute left-[14px] top-[16px] whitespace-nowrap rounded-[4px] px-[7px] py-[2px] text-[11px] font-semibold leading-[14px]"
            style={{
              background: def.bg,
              color: def.fg,
              transition: "transform 300ms cubic-bezier(.2,.8,.2,1)",
            }}
          >
            {def.name}
          </span>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  layer                                                              */
/* ------------------------------------------------------------------ */

/**
 * Mount once inside the page's `relative` root (the one that contains the
 * hero, #platform-section, #pricing and #cta). Positions are measured against
 * this layer's own box, so it just needs to cover the page.
 *
 * Phase 1: as the platform section scrolls in, each cursor flies from its
 *          hero spot along a swooping arc to its first card.
 * Phase 2: once landed, each cursor keeps touring its own list of cards.
 * Phase 3: when #pricing scrolls in, the LEAD cursor hovers Free -> Basic,
 *          clicks Pro, a ring appears around Pro, and it parks there.
 * Phase 4: when the "Start for free" button in #cta scrolls in, ALL cursors
 *          fly to it, line up across it, click it, and each leaves a
 *          highlight ring in its own color. They park there. Scrolling back
 *          up releases everything.
 */
export default function CursorsLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const views = useRef<View[]>([]);
  const register = useRef((i: number, v: View) => {
    views.current[i] = v;
  }).current;

  useEffect(() => {
    const layer = layerRef.current;
    const ring = ringRef.current;
    if (!layer || !ring) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cards: Rect[] = [];
    let pCards: Rect[] = [];
    let proCta: Pt | null = null;
    let ctaBtn: Rect | null = null;
    let ctaLink: HTMLElement | null = null;
    let sectionEl: HTMLElement | null = null;
    let pricingEl: HTMLElement | null = null;
    let warned = false;
    let W = 0;

    const toRect = (el: Element, lr: DOMRect): Rect => {
      const r = el.getBoundingClientRect();
      return { x: r.left - lr.left, y: r.top - lr.top, w: r.width, h: r.height };
    };

    const measure = () => {
      const lr = layer.getBoundingClientRect();
      W = lr.width;

      /* platform section */
      sectionEl = document.getElementById("platform-section");
      if (!sectionEl) {
        cards = [];
        if (!warned) {
          warned = true;
          console.warn("[CursorsLayer] #platform-section not found, cursors will only idle.");
        }
      } else {
        const grid = sectionEl.querySelector(":scope > div > .grid");
        let els: HTMLElement[] = grid ? (Array.from(grid.children) as HTMLElement[]) : [];
        if (els.length === 0) {
          els = Array.from(sectionEl.querySelectorAll("a"))
            .map((a) => a.parentElement)
            .filter((el): el is HTMLElement => !!el);
        }
        cards = els.map((el) => toRect(el, lr));
      }

      /* pricing section */
      pricingEl = document.getElementById("interfaces");
      pCards = [];
      proCta = null;
      if (pricingEl) {
        const pg = pricingEl.querySelector(".grid");
        if (pg) {
          const kids = Array.from(pg.children) as HTMLElement[];
          pCards = kids.map((el) => toRect(el, lr));
          const proEl = kids[PRO];
          if (proEl) {
            const btns = proEl.querySelectorAll("button");
            const btn = btns[btns.length - 1];
            if (btn) {
              const b = toRect(btn, lr);
              proCta = { x: b.x + b.w * 0.5, y: b.y + b.h * 0.5 };
            }
          }
        }
      }

      /* final CTA: the "Start for free" link */
      ctaLink = document.getElementById("cta")?.querySelector("a") ?? null;
      ctaBtn = ctaLink ? toRect(ctaLink, lr) : null;
    };

    const runners: Runner[] = CURSORS.map(() => ({
      init: false, x: 0, y: 0, mode: "scroll", wi: 0, seg: null, segN: 0,
      arrivedAt: 0, holdUntil: 0, clicked: false, speed: 0, hist: [],
    }));

    const pr: PricingState = { active: false, step: 0, parked: false, arrivedAt: 0, holdUntil: 0 };
    const cta: CtaState = { active: false, parked: CURSORS.map(() => false) };

    /* ---------- platform helpers ---------- */

    const pt = (ci: number, wi: number): Pt => {
      const card = cards[CURSORS[ci].tour[wi] % cards.length];
      const s = spot(ci, wi);
      return { x: card.x + card.w * s.fx, y: card.y + card.h * s.fy };
    };

    const showOutlineRect = (i: number, c: Rect) => {
      const o = views.current[i].outline;
      o.style.left = `${c.x + 5}px`;
      o.style.top = `${c.y + 5}px`;
      o.style.width = `${c.w - 10}px`;
      o.style.height = `${c.h - 10}px`;
      o.style.opacity = "1";
    };
    const hideOutline = (i: number) => {
      views.current[i].outline.style.opacity = "0";
    };

    const click = (i: number, r: { x: number; y: number }) => {
      const v = views.current[i];
      v.ripple.style.transform = `translate3d(${r.x + 1.5}px, ${r.y + 1.5}px, 0)`;
      (v.ripple.firstElementChild as HTMLElement).animate(
        [
          { transform: "scale(0.2)", opacity: 0.9 },
          { transform: "scale(1.7)", opacity: 0 },
        ],
        { duration: 650, easing: "cubic-bezier(.2,.7,.3,1)" }
      );
      v.pointer.animate(
        [{ transform: "scale(1)" }, { transform: "scale(0.8)" }, { transform: "scale(1)" }],
        { duration: 260, easing: "ease-out" }
      );
    };

    const arrive = (i: number, r: Runner, now: number) => {
      r.seg = null;
      r.arrivedAt = now;
      r.holdUntil = now + 1000 + hash(i * 13 + r.segN) * 900;
      r.clicked = false;
      showOutlineRect(i, cards[CURSORS[i].tour[r.wi] % cards.length]);
    };

    const startSeg = (i: number, r: Runner, now: number) => {
      const next = (r.wi + 1) % CURSORS[i].tour.length;
      const p = pt(i, next);
      r.segN += 1;
      const dir = CURSORS[i].arc * (r.segN % 2 === 0 ? 1 : -1);
      r.seg = makeSeg(r, p, now, dir);
      r.wi = next;
      hideOutline(i);
    };

    /* ---------- shared helpers ---------- */

    const stopDrift = (i: number, stop: boolean) => {
      // only touches animation-name so duration/delay survive the reset
      views.current[i].drift.style.animationName = stop ? "none" : "";
    };

    /* ---------- pricing helpers ---------- */

    /** where the lead cursor should be for a pricing step */
    const priceTarget = (step: number): Pt | null => {
      if (pCards.length <= PRO) return null;
      if (step >= PRO) {
        if (proCta) return { x: proCta.x - 18, y: proCta.y - 2 };
        const c = pCards[PRO];
        return { x: c.x + c.w * 0.5, y: c.y + c.h - 40 };
      }
      const c = pCards[step];
      // hover over the plan name / tagline, a bit further right each time
      return { x: c.x + c.w * (0.3 + 0.12 * step), y: c.y + 34 };
    };

    const placeRing = () => {
      const c = pCards[PRO];
      if (!c) return;
      const pad = 3;
      ring.style.left = `${c.x - pad}px`;
      ring.style.top = `${c.y - pad}px`;
      ring.style.width = `${c.w + pad * 2}px`;
      ring.style.height = `${c.h + pad * 2}px`;
    };
    const showRing = () => {
      placeRing();
      ring.style.opacity = "1";
      ring.style.transform = "scale(1)";
    };
    const hideRing = () => {
      ring.style.opacity = "0";
      ring.style.transform = "scale(1.04)";
    };

    const flyPrice = (r: Runner, now: number) => {
      const p = priceTarget(pr.step);
      if (!p) return;
      r.segN += 1;
      r.seg = makeSeg(r, p, now, CURSORS[LEAD].arc * (pr.step % 2 === 0 ? 1 : -1));
    };

    const activatePricing = (r: Runner, now: number) => {
      pr.active = true;
      pr.step = 0;
      pr.parked = false;
      r.seg = null;
      r.mode = "scroll";
      hideOutline(LEAD);

      if (reduced) {
        // no motion: just sit on Pro with the ring
        const p = priceTarget(PRO);
        if (p) { r.x = p.x; r.y = p.y; }
        pr.step = PRO;
        pr.parked = true;
        stopDrift(LEAD, true);
        showRing();
        return;
      }
      flyPrice(r, now);
    };

    const deactivatePricing = (r: Runner) => {
      pr.active = false;
      pr.parked = false;
      pr.step = 0;
      r.seg = null;
      r.mode = "scroll";
      hideOutline(LEAD);
      hideRing();
      stopDrift(LEAD, false);
    };

    /* ---------- final CTA helpers ---------- */

    /** lined-up spot on the button for cursor i (same y, evenly spaced in x) */
    const ctaTarget = (i: number): Pt | null => {
      if (!ctaBtn) return null;
      const mid = (CURSORS.length - 1) / 2;
      const maxOffset = Math.max(0, ctaBtn.w / 2 - 16);
      const off = clamp((i - mid) * CTA_SPACING, -maxOffset, maxOffset);
      return {
        x: ctaBtn.x + ctaBtn.w / 2 + off - 2,
        y: ctaBtn.y + ctaBtn.h / 2 - 5,
      };
    };

    /** stacked highlight rings, one per cursor, each in its own color */
    const placeFrame = (i: number) => {
      const f = frameRefs.current[i];
      if (!f || !ctaBtn) return;
      const pad = CTA_RING_PAD + i * CTA_RING_STEP;
      f.style.left = `${ctaBtn.x - pad}px`;
      f.style.top = `${ctaBtn.y - pad}px`;
      f.style.width = `${ctaBtn.w + pad * 2}px`;
      f.style.height = `${ctaBtn.h + pad * 2}px`;
      f.style.borderRadius = `${12 + pad}px`;
    };
    const showFrame = (i: number) => {
      const f = frameRefs.current[i];
      if (!f) return;
      placeFrame(i);
      f.style.opacity = "1";
      f.style.transform = "scale(1)";
    };
    const hideFrame = (i: number) => {
      const f = frameRefs.current[i];
      if (!f) return;
      f.style.opacity = "0";
      f.style.transform = "scale(1.06)";
    };

    /** alternate name tags between two rows so neighbours don't overlap */
    const setLabelRow = (i: number, stagger: boolean) => {
      views.current[i].label.style.transform = stagger && i % 2 === 1 ? "translateY(18px)" : "";
    };

    const park = (i: number) => {
      cta.parked[i] = true;
      stopDrift(i, true);
      setLabelRow(i, true);
      showFrame(i);
    };

    const activateCta = (now: number) => {
      cta.active = true;
      hideRing();
      CURSORS.forEach((def, i) => {
        const r = runners[i];
        cta.parked[i] = false;
        r.mode = "scroll";
        r.seg = null;
        hideOutline(i);
        const p = ctaTarget(i);
        if (!p) return;
        if (reduced) {
          r.x = p.x;
          r.y = p.y;
          park(i);
          return;
        }
        r.segN += 1;
        const seg = makeSeg(r, p, now, def.arc);
        seg.t0 = now + i * CTA_STAGGER; // staggered departure
        r.seg = seg;
      });
    };

    const deactivateCta = () => {
      cta.active = false;
      CURSORS.forEach((_, i) => {
        const r = runners[i];
        cta.parked[i] = false;
        r.seg = null;
        r.mode = "scroll";
        hideFrame(i);
        setLabelRow(i, false);
        stopDrift(i, false);
      });
      // hand the lead cursor back to the pricing demo if it was running
      if (pr.active) {
        if (pr.parked) {
          stopDrift(LEAD, true);
          showRing();
        } else {
          pr.step = PRO - 1;
          pr.holdUntil = 0;
        }
      }
    };

    /* ---------- main loop ---------- */

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - last);
      last = now;
      if (layer.offsetWidth === 0 || views.current.length < CURSORS.length) return;

      const vh = window.innerHeight;

      // platform section progress
      const sec = sectionEl;
      const hasSection = cards.length > 0 && !!sec;
      const progress = sec
        ? clamp((vh * 0.85 - sec.getBoundingClientRect().top) / (vh * 0.6))
        : 0;

      // final CTA progress, driven by the button's own viewport position
      const ctaProgress = ctaLink
        ? clamp((vh * 0.9 - ctaLink.getBoundingClientRect().top) / (vh * 0.3))
        : 0;
      if (!cta.active && ctaProgress >= 0.5 && !!ctaBtn && runners.every((r) => r.init)) {
        activateCta(now);
      } else if (cta.active && ctaProgress < 0.1) {
        deactivateCta();
      }

      // pricing section progress (with hysteresis so it doesn't flicker)
      const priceProgress = pricingEl
        ? clamp((vh * 0.8 - pricingEl.getBoundingClientRect().top) / (vh * 0.45))
        : 0;
      const leadRunner = runners[LEAD];
      if (!cta.active && !pr.active && priceProgress >= 0.5 && pCards.length > PRO && leadRunner.init) {
        activatePricing(leadRunner, now);
      } else if (pr.active && priceProgress < 0.1) {
        deactivatePricing(leadRunner);
      }

      CURSORS.forEach((def, i) => {
        const r = runners[i];
        const v = views.current[i];
        const home: Pt = { x: (parseFloat(def.left) / 100) * W, y: def.top };

        if (!r.init) {
          r.init = true;
          r.x = home.x;
          r.y = home.y;
        }

        const pricingMode = i === LEAD && pr.active;

        if (cta.active) {
          /* ---------------- final CTA: line up + click ---------------- */
          const target = ctaTarget(i);
          if (cta.parked[i]) {
            // stay put, glued to the button if the layout moves
            if (target) {
              const k = 1 - Math.exp(-dt / 90);
              r.x += (target.x - r.x) * k;
              r.y += (target.y - r.y) * k;
            }
            placeFrame(i);
          } else if (r.seg) {
            const t = clamp((now - r.seg.t0) / r.seg.dur);
            const p = bezier(r.seg, easeInOutCubic(t));
            r.x = p.x;
            r.y = p.y;
            if (t >= 1) {
              r.seg = null;
              click(i, r);
              park(i);
            }
          }
        } else if (pricingMode) {
          /* ---------------- pricing demo ---------------- */
          if (pr.parked) {
            // stay put, but stay glued to the Pro button if layout moves
            const p = priceTarget(PRO);
            if (p) {
              const k = 1 - Math.exp(-dt / 90);
              r.x += (p.x - r.x) * k;
              r.y += (p.y - r.y) * k;
            }
            placeRing();
          } else if (r.seg) {
            const t = clamp((now - r.seg.t0) / r.seg.dur);
            const p = bezier(r.seg, easeInOutCubic(t));
            r.x = p.x;
            r.y = p.y;
            if (t >= 1) {
              r.seg = null;
              pr.arrivedAt = now;
              if (pr.step < PRO) {
                // hovering Free / Basic
                pr.holdUntil = now + (pr.step === 0 ? 650 : 800);
                showOutlineRect(i, pCards[pr.step]);
              } else {
                // reached Pro: click, ring, park
                hideOutline(i);
                click(i, r);
                showRing();
                stopDrift(i, true);
                pr.parked = true;
              }
            }
          } else if (now >= pr.holdUntil) {
            hideOutline(i);
            pr.step += 1;
            flyPrice(r, now);
          }
        } else {
          /* ---------------- hero -> platform -> tour ---------------- */
          const lagged = clamp(progress * 1.25 - i * 0.08);
          const landing = hasSection ? pt(i, 0) : home;
          const e = easeInOutCubic(lagged);
          const sway = Math.sin(Math.PI * e);
          const ax = home.x + (landing.x - home.x) * e + def.arc * 90 * sway;
          const ay = home.y + (landing.y - home.y) * e - def.arc * 55 * sway;

          const touring = hasSection && lagged >= 1 && !reduced;

          if (!touring) {
            if (r.mode === "tour") {
              r.mode = "scroll";
              r.seg = null;
              hideOutline(i);
            }
            const k = 1 - Math.exp(-dt / 70);
            r.x += (ax - r.x) * k;
            r.y += (ay - r.y) * k;
          } else if (r.mode === "scroll") {
            // glide the last bit onto the landing spot, then start touring
            const k = 1 - Math.exp(-dt / 70);
            r.x += (ax - r.x) * k;
            r.y += (ay - r.y) * k;
            if (Math.hypot(ax - r.x, ay - r.y) < 3) {
              r.mode = "tour";
              r.wi = 0;
              r.x = ax;
              r.y = ay;
              arrive(i, r, now);
            }
          } else if (r.seg) {
            const t = clamp((now - r.seg.t0) / r.seg.dur);
            const p = bezier(r.seg, easeInOutCubic(t));
            r.x = p.x;
            r.y = p.y;
            if (t >= 1) arrive(i, r, now);
          } else {
            if (!r.clicked && now > r.arrivedAt + 260) {
              r.clicked = true;
              click(i, r);
            }
            if (now >= r.holdUntil) startSeg(i, r, now);
          }
        }

        // trail
        const prev = r.hist[0];
        const inst = prev ? Math.hypot(r.x - prev.x, r.y - prev.y) : 0;
        r.speed += (inst - r.speed) * 0.3;
        r.hist.unshift({ x: r.x, y: r.y });
        if (r.hist.length > TRAIL) r.hist.pop();

        v.root.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
        v.trail.style.opacity = String(clamp(r.speed / 3));
        const circles = v.trail.children;
        for (let k = 0; k < circles.length; k++) {
          const h = r.hist[Math.min(k, r.hist.length - 1)];
          if (!h) continue;
          circles[k].setAttribute("cx", String(h.x + 1.5));
          circles[k].setAttribute("cy", String(h.y + 1.5));
        }
      });
    };

    measure();
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(measure);
    ro.observe(layer);
    const section = document.getElementById("platform-section");
    if (section) ro.observe(section);
    const pricing = document.getElementById("interfaces");
    if (pricing) ro.observe(pricing);
    const ctaSection = document.getElementById("cta");
    if (ctaSection) ro.observe(ctaSection);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    window.addEventListener("load", measure);
    const iv = window.setInterval(measure, 800);

    return () => {
      window.clearInterval(iv);
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);

  const lead = CURSORS[LEAD];

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-20 hidden lg:block"
      aria-hidden="true"
    >
      <style>{`
        @keyframes cursor-drift {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(3px, -2px); }
          50% { transform: translate(-2px, 3px); }
          75% { transform: translate(2px, 2px); }
        }
        .cursor-drift { animation: cursor-drift 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .cursor-drift { animation: none; } }
      `}</style>

      {/* "pick this one" ring around the Pro card */}
      <div
        ref={ringRef}
        className="absolute rounded-[16px]"
        style={{
          opacity: 0,
          transform: "scale(1.04)",
          transition: "opacity 400ms ease-out, transform 500ms cubic-bezier(.2,.8,.2,1)",
          border: `2px solid ${lead.bg}`,
          background: `${lead.bg}0d`,
          boxShadow: `0 0 0 4px ${lead.bg}22, 0 0 40px ${lead.bg}44`,
        }}
      >
        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-[10px] py-[3px] text-[11px] font-semibold leading-[14px]"
          style={{ background: lead.bg, color: lead.fg }}
        >
          {PICK_LABEL}
        </span>
      </div>

      {/* final CTA: one stacked highlight ring per cursor, in its own color */}
      {CURSORS.map((def, i) => (
        <div
          key={`cta-frame-${def.name}`}
          ref={(el) => {
            frameRefs.current[i] = el;
          }}
          className="absolute"
          style={{
            opacity: 0,
            transform: "scale(1.06)",
            transition: "opacity 350ms ease-out, transform 450ms cubic-bezier(.2,.8,.2,1)",
            border: `2px solid ${def.bg}`,
            background: `${def.bg}1a`,
            boxShadow: `0 0 18px ${def.bg}66`,
          }}
        />
      ))}

      {CURSORS.map((def, i) => (
        <CursorView key={def.name} def={def} index={i} register={register} />
      ))}
    </div>
  );
}