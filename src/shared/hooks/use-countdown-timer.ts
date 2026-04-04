"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type CountdownState = "idle" | "running" | "paused" | "completed";

interface UseCountdownTimerOptions {
  duration: number;
  onComplete?: () => void;
}

interface UseCountdownTimerReturn {
  state: CountdownState;
  timeLeft: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export function useCountdownTimer({
  duration,
  onComplete,
}: UseCountdownTimerOptions): UseCountdownTimerReturn {
  const [state, setState] = useState<CountdownState>("idle");
  const [timeLeft, setTimeLeft] = useState(duration);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (timeLeft !== 0 || state !== "running") return;

    setState("completed");
    onCompleteRef.current?.();
  }, [timeLeft, state]);

  useEffect(() => {
    if (state !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [state]);

  const start = useCallback(() => setState("running"), []);
  const pause = useCallback(() => setState("paused"), []);
  const reset = useCallback(() => {
    setState("idle");
    setTimeLeft(duration);
  }, [duration]);

  return { state, timeLeft, start, pause, reset };
}
