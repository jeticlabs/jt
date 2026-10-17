"use client"
import { useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  data (edit freely)                                                 */
/* ------------------------------------------------------------------ */

interface Tier {
    credits: string;
    yearly: number;
    monthly: number;
}

interface Feature {
    t: string;
    addon?: boolean;
}

interface Plan {
    id: string;
    name: string;
    tagline: string;
    cta: string;
    href: string;
    primary?: boolean;
    /** fixed price + fixed info box (Hobby / Enterprise) */
    price?: string;
    field?: string;
    /** selectable run tiers (Starter / Pro) */
    tiers?: Tier[];
    features: Feature[];
}

const PLANS: Plan[] = [
    {
        id: "hobby",
        name: "Hobby",
        tagline: "For personal projects",
        price: "$0",
        field: "50 runs a month to explore",
        cta: "Start for free",
        href: "/sign-up",
        features: [
            { t: "1 sandbox" },
            { t: "5 simulations" },
            { t: "7-day run history" },
            { t: "Community support" },
        ],
    },
    {
        id: "starter",
        name: "Starter",
        tagline: "For solo developers",
        cta: "Start with Starter",
        href: "/sign-up",
        tiers: [
            { credits: "500 runs / month", yearly: 10, monthly: 13 },
            { credits: "2,000 runs / month", yearly: 18, monthly: 23 },
        ],
        features: [
            { t: "3 sandboxes" },
            { t: "Unlimited simulations" },
            { t: "Environments & secret refs" },
            { t: "Approvals before execution" },
            { t: "30-day run history" },
            { t: "Extra run packs", addon: true },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        tagline: "For teams shipping APIs",
        cta: "Start with Pro",
        href: "/sign-up",
        primary: true,
        tiers: [
            { credits: "2,000 runs / month", yearly: 30, monthly: 39 },
            { credits: "10,000 runs / month", yearly: 55, monthly: 70 },
        ],
        features: [
            { t: "Unlimited sandboxes" },
            { t: "Unlimited simulations" },
            { t: "Environments & secret refs" },
            { t: "Approvals before execution" },
            { t: "Replay & failure investigation" },
            { t: "Scheduled workers" },
            { t: "GitHub sync" },
            { t: "Extra workspaces", addon: true },
            { t: "Extra run packs", addon: true },
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        tagline: "For regulated teams",
        price: "Custom",
        field: "Runs with volume pricing",
        cta: "Talk to us",
        href: "/contact",
        features: [
            { t: "SSO & SCIM" },
            { t: "Audit trails" },
            { t: "Scoped execution policies" },
            { t: "Custom data retention" },
            { t: "Dedicated support" },
            { t: "Security reviews" },
        ],
    },
];

/* ------------------------------------------------------------------ */
/*  bits                                                               */
/* ------------------------------------------------------------------ */

function Check() {
    return (
        <svg
            className="mt-[3px] shrink-0 text-white/40"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2.5 6.4 5 8.8l4.5-5" />
        </svg>
    );
}

function Chevron() {
    return (
        <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            width="10"
            height="10"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
    );
}

const fieldBox =
    "relative flex h-[34px] w-full items-center rounded-[7px] border border-white/[0.14] bg-white/[0.03] px-3 text-[12.5px] text-white";

/* ------------------------------------------------------------------ */
/*  section                                                            */
/* ------------------------------------------------------------------ */

export default function PricingSection() {
    const [yearly, setYearly] = useState(true);
    const [picked, setPicked] = useState<Record<string, number>>({ starter: 0, pro: 0 });

    return (
        <section
            id="pricing"
            className="w-full bg-black px-5 py-14 font-['Inter',system-ui,sans-serif] text-white antialiased"
        >
            <div className="mx-auto ">
                {/* heading + billing toggle */}
                <div className="flex items-end justify-between gap-6">
                    <h2 className="text-[40px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[48px]">
                        Start free, then
                        <br />
                        scale your testing
                    </h2>

                    <div className="mb-2 flex items-center gap-3 text-[13px] text-white/65">
                        <span>Yearly billing</span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={yearly}
                            aria-label="Yearly billing"
                            onClick={() => setYearly((y) => !y)}
                            className={`relative h-[20px] w-[34px] rounded-full transition-colors ${yearly ? "bg-white" : "bg-white/20"
                                }`}
                        >
                            <span
                                className={`absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all ${yearly ? "left-[16px] bg-black" : "left-[2px] bg-white"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* plans */}
                <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[18px] border border-white/[0.12] bg-white/[0.12] sm:grid-cols-2 lg:grid-cols-4">
                    {PLANS.map((plan) => {
                        const tier = plan.tiers?.[picked[plan.id] ?? 0];
                        const amount = tier ? (yearly ? tier.yearly : tier.monthly) : null;

                        return (
                            <div key={plan.id} className="flex flex-col bg-black p-6">
                                {/* name */}
                                <div className="text-[15px] font-semibold leading-tight text-white">{plan.name}</div>
                                <div className="mt-[3px] text-[14px] leading-tight text-white/55">{plan.tagline}</div>

                                <hr className="my-5 border-0 border-t border-white/10" />

                                {/* price */}
                                <div className="flex items-baseline gap-[6px]">
                                    <span className="text-[20px] font-semibold leading-none tracking-[-0.02em]">
                                        {amount !== null ? `$${amount}` : plan.price}
                                    </span>
                                    {amount !== null && (
                                        <span className="text-[11.5px] text-white/50">per month</span>
                                    )}
                                </div>

                                {/* credits field */}
                                <div className="mt-4">
                                    {plan.tiers ? (
                                        <label className={fieldBox}>
                                            <select
                                                value={picked[plan.id] ?? 0}
                                                onChange={(e) =>
                                                    setPicked((p) => ({ ...p, [plan.id]: Number(e.target.value) }))
                                                }
                                                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-[12.5px] text-white outline-none"
                                            >
                                                {plan.tiers.map((t, i) => (
                                                    <option key={t.credits} value={i} className="bg-[#111] text-white">
                                                        {t.credits}
                                                    </option>
                                                ))}
                                            </select>
                                            <Chevron />
                                        </label>
                                    ) : (
                                        <div className={fieldBox}>{plan.field}</div>
                                    )}
                                </div>

                                <hr className="my-5 border-0 border-t border-white/10" />

                                {/* features */}
                                <ul className="space-y-[11px]">
                                    {plan.features.map((f) => (
                                        <li key={f.t} className="flex items-start gap-[10px] text-[13px] leading-[18px] text-white/75">
                                            <Check />
                                            <span>
                                                {f.t}
                                                {f.addon && <span className="text-white/35"> (add-on)</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* cta */}
                                <div className="mt-auto pt-7">
                                    <Link
                                        href={plan.href}
                                        className={`flex w-full items-center justify-center rounded-[7px] px-4 py-[9px] text-[13px] font-medium transition-colors ${plan.primary
                                            ? "bg-white text-black hover:bg-white/90"
                                            : "bg-white/[0.13] text-white hover:bg-white/[0.2]"
                                            }`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}