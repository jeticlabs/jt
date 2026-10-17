"use client";

import * as React from "react";

function subscribe() {
  return () => {};
}

/** Example of a genuinely shared hook. Feature-specific hooks stay in features/. */
export function useMounted(): boolean {
  return React.useSyncExternalStore(subscribe, () => true, () => false);
}
