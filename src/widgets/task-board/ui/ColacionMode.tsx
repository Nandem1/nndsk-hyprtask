"use client";

import { useEffect, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import {
  UtensilsCrossed,
} from "lucide-react";
import { useTheme } from "@/store/hooks";
import { useWorkSettings } from "@/entities/work";
import { playSuccessSound } from "@/shared/lib/audio";
import { useCountdownTimer } from "@/shared/hooks/use-countdown-timer";
import { useFullscreenTimerState } from "../hooks/useFullscreenTimerState";
import { FocusTimerCircle } from "./FocusTimerCircle";
import { FullscreenTimerLayout } from "./FullscreenTimerLayout";
import { TimerControls } from "./TimerControls";

interface ColacionModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColacionMode({ isOpen, onClose }: ColacionModeProps) {
  const { themeClasses } = useTheme();
  const { data: settings } = useWorkSettings();
  const {
    soundEnabled,
    setSoundEnabled,
    showParticles,
    setShowParticles,
    showCelebration,
    setShowCelebration,
  } = useFullscreenTimerState();

  const breakDurationSeconds = (settings?.breakDuration ?? 30) * 60;

  const handleComplete = useCallback(() => {
    if (soundEnabled) playSuccessSound();
    setShowCelebration(true);
  }, [soundEnabled, setShowCelebration]);

  useEffect(() => {
    if (showCelebration) {
      const t = setTimeout(onClose, 2000);
      return () => clearTimeout(t);
    }
  }, [showCelebration, onClose]);

  const {
    state: timerState,
    timeLeft,
    start,
    pause,
    reset,
  } = useCountdownTimer({
    duration: breakDurationSeconds,
    onComplete: handleComplete,
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowCelebration(false);
    }
  }, [isOpen, reset, setShowCelebration]);

  const statusText =
    timerState === "running"
      ? "En colacion"
      : timerState === "completed"
        ? "Colacion terminada"
        : "Listo para colacion";

  const statusColor =
    timerState === "running"
      ? "primary"
      : timerState === "completed"
        ? "green"
        : "muted";

  const isPulsing = timerState === "running";

  return (
    <FullscreenTimerLayout
      isOpen={isOpen}
      onClose={onClose}
      themeClasses={themeClasses}
      statusText={statusText}
      statusColor={statusColor}
      isPulsing={isPulsing}
      soundEnabled={soundEnabled}
      onSoundToggle={() => setSoundEnabled(!soundEnabled)}
      showParticles={showParticles}
      onParticlesToggle={() => setShowParticles(!showParticles)}
      footerContent={
        <div className="flex items-center justify-center gap-2">
          <UtensilsCrossed className="size-4" />
          <span>
            {timerState === "running"
              ? "Disfruta tu colacion."
              : "Cuando inicies tu colacion, el timer comenzara."}
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-8 w-full max-w-2xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UtensilsCrossed
              className={cn("size-5", themeClasses.textPrimary)}
            />
            <p className="text-sm text-muted-foreground">Colacion</p>
          </div>
          <h1
            className={cn(
              "text-3xl md:text-4xl font-bold",
              themeClasses.textPrimary,
            )}
          >
            {settings?.breakDuration ?? 30} minutos
          </h1>
        </div>

        <FocusTimerCircle
          timeLeft={timeLeft}
          timerState={
            timerState === "completed"
              ? "idle"
              : timerState === "running"
                ? "running"
                : timerState
          }
          themeClasses={themeClasses}
          showCelebration={showCelebration}
          totalTime={breakDurationSeconds}
        />

        <TimerControls
          state={timerState}
          onPlay={start}
          onPause={pause}
          onReset={reset}
        />
      </div>
    </FullscreenTimerLayout>
  );
}
