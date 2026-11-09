import { QueryClient } from "@tanstack/react-query";

import { BrowserApiError } from "@/lib/api/browser";

/**
 * One QueryClient per browser session. Creating it lazily in the provider
 * keeps cache entries alive across client-side route changes while avoiding
 * cross-request state on the server.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 10 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (
            error instanceof BrowserApiError &&
            error.status >= 400 &&
            error.status < 500
          ) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
