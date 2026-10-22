import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/*  types                                                              */
/* ------------------------------------------------------------------ */

export type CtaLink = { label: string; href: string };
export type Crumb = { label: string; href?: string };

export type TerminalLineKind = "cmd" | "out" | "ok" | "dim" | "blue" | "warn";
export type TerminalLine = { kind?: TerminalLineKind; text: string };
export type TerminalData = { title?: string; lines: TerminalLine[]; footer?: string };

export type Stat = { value: string; label: string };
export type FeatureItem = { title: string; body: string; tag?: string };
export type StepItem = { title: string; body: string; cmd?: string };
export type SpecRow = { k: string; v: string };
export type FaqItem = { q: string; a: string };
export type RelatedItem = { title: string; body: string; href: string; tag?: string };
export type ProseSection = { heading: string; paragraphs?: string[]; bullets?: string[] };

export type Block =
  | { type: "stats"; items: Stat[] }
  | { type: "features"; eyebrow?: string; title: string; body?: string; items: FeatureItem[] }
  | {
      type: "split";
      eyebrow?: string;
      title: string;
      body: string;
      bullets: string[];
      terminal: TerminalData;
      reverse?: boolean;
      link?: CtaLink;
    }
  | { type: "steps"; eyebrow?: string; title: string; body?: string; items: StepItem[] }
  | {
      type: "table";
      eyebrow?: string;
      title: string;
      body?: string;
      head: [string, string, string];
      rows: [string, string, string][];
    }
  | { type: "specs"; eyebrow?: string; title: string; body?: string; rows: SpecRow[]; note?: string }
  | { type: "prose"; eyebrow?: string; title: string; body?: string; sections: ProseSection[] }
  | { type: "faq"; eyebrow?: string; title?: string; items: FaqItem[] }
  | { type: "related"; eyebrow?: string; title?: string; body?: string; items: RelatedItem[] }
  | { type: "quote"; quote: string; attribution: string };

export type PageDefinition = {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  titleAccent?: string;
  description: string;
  primary?: CtaLink;
  secondary?: CtaLink;
  chips?: string[];
  terminal?: TerminalData;
  blocks?: Block[];
};

/* ------------------------------------------------------------------ */
/*  primitives                                                         */
/* ------------------------------------------------------------------ */

const LINE_COLOR: Record<TerminalLineKind, string> = {
  cmd: "text-white",
  out: "text-white/65",
  ok: "text-[#4ade80]",
  dim: "text-white/35",
  blue: "text-[#38b6ff]",
  warn: "text-[#f59e0b]",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-[3px] shrink-0 text-white/40"
    >
      <path d="M2.5 6.4 5 8.8l4.5-5" />
    </svg>
  );
}

