"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type CountdownState = "idle" | "running" | "paused" | "completed" | "break";

interface UseCountdownTimerOptions {
  duration: number;
  onComplete?: () => void;
  breakDuration?: number;
}

interface UseCountdownTimerReturn {
  state: CountdownState;
  timeLeft: number;
  timeLeftRef: React.MutableRefObject<number>;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skipBreak: () => void;
}

export function useCountdownTimer({
  duration,
  onComplete,
  breakDuration,
}: UseCountdownTimerOptions): UseCountdownTimerReturn {
  const [state, setState] = useState<CountdownState>("idle");
  const [timeLeft, setTimeLeft] = useState(duration);
  const onCompleteRef = useRef(onComplete);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (state !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (breakDuration != null) {
            onCompleteRef.current?.();
            setState("break");
            setTimeLeft(breakDuration);
          } else {
            setState("completed");
            onCompleteRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state, breakDuration]);

  useEffect(() => {
    if (timeLeft === 0 && state === "break") {
      setState("idle");
      setTimeLeft(duration);
    }
  }, [timeLeft, state, duration]);

  const start = useCallback(() => setState("running"), []);
  const pause = useCallback(() => setState("paused"), []);
  const reset = useCallback(() => {
    setState("idle");
    setTimeLeft(duration);
  }, [duration]);

  const skipBreak = useCallback(() => {
    setState("idle");
    setTimeLeft(duration);
  }, [duration]);

  return { state, timeLeft, timeLeftRef, start, pause, reset, skipBreak };
}
