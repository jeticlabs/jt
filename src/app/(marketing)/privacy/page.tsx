import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Jetic handles information on this website, in the CLI, and in support conversations.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "Privacy" }],
  eyebrow: "COMPANY · PRIVACY",
  title: "Local by default.",
  titleAccent: "Clear about the rest.",
  description:
    "The CLI works from your repository and writes its artifacts under .jetic/. This page explains what the website and support conversations handle, and what stays on your machine.",
  primary: { label: "Contact us", href: "/contact" },
  secondary: { label: "Security", href: "/security" },
  chips: ["Local-first", "No selling", "Minimal collection", "Contact"],
  terminal: {
    title: "data boundaries",
    lines: [
      { kind: "ok", text: "local     model · workflows · runs" },
      { kind: "out", text: "website   pages · contact messages" },
      { kind: "out", text: "support   what you choose to send" },
      { kind: "blue", text: "never     sold to advertisers" },
    ],
    footer: "Last updated · October 22, 2026",
  },
  blocks: [
    {
      type: "prose",
      eyebrow: "PRIVACY",
      title: "What this page covers.",
      body: "This policy applies to the Jetic website, documentation, CLI, and support interactions.",
      sections: [
        {
          heading: "Information you provide",
          paragraphs: [
            "If you contact us, we receive the details you include: your name, email address, message, and any files or links you choose to share. If you create an account, we receive the account information you submit.",
            "Please do not send live credentials, customer data, or production secrets in a support message. Redact traces before sharing them.",
          ],
        },
        {
          heading: "Information handled automatically",
          paragraphs: [
            "Like most websites, the hosting infrastructure may process standard request information such as IP address, user agent, and the page requested, for delivery, security, and reliability.",
            "We aim to keep tracking minimal. If you need details about the cookies or analytics in use at a given time, contact us.",
          ],
        },
        {
          heading: "Local project data",
          paragraphs: [
            "The CLI reads your project to build the model and writes the model, workflows, and run artifacts under .jetic/. That data stays in your workspace unless you choose to commit, upload, or share it.",
            "Simulations send requests directly to the target environment you configure. They do not route your API traffic through a Jetic service.",
          ],
        },
        {
          heading: "Optional AI and MCP",
          paragraphs: [
            "You can connect an AI client over MCP to help author the model or workflows. When you do, the AI client's own terms and privacy policy apply to that conversation. The core scanner, validator, and runner do not require an AI provider.",
          ],
        },
      ],
    },
    {
      type: "specs",
      eyebrow: "HOW INFORMATION IS USED",
      title: "Purposes, not a data business.",
      rows: [
        { k: "Provide the service", v: "Respond to requests, operate the site and docs, and support the CLI." },
        { k: "Improve the product", v: "Understand which docs or workflows cause confusion, using aggregated or reported feedback." },
        { k: "Security", v: "Detect abuse, investigate incidents, and protect the service and its users." },
        { k: "Legal", v: "Comply with applicable law and enforce the terms of service." },
        { k: "No sale", v: "We do not sell personal information to advertisers or data brokers." },
      ],
    },
    {
      type: "prose",
      eyebrow: "CHOICES",
      title: "What you control.",
      sections: [
        {
          heading: "Sharing and retention",
          paragraphs: [
            "We share information with service providers that help operate the site and support, and when required by law. We keep support conversations and account information only as long as needed for the purpose they were collected for, or as required by law.",
          ],
        },
        {
          heading: "Your requests",
          paragraphs: [
            "You can ask to access, correct, or delete personal information we hold about you. Contact us with enough detail to identify the relevant records. We may need to verify the request before acting on it.",
          ],
        },
        {
          heading: "Children",
          paragraphs: [
            "Jetic is a developer tool and is not directed at children. Do not submit personal information about children through the site or support channels.",
          ],
        },
        {
          heading: "Changes",
          paragraphs: [
            "If this policy changes, the updated version will be posted here with a new date. Material changes will be communicated through the site or the contact channel you used.",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "RELATED",
      title: "The other policy pages.",
      items: [
        { tag: "Company", title: "Terms", body: "The terms that govern use of Jetic.", href: "/terms" },
        { tag: "Company", title: "Security", body: "Secret handling and vulnerability disclosure.", href: "/security" },
        { tag: "Resources", title: "Support", body: "What to include, and what to redact.", href: "/support" },
      ],
    },
  ],
};

export default function PrivacyPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Questions about data?",
        headlineItalic: "Ask directly.",
        body: "Tell us what you need to know and we will point to the relevant practice or record.",
        cta: "Contact us",
        href: "/contact",
      }}
    />
  );
}
