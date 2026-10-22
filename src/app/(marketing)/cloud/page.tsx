import {
    CursorsLayer,
    FigureShowcase,
    FooterLinks,
    Hero,
    MarketingNavbar,
    PlatformSection,
    PromptBox,
    SiteFooter,
} from "@/components/marketing-ui";
import CtaSection from "@/components/marketing-ui/cta-section";
import PricingSection from "@/components/marketing-ui/pricing-section";
import ScrollProgress from "@/components/marketing-ui/scroll-progress";

export default function MarketingPage() {
    return (
        <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0a0a0a] font-['Inter',system-ui,sans-serif] text-white antialiased">
            <ScrollProgress />
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400&display=swap');
        @keyframes hp-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes cursor-drift {
          from { transform: translate(0, 0); }
          50% { transform: translate(7px, -6px); }
          to { transform: translate(-6px, 5px); }
        }
        .cursor-drift { animation: cursor-drift 5s ease-in-out infinite alternate; }
        @media (prefers-reduced-motion: reduce) {
          .cursor-drift { animation: none; }
        }
      `}</style>

            {/* collaborator cursors — idle wander + scroll-driven gathering */}
            <CursorsLayer />

            <div className="relative z-10 mx-auto flex h-full w-full  flex-col items-center px-4 pb-16">
                <MarketingNavbar />
                <Hero />
                <FigureShowcase />
                <PromptBox />
                <FooterLinks />
            </div>

            <PlatformSection />
            <PricingSection />
            <CtaSection />
            <SiteFooter />

        </div>
    );
}

