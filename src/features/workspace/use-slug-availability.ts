"use client";

import { useEffect, useState } from "react";

import type { SlugAvailability } from "@/features/workspace/types";
import { isValidSlug } from "@/features/workspace/slug";
import { checkSlugAvailability } from "@/features/onboarding/onboarding.api";

export type SlugStatus = "idle" | "invalid" | "checking" | "available" | "taken" | "error";

export interface SlugAvailabilityState {
  readonly slug: string;
  readonly status: SlugStatus;
}

const IDLE: SlugAvailabilityState = { slug: "", status: "idle" };

/**
 * Debounced slug availability lookup. Responses are ignored when the input
 * changes or the component unmounts, so a slow request can never overwrite a
 * newer result.
 */
export function useSlugAvailability(slug: string): SlugAvailabilityState {
  const [state, setState] = useState<SlugAvailabilityState>(IDLE);

  useEffect(() => {
    if (slug.length === 0) {
      setState({ slug, status: "idle" });
      return;
    }

    if (!isValidSlug(slug)) {
      setState({ slug, status: "invalid" });
      return;
    }

    const controller = new AbortController();
    setState({ slug, status: "checking" });

    const timer = window.setTimeout(() => {
      checkSlugAvailability(slug, controller.signal)
        .then((result: SlugAvailability) => {
          if (!controller.signal.aborted) {
            setState({ slug, status: result.available ? "available" : "taken" });
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setState({ slug, status: "error" });
          }
        });
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [slug]);

  return state;
}
