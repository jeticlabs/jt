"use client";

import * as React from "react";
import Link from "next/link";
import JeticIcon from "@/components/paper-shader/gem-smoke";
import { walsheim } from "@/app/fonts";
import Image from "next/image";
import { images } from "@/lib/images";
import { NoiseBackground } from "../noise-background";
import { JeticIcon } from "@/components/jetic-icon";

const LANGUAGES = [
    { code: "EN", label: "English" },
    { code: "DE", label: "Deutsch" },
    { code: "FR", label: "Français" },
    { code: "ES", label: "Español" },
] as const;

export function Navbar() {
    const [language, setLanguage] = React.useState<(typeof LANGUAGES)[number]>(
        LANGUAGES[0]
    );
    const [open, setOpen] = React.useState(false);

    return (
        <header className="border-black/[.08] dark:border-white/[.08]">
            <nav
                aria-label="Marketing"
                className="relative mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6"
            >
                {/* Left — language selector */}
                <div className="relative">
                    <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center gap-1.5 rounded-full border border-black/[.08] px-3 py-1.5 text-sm font-medium dark:border-white/[.15]"
                    >
                        <span>{language.code}</span>
                        <span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">
                            {language.label}
                        </span>
                        <svg
                            aria-hidden
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`transition-transform ${open ? "rotate-180" : ""}`}
                        >
                            <path
                                d="M3 4.5 6 7.5 9 4.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    {open ? (
                        <ul
                            role="listbox"
                            aria-label="Language"
                            className="absolute left-0 z-20 mt-2 w-44 rounded-xl border border-black/[.08] bg-white p-1 text-sm shadow-lg dark:border-white/[.12] dark:bg-zinc-900"
                        >
                            {LANGUAGES.map((l) => (
                                <li key={l.code} role="option" aria-selected={l.code === language.code}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLanguage(l);
                                            setOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-black/[.04] dark:hover:bg-white/[.06]"
                                    >
                                        <span>{l.label}</span>
                                        <span className="text-xs text-zinc-500">{l.code}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                </div>

                {/* Center — brand */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        aria-label="Jetic home"
                        className="flex items-center "
                    >

                        <JeticIcon size={12} />

                    </Link>
                    <span className={` text-lg font-bold `}>
                        jetic
                    </span>
                </div>

                {/* Right — auth actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <Link
                        href="/sign-in"
                        className={`${walsheim.className}  rounded-full px-3 py-1.5 text-sm  text-zinc-700 hover:bg-black/[.04] sm:px-4 dark:text-zinc-200 dark:hover:bg-white/[.06]`}
                    >
                        Log in
                    </Link>

                    <NoiseBackground
                        containerClassName="w-fit p-2 rounded-full mx-auto"
                        gradientColors={[
                            "rgb(255, 100, 150)",
                            "rgb(100, 150, 255)",
                            "rgb(255, 200, 100)",
                        ]}
                    >
                        <Link
                            href="/sign-up"
                            className={`${walsheim.className} rounded-full bg-zinc-900 px-3 py-1.5 text-sm text-white sm:px-4 dark:bg-white dark:text-black`}
                        >
                            Sign up
                        </Link>
                    </NoiseBackground>

                </div>
            </nav>
        </header>
    );
}
