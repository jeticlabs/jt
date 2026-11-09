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
    const params = new URLSearchParams(window.location.search);
    const justConnected = params.get("github") === "connected";
    if (justConnected) {
      params.delete("github");
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`,
      );
    }

    void useUserStore.getState().load({ force: justConnected });

    const refresh = () => {
      void useUserStore.getState().refreshGithub();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <>{children}</>;
}
