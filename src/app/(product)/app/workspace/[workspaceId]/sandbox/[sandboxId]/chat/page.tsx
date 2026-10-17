"use client"
import CosmicSparkle from "@/components/cosmic-sparkle";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

/* ---------- Icons ---------- */

const Svg = ({
    children,
    size = 18,
    strokeWidth = 1.8,
}: {
    children: ReactNode;
    size?: number;
    strokeWidth?: number;
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const Plus = () => (
    <Svg size={18}>
        <path d="M12 5v14M5 12h14" />
    </Svg>
);
const Expand = () => (
    <Svg size={18}>
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </Svg>
);
const ListIcon = () => (
    <Svg size={16}>
        <path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01" strokeWidth={2.2} />
    </Svg>
);
const Cube = () => (
    <Svg size={16}>
        <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </Svg>
);
const ArrowUp = () => (
    <Svg size={20} strokeWidth={2}>
        <path d="M12 19V5M5 12l7-7 7 7" />
    </Svg>
);
const CloseIcon = () => (
    <Svg size={12} strokeWidth={2.2}>
        <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
);
const StopIcon = () => (
    <Svg size={16} strokeWidth={2}>
        <rect x="4" y="4" width="16" height="16" rx="2" />
    </Svg>
);

/* ---------- Types ---------- */

type Effort = "Low" | "Medium" | "High";
const EFFORTS: Effort[] = ["Low", "Medium", "High"];

interface Message {
    id: number;
    role: "user" | "assistant";
    text: string;
}

interface Chat {
    id: number;
    title: string;
    messages: Message[];
}

/* ---------- Sub-components ---------- */

const Kbd = ({ children }: { children: ReactNode }) => (
    <kbd className="jetic-muted mx-0.5 inline-flex h-[26px] min-w-[26px] items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1a] px-1.5 align-middle ">
        {children}
    </kbd>
);

function EmptyState() {
    return (
        <div className="rounded-2xl border border-white/10 px-5 py-4">
            <h2 className=" font-semibold text-white">No simulation yet</h2>
            <p className="jetic-muted mt-2  leading-[26px]">
                Describe the API you want to test and Jetic drafts a simulation for you to approve
                before it runs anything.
            </p>
            <p className="jetic-muted mt-2  leading-[26px]">
                Press <Kbd>Enter</Kbd> to send — every run stays reviewable in history.
            </p>
        </div>
    );
}

/* ---------- Component ---------- */

export default function ChatPanel() {
    const [chats, setChats] = useState<Chat[]>([{ id: 1, title: "New simulation", messages: [] }]);
    const [activeId, setActiveId] = useState<number>(1);
    const [value, setValue] = useState<string>("");
    const [planMode, setPlanMode] = useState<boolean>(true);
    const [effort, setEffort] = useState<Effort>("Low");
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const nextChatId = useRef<number>(2);
    const nextMsgId = useRef<number>(1);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const active = chats.find((c) => c.id === activeId) ?? chats[0];
    const usage = 0; // TODO: wire to real context usage (0-100)

    // Auto-grow textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [value]);

    // Scroll to newest message
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [active.messages.length]);

    const addChat = () => {
        const id = nextChatId.current++;
        setChats((cs) => [...cs, { id, title: "New simulation", messages: [] }]);
        setActiveId(id);
        textareaRef.current?.focus();
    };

    const closeChat = (id: number) => {
        setChats((cs) => {
            if (cs.length === 1) return cs;
            const next = cs.filter((c) => c.id !== id);
            if (id === activeId) setActiveId(next[next.length - 1].id);
            return next;
        });
    };

    const send = () => {
        const text = value.trim();
        if (!text) return;
        const userMsg: Message = { id: nextMsgId.current++, role: "user", text };
        setChats((cs) =>
            cs.map((c) =>
                c.id === activeId
                    ? {
                        ...c,
                        title: c.messages.length === 0 ? text.slice(0, 24) : c.title,
                        messages: [...c.messages, userMsg],
                    }
                    : c
            )
        );
        setValue("");
        setIsRunning(true);
        // TODO: send { text, planMode, effort } to your backend and append the reply
        console.log("Send:", { text, planMode, effort });
    };

    const stopAgent = () => {
        setIsRunning(false);
        // TODO: cancel the in-flight request
    };

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const cycleEffort = () =>
        setEffort((e) => EFFORTS[(EFFORTS.indexOf(e) + 1) % EFFORTS.length]);

    const canSend = value.trim().length > 0;

    return (

        <CosmicSparkle>

            <section
                className={` flex h-full w-full flex-col text-[13px]  z-50 ${expanded ? "w-full" : "w-[540px] max-w-full"
                    }`}
            >
                {/* Top bar */}
                <header className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                        <div role="tablist" aria-label="Simulations" className="flex min-w-0 items-center gap-1 overflow-x-auto">
                            {chats.map((c) => (
                                <div
                                    key={c.id}
                                    className={`group flex shrink-0 items-center rounded-xl transition-colors ${c.id === activeId ? "bg-[#1e1e1e]" : "hover:bg-[#1e1e1e]"
                                        }`}
                                >
                                    <button
                                        type="button"
                                        role="tab"
                                        aria-selected={c.id === activeId}
                                        onClick={() => setActiveId(c.id)}
                                        className={`max-w-[160px] truncate px-4 py-2  font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-xl ${c.id === activeId ? "text-white" : "jetic-muted"
                                            }`}
                                    >
                                        {c.title}
                                    </button>
                                    {chats.length > 1 && (
                                        <button
                                            type="button"
                                            aria-label={`Close ${c.title}`}
                                            onClick={() => closeChat(c.id)}
                                            className="jetic-muted mr-2 hidden h-5 w-5 items-center justify-center rounded-full hover:bg-white/10 hover:text-white group-hover:flex"
                                        >
                                            <CloseIcon />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            aria-label="New simulation"
                            onClick={addChat}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#ededed] transition-colors hover:bg-[#1e1e1e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            <Plus />
                        </button>
                    </div>

                    <button
                        type="button"
                        aria-label={expanded ? "Collapse panel" : "Expand panel"}
                        aria-pressed={expanded}
                        onClick={() => setExpanded((x) => !x)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#ededed] transition-colors hover:bg-[#1e1e1e] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                        <Expand />
                    </button>
                </header>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-[18px] pt-3.5">
                    {active.messages.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <ul className="flex flex-col gap-3 pb-4">
                            {active.messages.map((m) => (
                                <li
                                    key={m.id}
                                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5  leading-6 ${m.role === "user"
                                        ? "self-end bg-[#1e1e1e] text-white"
                                        : "self-start border border-white/10 text-[#ededed]"
                                        }`}
                                >
                                    {m.text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Composer / Agent-running banner */}
                <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isRunning ? "72px" : "320px" }}
                >
                    {isRunning ? (
                        /* ── Agent running banner ── */
                        <div className="mx-3 mb-3 flex items-center gap-3 rounded-[15px] border border-white/10 bg-[#1e1e1e] px-4 py-3 shadow-lg">
                            {/* Animated pulsing dot */}
                            <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span
                                    className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"
                                    style={{ animation: "ping 1.2s cubic-bezier(0,0,0.2,1) infinite" }}
                                />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet-500" />
                            </span>

                            {/* Label */}
                            <span
                                className="flex-1 text-[13px] font-medium"
                                style={{
                                    background: "linear-gradient(90deg,#c4b5fd,#818cf8,#c4b5fd)",
                                    backgroundSize: "200% auto",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    animation: "shimmer 2.4s linear infinite",
                                }}
                            >
                                Agent is running…
                            </span>

                            {/* Stop button */}
                            <button
                                type="button"
                                aria-label="Stop agent"
                                onClick={stopAgent}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#ededed] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40"
                            >
                                <StopIcon />
                            </button>

                            <style>{`
                                @keyframes ping {
                                    75%, 100% { transform: scale(2); opacity: 0; }
                                }
                                @keyframes shimmer {
                                    0% { background-position: 0% center; }
                                    100% { background-position: 200% center; }
                                }
                            `}</style>
                        </div>
                    ) : (
                        /* ── Normal composer ── */
                        <div className="p-3">
                            <div className="rounded-[15px] border border-white/10 bg-[#1e1e1e] px-3 pb-3 pt-4 shadow-lg focus-within:border-white/20">
                                <textarea
                                    ref={textareaRef}
                                    rows={2}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="Describe the API flow you want to simulate…"
                                    aria-label="Message"
                                    className="mb-3 block max-h-40 w-full resize-none bg-transparent px-2.5 leading-6 text-white placeholder:text-[#8a8a8a] focus:outline-none"
                                />

                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        aria-pressed={planMode}
                                        onClick={() => setPlanMode((p) => !p)}
                                        className={`flex h-10 items-center gap-2 rounded-full px-3.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                                            planMode
                                                ? "bg-white text-black hover:bg-[#e5e5e5]"
                                                : "jetic-muted hover:bg-[#1e1e1e]"
                                        }`}
                                    >
                                        <ListIcon />
                                        Plan
                                    </button>

                                    <button
                                        type="button"
                                        onClick={cycleEffort}
                                        className="flex h-10 items-center gap-2 rounded-full px-3 transition-colors hover:bg-[#1e1e1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                    >
                                        <span className="jetic-muted">Effort</span>
                                        <span className="font-semibold text-[#ededed]">{effort}</span>
                                    </button>

                                    <div className="flex-1" />

                                    <button
                                        type="button"
                                        className="flex h-10 items-center gap-2 rounded-full px-3 font-semibold text-[#ededed] transition-colors hover:bg-[#1e1e1e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                    >
                                        <Cube />
                                        Workspace
                                    </button>

                                    <span
                                        title="Context used"
                                        className="jetic-muted flex h-8 items-center rounded-full border border-white/10 px-3"
                                    >
                                        {usage}%
                                    </span>

                                    <button
                                        type="button"
                                        aria-label="Send"
                                        onClick={send}
                                        disabled={!canSend}
                                        className={`ml-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                                            canSend
                                                ? "bg-white text-black hover:bg-[#e5e5e5]"
                                                : "cursor-not-allowed bg-[#1a1a1a] text-[#555555]"
                                        }`}
                                    >
                                        <ArrowUp />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </CosmicSparkle>

    );
}