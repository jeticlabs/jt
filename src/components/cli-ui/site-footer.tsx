import { JeticIcon } from "../jetic-icon";

type FooterLink = { label: string; href: string; isNew?: boolean };
type Section = { heading?: string; links: FooterLink[] };
type Column = { title: string; sections: Section[] };

const l = (label: string, href: string, isNew?: boolean): FooterLink => ({
  label,
  href,
  isNew,
});

const D = "/docs";
const COLUMNS: Column[] = [
  {
    title: "Product",
    sections: [{ links: [
      l("Introduction", D),
      l("Workflows", `${D}/guides/workflows`),
      l("Jetic Studio", `${D}/guides/jetic-studio`),
      l("AI IDE (MCP)", `${D}/guides/ai-ide-mcp`),
    ] }],
  },
  {
    title: "Developers",
    sections: [{ links: [
      l("Getting started", `${D}/start/getting-started`),
      l("Installation", `${D}/start/installation`),
      l("CLI reference", `${D}/reference/cli-reference`),
      l("Artifacts & schemas", `${D}/reference/artifacts`),
    ] }],
  },
  {
    title: "Resources",
    sections: [{ links: [
      l("Screenshots", `${D}/resources/images`),
      l("Roadmap & vision", `${D}/resources/roadmap`),
    ] }],
  },
  {
    title: "Project",
    sections: [{ links: [
      l("GitHub", "https://github.com/JeticLabs/jetic-cli"),
      l("Issues", "https://github.com/JeticLabs/jetic-cli/issues"),
    ] }],
  },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/JeticLabs/jetic-cli",
    d: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.2 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  },
];

// Only show "All systems operational" when a real status check backs it.
const STATUS_OK = false;

function NewBadge() {
  return (
    <span className="ml-[6px] inline-flex h-[11px] items-center rounded-[3px] border border-white/90 bg-black px-[3px] text-[6.5px] font-bold leading-none tracking-[0.02em] text-white">
      NEW
    </span>
  );
}

function FooterColumn({ title, sections }: Column) {
  return (
    <div className="min-w-0">
      <h3 className="flex h-[27px] items-center text-[15px] font-medium tracking-[-0.01em] text-white">
        {title}
      </h3>
      {sections.map((s, i) => (
        <div key={i}>
          {s.heading && i > 0 && <div className="h-[27px]" aria-hidden />}
          {s.heading && (
            <h4 className="flex h-[27px] items-center text-[14px] font-semibold tracking-[-0.01em] text-white">
              {s.heading}
            </h4>
          )}
          <ul>
            {s.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="flex h-[27px] items-center whitespace-nowrap text-[15px] tracking-[-0.01em] text-white/60 transition-colors hover:text-white"
                >
                  {link.label}
                  {link.isNew && <NewBadge />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer className="w-full bg-black font-['Inter',system-ui,sans-serif] text-white antialiased">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');`}</style>

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-[12px] pt-[40px] lg:px-[59px]">
        {/* link columns */}
        <div className="grid grid-cols-2 gap-x-[26px] gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {COLUMNS.map((c) => (
            <FooterColumn key={c.title} {...c} />
          ))}
        </div>

        {/* bottom bar */}
        <div className="mt-[42px] flex flex-wrap items-center justify-between gap-x-8 gap-y-4 lg:min-h-[32px] lg:flex-nowrap">
          {/* logo */}
          <a href="/" className="flex items-baseline gap-[6px]" aria-label="Jetic CLI home">
            <span className="flex items-center gap-1  font-semibold tracking-[-0.03em] text-white">
              <JeticIcon size={12} />
              Jetic
            </span>
            <span className="hidden text-[11px] font-medium text-white/50">v1.0</span>
          </a>

          {/* socials */}
          <div className="flex items-center gap-[18px]">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="text-white transition-opacity hover:opacity-70"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>

          {/* tagline */}
          <p className="text-[13px] tracking-[-0.01em] text-white/60">
            Code-aware API behavior testing from your terminal.
          </p>

          {/* status */}
          {STATUS_OK && (
            <a
              href="/status"
              className="flex items-center gap-[7px] text-[13px] font-medium tracking-[-0.01em] text-white"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.6" stroke="#0099ff" strokeWidth="1.4" />
                <path
                  d="M5.2 8.2l2 2 3.6-4"
                  stroke="#0099ff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              All systems operational
            </a>
          )}

          {/* copyright */}
          <span className="text-[13px] font-medium tracking-[-0.01em] text-white">
            © 2026 Jetic. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}