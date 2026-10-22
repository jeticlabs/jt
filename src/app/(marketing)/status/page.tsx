import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Status",
  description:
    "The current high-level status of the Jetic website, documentation, CLI distribution, and MCP integration.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "Status" }],
  eyebrow: "COMPANY · STATUS",
  title: "All systems",
  titleAccent: "operational.",
  description:
    "A high-level view of the surfaces Jetic operates. Your simulations themselves depend on the target environment you choose, which is outside this status page.",
  primary: { label: "Report an issue", href: "/contact" },
  secondary: { label: "Visit support", href: "/support" },
  chips: ["Website", "Docs", "CLI", "MCP"],
  terminal: {
    title: "current state",
    lines: [
      { kind: "ok", text: "✔ website            operational" },
      { kind: "ok", text: "✔ documentation      operational" },
      { kind: "ok", text: "✔ CLI distribution   operational" },
      { kind: "ok", text: "✔ MCP integration    operational" },
      { kind: "dim", text: "– simulation targets  customer-controlled" },
    ],
    footer: "High-level status · not a live probe",
  },
  blocks: [
    {
      type: "table",
      eyebrow: "COMPONENTS",
      title: "What this page covers.",
      body: "The status below is a high-level summary. It is not a per-request health check of your own API.",
      head: ["Component", "State", "Notes"],
      rows: [
        ["Website", "Operational", "Marketing pages, account entry points, and contact."],
        ["Documentation", "Operational", "Guides, reference pages, and search."],
        ["CLI distribution", "Operational", "Installation and package availability."],
        ["MCP integration", "Operational", "Tool access for connected agent clients."],
        ["Simulation targets", "Your environment", "Jetic cannot report on a server it does not operate."],
      ],
    },
    {
      type: "steps",
      eyebrow: "IF SOMETHING FAILS",
      title: "Separate the service from the target.",
      items: [
        { title: "Check the target", body: "Confirm the API environment is running and reachable.", cmd: "curl <baseUrl>" },
        { title: "Check the run", body: "Open the trace; a transport error looks different from a 4xx step.", cmd: "jetic dev" },
        { title: "Check the docs", body: "Confirm setup, version, and command syntax are current.", cmd: "/docs" },
        { title: "Tell us", body: "Send the trace and context if the issue is on the Jetic side.", cmd: "/contact" },
      ],
    },
    {
      type: "prose",
      eyebrow: "NOTES",
      title: "What this page does not do.",
      body: "Keep expectations aligned with what is actually being reported.",
      sections: [
        {
          heading: "No fake precision",
          paragraphs: [
            "This is a high-level summary, not a live monitoring dashboard. It does not publish invented uptime percentages or per-region latency.",
          ],
        },
        {
          heading: "Your API is yours",
          paragraphs: [
            "A failed simulation usually means the target returned an unexpected response, not that Jetic is down. The trace distinguishes the two.",
          ],
        },
        {
          heading: "Incidents",
          paragraphs: [
            "If an issue affects the surfaces above, contact the team with the time, surface, and a description. Security issues should follow the private disclosure process.",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Get back to the work.",
      items: [
        { tag: "Resources", title: "Support", body: "What to include in a report.", href: "/support" },
        { tag: "Company", title: "Security", body: "Report a vulnerability privately.", href: "/security" },
        { tag: "Docs", title: "CLI reference", body: "Check command syntax and exit behavior.", href: "/docs/reference/cli-reference" },
      ],
    },
  ],
};

export default function StatusPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Still blocked?",
        headlineItalic: "Send the trace.",
        body: "Include the target, version, command, and run folder, with secrets removed.",
        cta: "Contact support",
        href: "/contact",
      }}
    />
  );
}
