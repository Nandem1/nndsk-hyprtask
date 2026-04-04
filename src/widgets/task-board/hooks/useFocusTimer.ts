"use client";

import { useCountdownTimer } from "@/shared/hooks/use-countdown-timer";
import type { CountdownState } from "@/shared/hooks/use-countdown-timer";

export type TimerState = CountdownState;

interface UseFocusTimerOptions {
  focusDuration: number;
  breakDuration: number;
  onFocusComplete: () => void;
}

interface UseFocusTimerReturn {
  timerState: CountdownState;
  timeLeft: number;
  timeLeftRef: React.MutableRefObject<number>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipBreak: () => void;
}

export function useFocusTimer({
  focusDuration,
  breakDuration,
  onFocusComplete,
}: UseFocusTimerOptions): UseFocusTimerReturn {
  const { state, timeLeft, timeLeftRef, start, pause, reset, skipBreak } =
    useCountdownTimer({
      duration: focusDuration,
      breakDuration,
      onComplete: onFocusComplete,
    });

  return {
    timerState: state,
    timeLeft,
    timeLeftRef,
    startTimer: start,
    pauseTimer: pause,
    resetTimer: reset,
    skipBreak,
  };
}
