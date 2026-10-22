import type { ReactNode } from "react";
import { AIChat } from "@/components/ai/search";
import MarketingNavbar from "@/components/cli-ui/marketing-navbar";
import { MarketingSearchModal } from "@/components/cli-ui/marketing-search-modal";
import CtaSection from "./cta-section";
import ScrollProgress from "./scroll-progress";
import SiteFooter from "./site-footer";

export type CtaCopy = {
  headline: string;
  headlineItalic: string;
  body: string;
  cta: string;
  href: string;
};

export default function PageShell({
  children,
  cta,
  withCta = true,
}: {
  children: ReactNode;
  cta?: Partial<CtaCopy>;
  withCta?: boolean;
}) {
  return (
    <AIChat>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] font-['Inter',system-ui,sans-serif] text-white antialiased">
        <ScrollProgress />
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400&display=swap');
          @keyframes hp-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
          @keyframes mkt-rise {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes mkt-pulse {
            0%, 100% { opacity: .45; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.35); }
          }
          @keyframes mkt-drift {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(10px, -8px, 0); }
          }
          .mkt-rise { animation: mkt-rise .7s cubic-bezier(.2,.8,.2,1) both; }
          .mkt-pulse { animation: mkt-pulse 2.4s ease-in-out infinite; }
          .mkt-drift { animation: mkt-drift 7s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .mkt-rise, .mkt-pulse, .mkt-drift, .cursor-drift { animation: none; }
          }
        `}</style>

        <MarketingNavbar />

        <main className="relative z-10">{children}</main>

        {withCta && <CtaSection {...cta} />}
        <SiteFooter />
      </div>
      <MarketingSearchModal />
    </AIChat>
  );
}
