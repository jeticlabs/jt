"use client";

import { useRouter } from "next/navigation";
import PromptComposer from "@/components/ui/prompt-composer";

/**
 * Landing-page prompt box, floating above the fold bottom.
 * Collected prompts funnel into sign-up; the backend owns
 * session creation from there.
 */
export function LandingComposer() {
  const router = useRouter();

  return (
    <PromptComposer
      placeholder="Describe the API flow you want to simulate…"
      submitLabel="Start building"
      secondaryLabel="Blank board"
      onSubmit={() => router.push("/sign-up")}
      onSecondaryAction={() => router.push("/app/onboarding")}
      footerItems={[
        { prefix: "Or", link: { label: "explore simulations", href: "/features" } },
        { link: { label: "read the docs", href: "/docs" } },
        {
          prefix: "already building?",
          link: { label: "open the dashboard", href: "/app/dashboard" },
        },
      ]}
    />
  );
}
