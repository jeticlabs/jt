"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { JeticIcon } from "../jetic-icon";

const LINKS = [
  { label: "Docs", href: "/docs" },
  { label: "Workflows", href: "/docs/guides/workflows" },
  { label: "GitHub", href: "https://github.com/JeticLabs/jetic-cli" },
];

/** Fixed landing navbar: blurred background + hairline after scrolling. */
export default function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setOpenSearch } = useSearchContext();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
          scrolled ? "border-b border-white/[0.07] backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-[76px] w-full max-w-[1248px] items-center justify-between gap-3 px-4 lg:px-[86px]">
          <nav className="hidden items-center gap-5 text-[12.5px] text-white/60 sm:flex">
            {LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-white/90">{l.label}</Link>
            ))}
          </nav>

          {/* absolutely centred so the brand mark stays put */}
          <Link href="/" aria-label="Jetic home" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[9px]">
            <JeticIcon size={12} />
            <span className="text-[16px] font-bold tracking-[-0.02em]">jetic</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenSearch(true)}
              className="hidden items-center gap-2 rounded-full border border-white/[0.14] px-3 py-1.5 text-[12px] text-white/55 hover:text-white/80 md:flex"
            >
              Search <kbd className="text-[10.5px] text-white/35">⌘K</kbd>
            </button>
            <Link
              href="/docs/start/getting-started"
              className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:bg-white/90"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      {/* spacer: keeps flow identical now the header is out of flow */}
      <div aria-hidden className="h-[76px] w-full" />
    </>
  );
}
