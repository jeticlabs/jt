import Link from "next/link";
import { JeticIcon } from "@/components/jetic-icon";
import { FOOTER_LINK, dotText } from "@/app/(marketing)/constants";

export default function SiteFooter() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-[1248px]  px-6 pt-[34px] lg:px-[47px]">
      {/* top row */}
      <div className="grid items-start gap-10 pb-[34px] lg:grid-cols-3 lg:gap-0">
        {/* brand */}
        <div className="max-w-[220px]">
          <div className="flex items-center gap-[9px]">
            <JeticIcon size={12} />
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-white">
              jetic
            </span>
          </div>
          <p className="mt-[18px] text-[13px] leading-[21px] text-white/40">
            — <span className="text-[#c08a6b]/80">prompt</span> to{" "}
            <span className="text-[#6f8fd8]/80">API tests</span>, in a
            workspace you keep.
          </p>
        </div>

        {/* dotted wordmark — magnet for the landing-page cursors */}
        <div className="flex justify-start lg:justify-center" aria-hidden="true" id="cursor-anchor">
          <span
            className="select-none text-[84px] font-medium leading-[1] tracking-[-0.02em]"
            style={dotText}
          >
            jetic
          </span>
        </div>

        {/* links: 3 right-aligned columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-3 justify-items-start gap-x-6 gap-y-[11px] text-[13px] text-white/60 lg:justify-self-end lg:justify-items-end lg:gap-x-9 lg:text-right"
        >
          {FOOTER_LINK.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* bottom row */}
      <div className="flex items-center justify-between border-t border-white/[0.08] py-[22px] font-['JetBrains_Mono',ui-monospace,monospace] text-[10px] uppercase tracking-[0.18em] text-white/40">
        <span>© 2026 jetic</span>
        <div className="flex items-center gap-[22px]">
          <button className="flex items-center gap-[7px] font-['Inter',system-ui,sans-serif] text-[11.5px] normal-case tracking-normal text-white/60 hover:text-white/80">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M2.5 12h19M12 2.5c2.8 3 4 6 4 9.5s-1.2 6.5-4 9.5c-2.8-3-4-6-4-9.5s1.2-6.5 4-9.5Z" />
            </svg>
            English
          </button>
          <span className="hidden sm:inline">Runs you keep</span>
        </div>
      </div>
    </footer>
  );
}
