"use client";

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

export interface PromptComposerLink {
    label: string;
    href?: string;
    onClick?: () => void;
}

export interface PromptComposerFooterItem {
    /** Plain text shown before the link, e.g. "Or" or "already building?" */
    prefix?: string;
    link: PromptComposerLink;
}

export interface PromptComposerProps {
    /** Controlled value. Omit to let the component manage its own state. */
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    /** Fires on button click or Enter (Shift+Enter inserts a newline). */
    onSubmit?: (value: string) => void;
    /** Fires when the secondary action (blank board) is clicked. */
    onSecondaryAction?: () => void;

    placeholder?: string;
    submitLabel?: string;
    secondaryLabel?: string;
    /** Hide the secondary action by passing `null`. */
    secondaryIcon?: ReactNode | null;

    footerItems?: PromptComposerFooterItem[];

    disabled?: boolean;
    loading?: boolean;
    /** Allow submitting with an empty prompt. */
    allowEmpty?: boolean;
    maxRows?: number;
    className?: string;
}

const PlusIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

const Spinner = () => (
    <svg
        className="animate-spin"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <path d="M21 12a9 9 0 1 1-6.2-8.55" />
    </svg>
);

const DEFAULT_FOOTER: PromptComposerFooterItem[] = [
    { prefix: "Or", link: { label: "check a KiCad design", href: "#" } },
    { link: { label: "browse Circuit World", href: "#" } },
    {
        prefix: "already building?",
        link: { label: "open the dashboard", href: "#" },
    },
];

const linkClass =
    "text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm";

export default function PromptComposer({
    value,
    defaultValue = "",
    onChange,
    onSubmit,
    onSecondaryAction,
    placeholder = "A pocket pet with a tiny screen and a buzzer",
    submitLabel = "Start building",
    secondaryLabel = "Blank board",
    secondaryIcon,
    footerItems = DEFAULT_FOOTER,
    disabled = false,
    loading = false,
    allowEmpty = false,
    maxRows = 8,
    className = "",
}: PromptComposerProps) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState(defaultValue);
    const text = isControlled ? value : internal;
    const ref = useRef<HTMLTextAreaElement>(null);

    // Auto-grow the textarea up to `maxRows`.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 24;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, lineHeight * maxRows)}px`;
    }, [text, maxRows]);

    const canSubmit = !disabled && !loading && (allowEmpty || text.trim() !== "");

    const handleChange = (next: string) => {
        if (!isControlled) setInternal(next);
        onChange?.(next);
    };

    const submit = () => {
        if (canSubmit) onSubmit?.(text.trim());
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className={`w-full max-w-[700px] ${className}`}>
            <div className="flex flex-col gap-6 rounded-md border border-white/10 bg-[#0e0e10] p-6 transition-colors focus-within:border-white/20">
                <textarea
                    ref={ref}
                    rows={1}
                    value={text}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    aria-label="Describe what you want to build"
                    className="min-h-[28px] w-full resize-none bg-transparent text-lg leading-7 text-white placeholder:text-zinc-500 focus:outline-none disabled:opacity-60"
                />

                <div className="flex items-center justify-between gap-4">
                    {secondaryIcon === null && !secondaryLabel ? (
                        <span />
                    ) : (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={onSecondaryAction}
                            className="inline-flex items-center gap-2 rounded-md text-[15px] text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
                        >
                            {secondaryIcon === undefined ? <PlusIcon /> : secondaryIcon}
                            {secondaryLabel}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={!canSubmit}
                        onClick={submit}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[15px] font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0e0e10] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitLabel}
                        {loading ? <Spinner /> : <ArrowRightIcon />}
                    </button>
                </div>
            </div>

            {footerItems.length > 0 && (
                <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-sm text-zinc-500">
                    {footerItems.map(({ prefix, link }, i) => (
                        <span key={link.label} className="inline-flex items-center gap-3">
                            {i > 0 && <span aria-hidden="true">·</span>}
                            <span>
                                {prefix && <span className="mr-1.5">{prefix}</span>}
                                {link.href ? (
                                    <a href={link.href} onClick={link.onClick} className={linkClass}>
                                        {link.label}
                                    </a>
                                ) : (
                                    <button type="button" onClick={link.onClick} className={linkClass}>
                                        {link.label}
                                    </button>
                                )}
                            </span>
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
}