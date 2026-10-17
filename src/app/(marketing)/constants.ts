import type { CSSProperties } from "react";

export const FOOTER_LINK = [
  // row 1
  { label: "Features", href: "/features" },
  { label: "Simulations", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  // row 2
  { label: "Contact", href: "/contact" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
  // row 3
  { label: "Blog", href: "/blog" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// dotted text fill for the footer wordmark
export const dotText: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.55) 0.7px, transparent 1.25px)",
  backgroundSize: "3px 3px",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
