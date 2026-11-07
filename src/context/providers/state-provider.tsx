"use client";

import { useEffect, type ReactNode } from "react";

import { useUserStore } from "../stores/user-store";

/**
 * Hydrates the shared client stores once per product session. Server layouts
 * already verified the session; this fetch supplies the extra fields (GitHub
 * identity, password state) the toolbar and sandbox wizard need.
 */
export function StateProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useUserStore.getState().load();
  }, []);

  return <>{children}</>;
}
