import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description:
    "How Jetic handles secrets, local project data, run artifacts, and vulnerability reports.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "Security" }],
  eyebrow: "COMPANY · SECURITY",
  title: "Keep secrets",
  titleAccent: "out of the artifacts.",
  description:
    "Jetic runs close to your code and your credentials, so the security model should be easy to state: local files, explicit secret references, redacted reports where possible, and a private path for disclosure.",
  primary: { label: "Report a vulnerability", href: "/contact" },
  secondary: { label: "Read the privacy page", href: "/privacy" },
  chips: ["Local-first", "Secret hygiene", "Private disclosure", "Reviewable"],
  terminal: {
    title: "security posture",
    lines: [
      { kind: "out", text: "model      plain JSON in the repository" },
      { kind: "out", text: "secrets    referenced, never committed" },
      { kind: "blue", text: "reports    redact raw credentials where possible" },
      { kind: "out", text: "network    requests go to your chosen target" },
      { kind: "ok", text: "disclosure private, not public" },
    ],
    footer: "Local-first by default",
  },
  blocks: [
    {
      type: "specs",
      eyebrow: "POSTURE",
      title: "What to expect.",
      rows: [
        { k: "Project data", v: "The model, workflows, memory, and run artifacts live under .jetic/ in your workspace. You control where they are committed or uploaded." },
        { k: "Credentials", v: "Environments should reference secrets from your runtime or CI secret store. Do not commit raw tokens or passwords." },
        { k: "Network", v: "Simulations send HTTP requests to the environment you select. They do not route your API traffic through a Jetic service." },
        { k: "AI providers", v: "The core scanner, verifier, validator, and runner are keyless. If you connect an agent, that client's data handling applies to the conversation." },
        { k: "Reports", v: "Jetic avoids writing raw secret values into reports where possible. Treat every run folder as sensitive and redact before sharing." },
        { k: "Certifications", v: "We do not claim certifications that have not been completed. Ask for the current status if you need it for procurement." },
      ],
    },
    {
      type: "features",
      eyebrow: "RECOMMENDATIONS",
      title: "A safe default setup.",
      items: [
        { title: "Disposable targets", body: "Run against local or a resettable staging environment, not shared production data.", tag: "Environment" },
        { title: "Secret references", body: "Keep values in the CI or shell secret store and reference them from the environment.", tag: "Secrets" },
        { title: "Review .jetic", body: "Treat model and workflow changes like source changes in the pull request.", tag: "Git" },
        { title: "Redact runs", body: "Remove tokens, cookies, and personal data before attaching a trace.", tag: "Sharing" },
        { title: "Least privilege", body: "Use a test account with only the permissions the workflow needs.", tag: "Auth" },
        { title: "Rotate test secrets", body: "Treat test credentials like any other credential and rotate them on a schedule.", tag: "Hygiene" },
      ],
    },
    {
      type: "prose",
      eyebrow: "DISCLOSURE",
      title: "Report privately.",
      body: "If you believe you have found a vulnerability, contact the team before discussing it publicly.",
      sections: [
        {
          heading: "What to include",
          bullets: [
            "A description of the issue and its impact",
            "Steps to reproduce or a minimal proof of concept",
            "The affected version or surface",
            "A safe way to contact you",
          ],
        },
        {
          heading: "What to avoid",
          bullets: [
            "Do not include real customer data or live credentials",
            "Do not open a public issue with exploit details",
            "Do not test against systems you do not own or have permission to test",
          ],
        },
        {
          heading: "What happens next",
          paragraphs: [
            "We will acknowledge the report, ask for any missing context, and keep you informed as we investigate. Please give us a reasonable window to address the issue before public disclosure.",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "RELATED",
      title: "The policy pages.",
      items: [
        { tag: "Company", title: "Privacy", body: "What this site and the CLI handle.", href: "/privacy" },
        { tag: "Company", title: "Terms", body: "The terms that govern use of the service.", href: "/terms" },
        { tag: "Resources", title: "Support", body: "Where non-security issues go.", href: "/support" },
      ],
    },
  ],
};

export default function SecurityPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "See something?",
        headlineItalic: "Tell us privately.",
        body: "Include reproduction steps and impact. Please do not include live customer data.",
        cta: "Contact the team",
        href: "/contact",
      }}
    />
  );
}
