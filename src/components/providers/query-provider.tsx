"use client";

import * as React from "react";

/**
 * Minimal query-provider stand-in.
 * Swap for TanStack Query's QueryClientProvider when you add that dependency.
 */
const QueryContext = React.createContext({ mounted: true });

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const value = React.useMemo(() => ({ mounted: true }), []);
  return (
    <QueryContext.Provider value={value}>{children}</QueryContext.Provider>
  );
}

export function useQueryContext() {
  return React.useContext(QueryContext);
}
