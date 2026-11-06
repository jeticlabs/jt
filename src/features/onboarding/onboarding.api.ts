import type { OnboardingResponse, Plan, SlugAvailability } from "@/features/workspace/types";
import { apiFetch } from "@/lib/api/browser";

export interface CompleteOnboardingInput {
  readonly plan: Plan;
  readonly name: string;
  readonly slug: string;
}

export function checkSlugAvailability(
  slug: string,
  signal?: AbortSignal,
): Promise<SlugAvailability> {
  return apiFetch<SlugAvailability>(
    `/v1/onboarding/slug/${encodeURIComponent(slug)}`,
    { signal },
  );
}

export function completeOnboarding(
  input: CompleteOnboardingInput,
): Promise<OnboardingResponse> {
  return apiFetch<OnboardingResponse>("/v1/onboarding", {
    method: "POST",
    body: input,
  });
}
