import { JeticIcon } from "../jetic-icon";

type FooterLink = { label: string; href: string; isNew?: boolean };
type Section = { heading?: string; links: FooterLink[] };
type Column = { title: string; sections: Section[] };

const l = (label: string, href: string, isNew?: boolean): FooterLink => ({
  label,
  href,
  isNew,
});

const COLUMNS: Column[] = [
  {
    title: "Product",
    sections: [
      {
        links: [
          l("Overview", "/product"),
          l("External Agent", "/product/external-agent"),
          l("API Model", "/product/api-model"),
          l("Endpoints", "/product/endpoints"),
          l("Schema & Security", "/product/schema-security"),
          l("Workflows", "/product/workflows"),
          l("Simulations", "/product/simulations"),
          l("Automations", "/product/automations"),
          l("Reports", "/product/reports"),
        ],
      },
    ],
  },
  {
    title: "Developers",
    sections: [
      {
        links: [
          l("CLI Documentation", "/docs"),
          l("Quickstart", "/docs/quickstart"),
          l("Install Jetic CLI", "/docs/install"),
          l("MCP Integration", "/docs/mcp"),
          l("SDK & API Reference", "/docs/api-reference"),
          l("Examples", "/examples"),
          l("GitHub", "https://github.com"),
          l("Changelog", "/changelog"),
          l("Roadmap", "/roadmap"),
        ],
      },
    ],
  },
  {
    title: "Compare",
    sections: [
      {
        heading: "API clients",
        links: [
          l("Jetic CLI vs Postman", "/compare/postman"),
          l("Jetic CLI vs Insomnia", "/compare/insomnia"),
          l("Jetic CLI vs Bruno", "/compare/bruno"),
          l("Jetic CLI vs Hoppscotch", "/compare/hoppscotch"),
          l("Jetic CLI vs Yaak", "/compare/yaak"),
        ],
      },
      {
        heading: "CLI & agentic tools",
        links: [
          l("Jetic CLI vs cURL", "/compare/curl"),
          l("Jetic CLI vs HTTPie", "/compare/httpie"),
          l("Jetic CLI vs AI coding agents", "/compare/ai-coding-agents"),
          l("Jetic CLI vs AI-powered API workflows", "/compare/ai-api-workflows"),
        ],
      },
      {
        heading: "Testing & simulation",
        links: [
          l("Jetic CLI vs ReadyAPI", "/compare/readyapi"),
          l("Jetic CLI vs Karate", "/compare/karate"),
          l("Jetic CLI vs REST Assured", "/compare/rest-assured"),
          l("View all comparisons →", "/compare"),
        ],
      },
    ],
  },
  {
    title: "Solutions",
    sections: [
      {
        links: [
          l("Backend Developers", "/solutions/backend-developers"),
          l("API Testing", "/solutions/api-testing"),
          l("AI-Assisted Testing", "/solutions/ai-assisted-testing"),
          l("API Simulation", "/solutions/api-simulation"),
          l("Regression Testing", "/solutions/regression-testing"),
          l("CI/CD Workflows", "/solutions/ci-cd"),
          l("Team Workspaces", "/solutions/team-workspaces"),
        ],
      },
    ],
  },
  {
    title: "Resources",
    sections: [
      {
        links: [
          l("Blog", "/blog"),
          l("Tutorials", "/tutorials"),
          l("API Testing Guides", "/guides"),
          l("Use Cases", "/use-cases"),
          l("Community", "/community"),
          l("Support", "/support"),
          l("Contact", "/contact"),
        ],
      },
    ],
  },
  {
    title: "Company",
    sections: [
      {
        links: [
          l("About Jetic", "/about"),
          l("Our Vision", "/vision"),
          l("Security", "/security"),
          l("Privacy", "/privacy"),
          l("Terms of Service", "/terms"),
          l("Status", "/status"),
        ],
      },
    ],
  },
];

const SOCIALS = [
  {
    label: "X",
    href: "#",
    d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "GitHub",
    href: "#",
    d: "M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.3 2.8.2 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3",
  },
  {
    label: "YouTube",
    href: "#",
    d: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z",
  },
  {
    label: "LinkedIn",
    href: "#",
    d: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z",
  },
];

// Only show "All systems operational" when a real status check backs it.
const STATUS_OK = true;

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
        <div className="grid grid-cols-2 gap-x-[26px] gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
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
            Code-aware API testing for Node.js teams.
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