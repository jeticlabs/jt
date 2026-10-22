import { MarketingLanding, type PageDefinition } from "@/components/marketing-ui";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Share workflows, report what broke, and shape the direction of Jetic. The project grows through the journeys teams actually run.",
};

const page: PageDefinition = {
  crumbs: [{ label: "Jetic", href: "/" }, { label: "Resources" }, { label: "Community" }],
  eyebrow: "RESOURCES · COMMUNITY",
  title: "Built with",
  titleAccent: "the people who run it.",
  description:
    "Jetic is shaped by the API journeys teams bring to it. The most useful contributions are not feature requests in the abstract; they are the workflow that almost worked and the step where it failed.",
  primary: { label: "Talk to the team", href: "/contact" },
  secondary: { label: "See the roadmap", href: "/roadmap" },
  chips: ["Feedback", "Patterns", "Roadmap", "Support"],
  terminal: {
    title: "what helps most",
    lines: [
      { kind: "out", text: "the workflow file that failed" },
      { kind: "out", text: "the step and the expected status" },
      { kind: "out", text: "the trace, with secrets removed" },
      { kind: "blue", text: "the context: stack, target, version" },
      { kind: "ok", text: "→ a fix that helps the next team too" },
    ],
    footer: "Concrete behavior beats abstract feedback",
  },
  blocks: [
    {
      type: "features",
      eyebrow: "WAYS TO PARTICIPATE",
      title: "Contribute the thing you already have.",
      body: "You do not need a new demo. The work you are doing is the contribution.",
      items: [
        { title: "Share a pattern", body: "A workflow shape that solved a real problem for your API.", tag: "Patterns" },
        { title: "Report a gap", body: "An endpoint, auth scheme, or stack detail the model gets wrong.", tag: "Model" },
        { title: "Improve a guide", body: "A step that was unclear, or an example that would have helped.", tag: "Docs" },
        { title: "Request a capability", body: "Describe the job to be done, not only the feature name.", tag: "Roadmap" },
        { title: "Review a comparison", body: "Correct a claim about a tool you know better than we do.", tag: "Accuracy" },
        { title: "Help another team", body: "Answer a question in the open with the workflow that worked.", tag: "Support" },
      ],
    },
    {
      type: "prose",
      eyebrow: "HOW WE WORK",
      title: "Small, reviewable, honest.",
      body: "These principles apply to the product and to the community around it.",
      sections: [
        {
          heading: "Show the run",
          paragraphs: [
            "A bug report with a trace is worth ten descriptions. A feature request with a failing workflow is a design conversation with a concrete starting point.",
          ],
        },
        {
          heading: "Keep secrets out",
          paragraphs: [
            "Remove tokens, cookies, and personal data before sharing a workflow or a run. Redaction is built into reports where possible, but the final check is human.",
          ],
        },
        {
          heading: "Disagree with evidence",
          bullets: [
            "Point to the endpoint or source line",
            "Include the expected and actual behavior",
            "Say which environment and version you used",
            "Separate the bug from the workaround",
          ],
        },
      ],
    },
    {
      type: "specs",
      eyebrow: "WHERE THINGS GO",
      title: "The right channel for the job.",
      rows: [
        { k: "A bug", v: "Support with the workflow, trace, version, and target. Remove secrets first." },
        { k: "A product idea", v: "Contact or the roadmap discussion. Describe the job and the current workaround." },
        { k: "A docs fix", v: "Point to the page and the step that misled you. Small corrections are welcome." },
        { k: "A security issue", v: "Report it privately through the security page rather than a public thread." },
      ],
    },
    {
      type: "related",
      eyebrow: "NEXT",
      title: "Keep the loop open.",
      items: [
        { tag: "Company", title: "Roadmap", body: "What is planned and what is being considered.", href: "/roadmap" },
        { tag: "Resources", title: "Support", body: "How to get unblocked quickly.", href: "/support" },
        { tag: "Company", title: "Security", body: "How to report a vulnerability responsibly.", href: "/security" },
      ],
    },
    {
      type: "faq",
      eyebrow: "COMMUNITY FAQ",
      items: [
        { q: "Is there a chat server?", a: "The public community spaces are still forming. Contact is the reliable path today, and the roadmap page shows what is planned." },
        { q: "Can I share a workflow publicly?", a: "Yes, after removing secrets and any customer data. Workflows are plain files and easy to redact." },
        { q: "Do you accept docs contributions?", a: "Corrections and concrete examples are welcome. Start with the page and the confusion it caused." },
        { q: "How do I report a security issue?", a: "Use the security page and report privately. Do not open a public issue with exploit details." },
      ],
    },
  ],
};

export default function CommunityPage() {
  return (
    <MarketingLanding
      page={page}
      cta={{
        headline: "Bring the journey.",
        headlineItalic: "We will meet it.",
        body: "Share the workflow that should work, the trace that says otherwise, and the context around it.",
        cta: "Contact the team",
        href: "/contact",
      }}
    />
  );
}
