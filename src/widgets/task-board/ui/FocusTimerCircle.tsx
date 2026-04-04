"use client";

import { memo, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { CIRCLE_CIRCUMFERENCE, formatTime } from "../lib/focus-timer-constants";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import { CelebrationEffect } from "@/shared/ui/celebration-effect";

interface FocusTimerCircleProps {
  timeLeft: number;
  timerState: "idle" | "running" | "paused" | "break" | "completed";
  themeClasses: ExtendedThemeClasses;
  showCelebration: boolean;
  totalTime: number;
}

export const FocusTimerCircle = memo(function FocusTimerCircle({
  timeLeft,
  timerState,
  themeClasses,
  showCelebration,
  totalTime,
}: FocusTimerCircleProps) {
  const shouldReduceMotion = useReducedMotion();
  const circleRef = useRef<SVGCircleElement>(null);
  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!circleRef.current || shouldReduceMotion) return;

    const targetProgress = ((totalTime - timeLeft) / totalTime) * 100;

    const animateCircle = () => {
      const now = Date.now();
      lastTimeRef.current = now;

      const diff = targetProgress - progressRef.current;
      if (Math.abs(diff) > 0.1) {
        progressRef.current += diff * 0.1;

        if (circleRef.current) {
          const offset = CIRCLE_CIRCUMFERENCE * (1 - progressRef.current / 100);
          circleRef.current.style.strokeDashoffset = String(offset);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animateCircle);
    };

    lastTimeRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(animateCircle);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [timeLeft, timerState, shouldReduceMotion, totalTime]);

  return (
    <div className="relative size-72 mx-auto">
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-white/5 dark:bg-black/10",
          "border border-white/10 dark:border-white/5",
          "shadow-2xl",
        )}
      />

      <CelebrationEffect
        show={showCelebration}
        mode="radial"
        count={8}
        distance={100}
        size="md"
        duration={0.8}
      />

      <svg className="size-full -rotate-90 relative z-10" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-muted/20"
        />
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={CIRCLE_CIRCUMFERENCE}
          className={cn(
            timerState === "running"
              ? themeClasses.textPrimary
              : "text-muted-foreground",
          )}
          style={{
            transition: shouldReduceMotion ? undefined : "none",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <span className="text-6xl font-mono font-bold">
          {formatTime(timeLeft)}
        </span>
        <span className="text-muted-foreground mt-2">
          {timerState === "paused" ? "Pausado" : "Restante"}
        </span>
      </div>
    </div>
  );
});
