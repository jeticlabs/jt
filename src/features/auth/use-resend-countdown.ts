"use client";

import { useCallback, useEffect, useState } from "react";

const DEFAULT_COOLDOWN_SECONDS = 30;

/**
 * Countdown used to prevent immediate OTP resends. The timer is driven by a
 * deadline so it stays accurate even if the tab is backgrounded.
 */
export function useResendCountdown(seconds = DEFAULT_COOLDOWN_SECONDS) {
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (deadline === null) return;

    const update = () => {
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(next);
      if (next === 0) setDeadline(null);
    };

    update();
    const id = window.setInterval(update, 250);
    return () => window.clearInterval(id);
  }, [deadline]);

  const start = useCallback(() => {
    setRemaining(seconds);
    setDeadline(Date.now() + seconds * 1000);
  }, [seconds]);

  const reset = useCallback(() => {
    setDeadline(null);
    setRemaining(0);
  }, []);

  return {
    active: deadline !== null,
    remaining,
    label: `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`,
    start,
    reset,
  };
}
