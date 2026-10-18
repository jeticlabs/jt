"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;

        const update = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            const progress = scrollable > 0 ? doc.scrollTop / scrollable : 0;
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[10000] h-[3px] bg-transparent"
        >
            <div
                ref={barRef}
                className="h-full w-full origin-left bg-white"
                style={{ transform: "scaleX(0)", willChange: "transform" }}
            />
        </div>
    );
}