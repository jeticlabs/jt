import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern use of the Jetic website, CLI, documentation, and related services.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Company" }, { label: "Terms of Service" }],
  eyebrow: "COMPANY · TERMS",
  title: "A clear",
  titleAccent: "working agreement.",
  description:
    "These terms govern your use of the Jetic website, documentation, CLI, and related services. By using them, you agree to the terms below. If you use Jetic on behalf of an organization, you confirm you have authority to accept them.",
  primary: { label: "Contact us", href: "/contact" },
  secondary: { label: "Read the privacy page", href: "/privacy" },
  chips: ["Acceptable use", "Your content", "No warranty", "Changes"],
  terminal: {
    title: "terms at a glance",
    lines: [
      { kind: "out", text: "use        lawful, authorized testing only" },
      { kind: "out", text: "content    you keep ownership" },
      { kind: "blue", text: "software   provided as is" },
      { kind: "out", text: "changes    posted with a new date" },
      { kind: "ok", text: "questions  contact the team" },
    ],
    footer: "Last updated · October 22, 2026",
  },
  blocks: [
    {
      type: "prose",
      eyebrow: "THE TERMS",
      title: "What you can expect from us.",
      body: "A short set of rules for using the product and the site.",
      sections: [
        {
          heading: "The service",
          paragraphs: [
            "Jetic provides a CLI, a local Studio, documentation, and related tooling for modeling and simulating API behavior. Features may change, and some capabilities may be marked experimental.",
            "You are responsible for the environments you target and for having permission to send requests to them.",
          ],
        },
        {
          heading: "Acceptable use",
          bullets: [
            "Test only systems you own or are authorized to test",
            "Do not use the service to attack, overload, or disrupt a system",
            "Do not attempt to access data or accounts you are not permitted to access",
            "Do not reverse engineer the service except as allowed by law",
            "Do not resell or redistribute the service without permission",
          ],
        },
        {
          heading: "Your content",
          paragraphs: [
            "You keep ownership of the models, workflows, code, and other materials you create. You grant us the limited rights needed to provide the service, such as processing a support request or a file you choose to share.",
            "You are responsible for ensuring you have the rights to the content you submit and for removing secrets before sharing artifacts.",
          ],
        },
        {
          heading: "Our content",
          paragraphs: [
            "The Jetic name, branding, documentation, and software are protected by intellectual property laws. These terms do not grant you ownership of them. Open-source components remain subject to their own licenses.",
          ],
        },
      ],
    },
    {
      type: "specs",
      eyebrow: "DISCLAIMERS",
      title: "The practical limits.",
      rows: [
        { k: "As is", v: "The service is provided on an \"as is\" and \"as available\" basis without warranties of any kind, to the extent permitted by law." },
        { k: "No guarantee", v: "A passing workflow is evidence about the behavior observed, not a guarantee that the API is free of defects." },
        { k: "Your responsibility", v: "You are responsible for the data, credentials, and environments you use with Jetic." },
        { k: "Limitation", v: "To the extent permitted by law, we are not liable for indirect, incidental, special, or consequential damages, or for lost profits or data." },
        { k: "Termination", v: "We may suspend or end access if these terms are violated or if needed to protect the service." },
      ],
    },
    {
      type: "prose",
      eyebrow: "THE REST",
      title: "Changes and contact.",
      sections: [
        {
          heading: "Changes to the terms",
          paragraphs: [
            "We may update these terms as the product evolves. The updated version will be posted here with a new date. Continued use after a change means you accept the revised terms.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the laws applicable to the entity operating Jetic, without regard to conflict-of-law rules. Any dispute will be handled in the courts with jurisdiction over that entity, unless applicable law requires otherwise.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Questions about these terms can be sent through the contact page. For security issues, use the private process on the security page instead of a public message.",
          ],
        },
      ],
    },
    {
      type: "related",
      eyebrow: "RELATED",
      title: "The other policy pages.",
      items: [
        { tag: "Company", title: "Privacy", body: "How information is handled.", href: "/privacy" },
        { tag: "Company", title: "Security", body: "Secret handling and disclosure.", href: "/security" },
        { tag: "Resources", title: "Contact", body: "Reach the team with a question.", href: "/contact" },
      ],
    },
  ],
};

export default function TermsPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Still unsure?",
        headlineItalic: "Ask first.",
        body: "If a use case is not clearly covered by these terms, contact the team before relying on it.",
        cta: "Contact us",
        href: "/contact",
      }}
    />
  );
}
