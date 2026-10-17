export default function HowItWorksPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">How it works</h1>
      <ol className="flex flex-col gap-4">
        {[
          "Connect a repository and select a workspace.",
          "Configure environments without pasting secrets into the client.",
          "Create a simulation or ask the agent to draft one.",
          "Run, inspect, and replay until the integration is correct.",
        ].map((step, i) => (
          <li
            key={step}
            className="rounded-2xl border border-black/[.08] p-5 text-sm dark:border-white/[.08]"
          >
            <span className="font-semibold">Step {i + 1}. </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
