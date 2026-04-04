"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export type TimerState = "idle" | "running" | "paused" | "break";

interface UseFocusTimerOptions {
  focusDuration: number;
  breakDuration: number;
  /** Llamado cuando el temporizador de foco llega a cero (antes de entrar en break) */
  onFocusComplete: () => void;
}

interface UseFocusTimerReturn {
  timerState: TimerState;
  timeLeft: number;
  /** Ref con el valor actual de timeLeft — útil en callbacks memoizados */
  timeLeftRef: React.MutableRefObject<number>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipBreak: () => void;
}

/**
 * Gestiona el estado y la lógica del temporizador Pomodoro.
 * Separa la lógica de timer de los efectos secundarios de UI (sonido, celebración, sesiones).
 * Al terminar el foco, llama onFocusComplete y transiciona automáticamente a break.
 */
export function useFocusTimer({
  focusDuration,
  breakDuration,
  onFocusComplete,
}: UseFocusTimerOptions): UseFocusTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [timeLeft, setTimeLeft] = useState(focusDuration);

  const timeLeftRef = useRef(timeLeft);
  const timerStateRef = useRef(timerState);
  const onFocusCompleteRef = useRef(onFocusComplete);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  useEffect(() => {
    onFocusCompleteRef.current = onFocusComplete;
  }, [onFocusComplete]);

  // Intervalo de cuenta atrás
  useEffect(() => {
    if (timerState !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerStateRef.current === "running") {
            // Efectos secundarios (sonido, celebración, sesiones)
            onFocusCompleteRef.current();
            // Transición automática a break
            setTimerState("break");
            setTimeLeft(breakDuration);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState, breakDuration]);

  // Al terminar el descanso, volver a idle
  useEffect(() => {
    if (timeLeft === 0 && timerState === "break") {
      setTimerState("idle");
      setTimeLeft(focusDuration);
    }
  }, [timeLeft, timerState, focusDuration]);

  const startTimer = useCallback(() => setTimerState("running"), []);
  const pauseTimer = useCallback(() => setTimerState("paused"), []);

  const resetTimer = useCallback(() => {
    setTimerState("idle");
    setTimeLeft(focusDuration);
  }, [focusDuration]);

  const skipBreak = useCallback(() => {
    setTimerState("idle");
    setTimeLeft(focusDuration);
  }, [focusDuration]);

  return {
    timerState,
    timeLeft,
    timeLeftRef,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
  };
}
