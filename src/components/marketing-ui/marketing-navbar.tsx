"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { JeticIcon } from "../jetic-icon";
import { GooeyInput } from "../goey-input";


/**
 * Landing navbar. Fixed to the viewport top — gains a blurred
 * background + hairline once you scroll. A same-height spacer keeps
 * page flow identical to the static version.
 */
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
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${scrolled
          ? "border-b border-white/[0.07]  backdrop-blur-md"
          : "border-b border-transparent"
          }`}
      >
        <div className="relative mx-auto flex h-[76px] w-full max-w-[1248px] items-center justify-between gap-3 px-4 lg:px-[86px]">
          <button className="hidden w-fit items-center gap-[7px] text-[11.5px] text-white/60 hover:text-white/80 sm:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="12" cy="12" r="9.5" />
              <path d="M2.5 12h19M12 2.5c2.8 3 4 6 4 9.5s-1.2 6.5-4 9.5c-2.8-3-4-6-4-9.5s1.2-6.5 4-9.5Z" />
            </svg>
            English
          </button>

          {/* absolutely centred so the brand mark stays put regardless of the side groups */}
          <Link
            href="/"
            aria-label="Jetic home"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[9px]"
          >
            <JeticIcon size={12} />
            <span className="text-[16px] font-bold tracking-[-0.02em]">jetic</span>
          </Link>

          <div className="flex items-center gap-2">


            <Link
              href="/sign-up"
              className="rounded-full bg-white px-4 py-1.5 text-[13px] font-medium text-[#0a0a0a] transition-colors hover:bg-white/90"
            >
              Try Jetic Cloud
            </Link>
          </div>
        </div>
      </header>
      {/* spacer: keeps flow identical now the header is out of flow */}
      <div aria-hidden className="h-[76px] w-full" />
    </>
  );
}
