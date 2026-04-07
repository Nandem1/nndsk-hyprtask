"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

interface UseLeaderKeyOptions {
  leaderKey: string;
  timeout?: number;
  enabled?: boolean;
}

interface UseLeaderKeyResult {
  leaderActive: boolean;
  resetLeader: () => void;
}

/**
 * Vim-style leader key. Returns `leaderActive` — when true, register follow-up
 * hotkeys with `{ enabled: leaderActive }` and call `resetLeader()` after handling.
 *
 * Example:
 *   const { leaderActive, resetLeader } = useLeaderKey({ leaderKey: "g" });
 *   useHotkeys("h", () => { resetLeader(); router.push("/tasks"); }, { enabled: leaderActive });
 */
export function useLeaderKey({
  leaderKey,
  timeout = 800,
  enabled = true,
}: UseLeaderKeyOptions): UseLeaderKeyResult {
  const [leaderActive, setLeaderActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetLeader = useCallback(() => {
    setLeaderActive(false);
    clearTimer();
  }, [clearTimer]);

  useHotkeys(
    leaderKey,
    (e) => {
      e.preventDefault();
      clearTimer();
      setLeaderActive(true);
      timerRef.current = setTimeout(resetLeader, timeout);
    },
    { enabled: enabled && !leaderActive },
    [enabled, leaderActive, timeout, resetLeader, clearTimer],
  );

  // Cancel on Escape while waiting
  useHotkeys(
    "Escape",
    () => resetLeader(),
    { enabled: leaderActive },
    [leaderActive, resetLeader],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  return { leaderActive, resetLeader };
}