export function ActionLink({ link, primary }: { link: CtaLink; primary?: boolean }) {
  const className = primary
    ? "inline-flex h-[42px] items-center gap-[10px] rounded-[12px] bg-[#fafafa] px-[20px] text-[13.5px] font-medium text-[#0a0a0a] transition-colors hover:bg-white"
    : "inline-flex h-[42px] items-center gap-[10px] rounded-[12px] border border-white/12 bg-white/[0.03] px-[18px] text-[13.5px] font-medium text-white/80 transition-colors hover:border-white/25 hover:text-white";

  if (link.href.startsWith("http")) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noreferrer">
        {link.label}
        <Arrow />
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
      <Arrow />
    </Link>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.18em] text-white/40 ${className}`}>
      {children}
    </p>
  );
}

export function TerminalWindow({ data, className = "" }: { data: TerminalData; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-white/[0.13] bg-[#0b0b0b] ${className}`}>
      <div className="flex h-[34px] items-center gap-[7px] border-b border-white/10 px-[14px]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-[9px] w-[9px] rounded-full bg-white/[0.16]" />
        ))}
        <span className="ml-3 truncate font-['JetBrains_Mono',ui-monospace,monospace] text-[10.5px] text-white/40">
          {data.title ?? "jetic"}
        </span>
        <span className="ml-auto h-[6px] w-[6px] rounded-full bg-[#0099ff] mkt-pulse" />
      </div>
      <div className="overflow-x-auto px-[18px] py-[15px] font-['JetBrains_Mono',ui-monospace,monospace] text-[11px] leading-[21px]">
        {data.lines.map((line, i) => (
          <div key={i} className={`whitespace-pre ${LINE_COLOR[line.kind ?? "out"]}`}>
            {line.kind === "cmd" && <span className="mr-2 text-white/40">$</span>}
            {line.text}
            {line.kind === "cmd" && i === data.lines.length - 1 && (
              <span
                className="ml-[2px] inline-block h-[12px] w-[6px] translate-y-[2px] bg-white/70"
                style={{ animation: "hp-blink 1s steps(1) infinite" }}
              />
            )}
          </div>
        ))}
      </div>
      {data.footer && (
        <div className="border-t border-white/10 px-[18px] py-[8px] font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] text-white/35">
          {data.footer}
        </div>
      )}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  className = "",
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="max-w-[620px] text-[30px] font-medium leading-[1.08] tracking-[-0.035em] text-white sm:text-[38px]">
        {title}
      </h2>
      {body && <p className="mt-3 max-w-[560px] text-[13px] leading-[1.6] text-white/50">{body}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  sections                                                           */
/* ------------------------------------------------------------------ */

export function PageHero({ page }: { page: PageDefinition }) {
  return (
    <section className="relative mx-auto w-full max-w-[1080px] px-6 pb-16 pt-10 sm:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.055),transparent_65%)]"
      />

      <nav aria-label="Breadcrumb" className="relative flex flex-wrap items-center gap-2 text-[11px] text-white/45">
        {page.crumbs.map((crumb, i) => (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/20">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="transition-colors hover:text-white">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-white/75">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div
        className={`relative mt-10 grid items-center gap-12 ${
          page.terminal ? "lg:grid-cols-[1.08fr_0.92fr]" : ""
        }`}
      >
        <div className="mkt-rise">
          <Eyebrow className="mb-5">{page.eyebrow}</Eyebrow>
          <h1 className="max-w-[680px] font-['Instrument_Serif',Georgia,serif] text-[46px] font-normal leading-[0.99] tracking-[-0.045em] text-white sm:text-[58px] md:text-[64px]">
            {page.title}
            {page.titleAccent && (
              <>
                {" "}
                <em className="italic">{page.titleAccent}</em>
              </>
            )}
          </h1>

          <p className="mt-6 max-w-[540px] text-[15.5px] leading-[25px] text-[#b4b4ba]">{page.description}</p>

          {(page.primary || page.secondary) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {page.primary && <ActionLink link={page.primary} primary />}
              {page.secondary && <ActionLink link={page.secondary} />}
            </div>
          )}

          {page.chips && page.chips.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {page.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-[5px] text-[10.5px] tracking-[-0.01em] text-white/50"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>

        {page.terminal && (
          <div className="mkt-rise" style={{ animationDelay: "120ms" }}>
            <div aria-hidden="true" className="absolute -right-8 top-8 h-[220px] w-[220px] rounded-full bg-[#0099ff]/10 blur-[70px] mkt-drift" />
            <TerminalWindow data={page.terminal} className="relative" />
          </div>
        )}
      </div>
    </section>
  );
}

function Stats({ items }: { items: Stat[] }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 pb-6">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.12] bg-white/[0.12] md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="bg-[#0a0a0a] px-5 py-5">
            <div className="text-[24px] font-medium leading-none tracking-[-0.035em] text-white">{item.value}</div>
            <div className="mt-2 text-[11px] leading-[1.4] text-white/45">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features({ block }: { block: Extract<Block, { type: "features" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} body={block.body} />
      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.12] bg-white/[0.12] sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item, i) => (
          <div key={item.title} className="group flex min-h-[176px] flex-col bg-[#0a0a0a] p-5 pb-6 transition-colors hover:bg-white/[0.025]">
            <div className="flex items-center justify-between">
              <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] tracking-[0.12em] text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.tag && (
                <span className="rounded-[3px] border border-white/10 bg-white/[0.04] px-[6px] py-[2px] text-[8.5px] uppercase tracking-[0.1em] text-white/45">
                  {item.tag}
                </span>
              )}
            </div>
            <h3 className="mt-5 text-[13px] font-medium text-white">{item.title}</h3>
            <p className="mt-1.5 max-w-[280px] text-[11.5px] leading-[1.55] text-white/50">{item.body}</p>
            <span className="mt-auto pt-5 text-white/20 transition-all group-hover:translate-x-[2px] group-hover:text-white/50">
              <Arrow />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Split({ block }: { block: Extract<Block, { type: "split" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <div className="grid overflow-hidden rounded-[28px] border border-white/[0.12] bg-white/[0.12] gap-px lg:grid-cols-2">
        <div className={`bg-[#0a0a0a] p-7 sm:p-9 ${block.reverse ? "lg:order-2" : ""}`}>
          {block.eyebrow && <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow>}
          <h2 className="max-w-[420px] text-[28px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px]">
            {block.title}
          </h2>
          <p className="mt-3 max-w-[460px] text-[13px] leading-[1.6] text-white/50">{block.body}</p>

          <ul className="mt-7 space-y-[11px]">
            {block.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-[10px] text-[12.5px] leading-[18px] text-white/75">
                <Check />
                {bullet}
              </li>
            ))}
          </ul>

          {block.link && (
            <div className="mt-8">
              <ActionLink link={block.link} />
            </div>
          )}
        </div>

        <div className={`relative flex items-center bg-[#0c0c0c] p-5 sm:p-7 ${block.reverse ? "lg:order-1" : ""}`}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,153,255,0.08),transparent_60%)]" />
          <TerminalWindow data={block.terminal} className="relative w-full" />
        </div>
      </div>
    </section>
  );
}

function Steps({ block }: { block: Extract<Block, { type: "steps" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} body={block.body} />
      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.12] bg-white/[0.12] sm:grid-cols-2 lg:grid-cols-4">
        {block.items.map((item, i) => (
          <div key={item.title} className="relative bg-[#0a0a0a] p-5 pb-6">
            <div className="flex items-baseline gap-2">
              <span className="font-['Instrument_Serif',Georgia,serif] text-[26px] italic leading-none text-white/25">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
            <h3 className="mt-5 text-[13px] font-medium">{item.title}</h3>
            <p className="mt-2 text-[11.5px] leading-[1.55] text-white/50">{item.body}</p>
            {item.cmd && (
              <div className="mt-4 rounded-[6px] border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] text-white/60">
                {item.cmd}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Table({ block }: { block: Extract<Block, { type: "table" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} body={block.body} />
      <div className="mt-10 overflow-x-auto rounded-[18px] border border-white/[0.12]">
        <table className="w-full min-w-[720px] border-collapse text-left text-[11px]">
          <thead>
            <tr className="border-b border-white/10 bg-[#0c0c0c]">
              {block.head.map((h) => (
                <th key={h} scope="col" className="px-5 py-3.5 font-medium text-white/80">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map(([label, a, b]) => (
              <tr key={label} className="border-b border-white/10 align-top last:border-b-0">
                <th scope="row" className="px-5 py-4 font-medium text-white">
                  {label}
                </th>
                <td className="px-5 py-4 leading-[1.55] text-white/45">{a}</td>
                <td className="px-5 py-4 leading-[1.55] text-white/65">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Specs({ block }: { block: Extract<Block, { type: "specs" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} body={block.body} className="md:sticky md:top-24 md:self-start" />
        <dl className="divide-y divide-white/10 border-y border-white/10">
          {block.rows.map((row) => (
            <div key={row.k} className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
              <dt className="text-[11.5px] font-medium text-white">{row.k}</dt>
              <dd className="text-[11.5px] leading-[1.6] text-white/50">{row.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {block.note && <p className="mt-6 max-w-[640px] text-[11px] leading-[1.6] text-white/35">{block.note}</p>}
    </section>
  );
}

function Prose({ block }: { block: Extract<Block, { type: "prose" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[0.7fr_1.3fr]">
        <div className="md:sticky md:top-24 md:self-start">
          {block.eyebrow && <Eyebrow className="mb-4">{block.eyebrow}</Eyebrow>}
          <h2 className="max-w-[340px] text-[30px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[36px]">
            {block.title}
          </h2>
          {block.body && <p className="mt-3 max-w-[340px] text-[12.5px] leading-[1.6] text-white/50">{block.body}</p>}
        </div>

        <div className="space-y-10">
          {block.sections.map((section) => (
            <div key={section.heading}>
              <h3 className="text-[15px] font-medium text-white">{section.heading}</h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-2.5 text-[12.5px] leading-[1.75] text-white/50">
                  {paragraph}
                </p>
              ))}
              {section.bullets && (
                <ul className="mt-3 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-[10px] text-[12.5px] leading-[1.6] text-white/60">
                      <Check />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq({ block }: { block: Extract<Block, { type: "faq" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 py-20">
      <div className="grid gap-10 md:grid-cols-[1fr_1.9fr]">
        <SectionHeading eyebrow={block.eyebrow} title={block.title ?? "Frequently asked questions"} />
        <div className="divide-y divide-white/10 border-y border-white/10">
          {block.items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[12.5px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
                {item.q}
                <svg
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 shrink-0 text-white/50 transition-transform group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                >
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </summary>
              <p className="mt-2.5 max-w-[560px] text-[11.5px] leading-[1.65] text-white/50">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Related({ block }: { block: Extract<Block, { type: "related" }> }) {
  return (
    <section className="mx-auto w-full max-w-[1080px] px-6 pb-20 pt-8">
      <SectionHeading eyebrow={block.eyebrow} title={block.title ?? "Keep exploring"} body={block.body} />
      <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] border border-white/[0.12] bg-white/[0.12] sm:grid-cols-2 lg:grid-cols-3">
        {block.items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[150px] flex-col bg-[#0a0a0a] p-5 transition-colors hover:bg-white/[0.025]"
          >
            {item.tag && <span className="font-['JetBrains_Mono',ui-monospace,monospace] text-[9px] uppercase tracking-[0.14em] text-white/35">{item.tag}</span>}
            <h3 className="mt-3 text-[13px] font-medium">{item.title}</h3>
            <p className="mt-1.5 max-w-[280px] text-[11.5px] leading-[1.55] text-white/50">{item.body}</p>
            <span className="mt-auto flex items-center gap-2 pt-5 text-[11px] text-white/40 transition-colors group-hover:text-white">
              Read more <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Quote({ block }: { block: Extract<Block, { type: "quote" }> }) {
  return (
    <section className="mx-auto w-full max-w-[920px] px-6 py-20 text-center">
      <p className="font-['Instrument_Serif',Georgia,serif] text-[30px] italic leading-[1.2] tracking-[-0.02em] text-white/85 sm:text-[38px]">
        &ldquo;{block.quote}&rdquo;
      </p>
      <p className="mt-5 font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.16em] text-white/40">
        {block.attribution}
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  renderer                                                           */
/* ------------------------------------------------------------------ */

export function MarketingBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "stats":
            return <Stats key={i} items={block.items} />;
          case "features":
            return <Features key={i} block={block} />;
          case "split":
            return <Split key={i} block={block} />;
          case "steps":
            return <Steps key={i} block={block} />;
          case "table":
            return <Table key={i} block={block} />;
          case "specs":
            return <Specs key={i} block={block} />;
          case "prose":
            return <Prose key={i} block={block} />;
          case "faq":
            return <Faq key={i} block={block} />;
          case "related":
            return <Related key={i} block={block} />;
          case "quote":
            return <Quote key={i} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
