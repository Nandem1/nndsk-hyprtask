"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  Timer,
  Zap,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import type { Task } from "@/entities/task";
import { ProjectName } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import { useFocusSessions } from "@/entities/task";
import { EndSessionDialog } from "./EndSessionDialog";
import { RichText } from "./ConnectedRichText";
import { playSuccessSound } from "@/shared/lib/audio";
import {
  FOCUS_DURATION,
  BREAK_DURATION,
} from "../lib/focus-timer-constants";
import { FocusTimerCircle } from "./FocusTimerCircle";
import { BreakModeContent } from "./BreakModeContent";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { FullscreenTimerLayout } from "./FullscreenTimerLayout";
import { TimerControls } from "./TimerControls";

interface FocusModeProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToggleTask: () => void;
}

export function FocusMode({
  task,
  isOpen,
  onClose,
  onComplete,
  onToggleTask,
}: FocusModeProps) {
  const { themeClasses } = useThemeState();
  const { incrementSession, getStats } = useFocusSessions();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleFocusComplete = useCallback(() => {
    incrementSession(FOCUS_DURATION / 60);
    if (soundEnabled) {
      playSuccessSound();
    }
    setShowCelebration(true);
  }, [soundEnabled, incrementSession]);

  const {
    timerState,
    timeLeft,
    timeLeftRef,
    startTimer,
    pauseTimer,
    resetTimer,
    skipBreak,
  } = useFocusTimer({
    focusDuration: FOCUS_DURATION,
    breakDuration: BREAK_DURATION,
    onFocusComplete: handleFocusComplete,
  });

  const { sessionsToday, totalMinutesToday } = getStats();

  const totalTime = timerState === "break" ? BREAK_DURATION : FOCUS_DURATION;

  useEffect(() => {
    if (isOpen) {
      resetTimer();
      setShowCelebration(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const handleConfirmComplete = () => {
    const elapsedMinutes = Math.round(
      (FOCUS_DURATION - timeLeftRef.current) / 60,
    );
    if (elapsedMinutes > 0) {
      incrementSession(elapsedMinutes);
    }
    if (soundEnabled) {
      playSuccessSound();
    }
    onToggleTask();
    onComplete();
    setShowEndDialog(false);
  };

  const handleConfirmClose = () => {
    const elapsedMinutes = Math.round(
      (FOCUS_DURATION - timeLeftRef.current) / 60,
    );
    if (elapsedMinutes > 0) {
      incrementSession(elapsedMinutes);
    }
    onComplete();
    setShowEndDialog(false);
  };

  const statusText =
    timerState === "running"
      ? "En foco"
      : timerState === "break"
        ? "Descanso"
        : "Listo para empezar";

  const statusColor =
    timerState === "running"
      ? "primary"
      : timerState === "break"
        ? "accent"
        : "muted";

  return (
    <>
      <FullscreenTimerLayout
        isOpen={isOpen}
        onClose={onClose}
        themeClasses={themeClasses}
        statusText={statusText}
        statusColor={statusColor}
        isPulsing={timerState === "running"}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        showParticles={showParticles}
        onParticlesToggle={() => setShowParticles(!showParticles)}
        footerContent={
          <div className="flex items-center justify-center gap-2">
            <Zap className="size-4" />
            <span>
              {timerState === "running"
                ? "Modo foco activado. Una tarea a la vez."
                : "Elige una tarea y enfocate en ella."}
            </span>
          </div>
        }
      >
        {timerState === "break" ? (
          <BreakModeContent
            timeLeft={timeLeft}
            sessionsToday={sessionsToday}
            themeClasses={themeClasses}
            onSkipBreak={skipBreak}
          />
        ) : (
          <div className="flex flex-col gap-8 w-full max-w-2xl">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Trabajando en
              </p>
              <RichText
                text={task.title}
                inline
                emoteSize="2x"
                className={cn(
                  "text-3xl md:text-4xl font-bold",
                  themeClasses.textPrimary,
                )}
              />
              {task.projectId ? (
                <ProjectName projectId={task.projectId} />
              ) : null}
            </div>

            <FocusTimerCircle
              timeLeft={timeLeft}
              timerState={timerState}
              themeClasses={themeClasses}
              showCelebration={showCelebration}
              totalTime={totalTime}
            />

            <TimerControls
              state={timerState}
              onPlay={startTimer}
              onPause={pauseTimer}
              onReset={resetTimer}
            />

            <div className="flex items-center justify-center gap-3 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEndDialog(true)}
                  className={cn(
                    "border-primary/30 hover:bg-primary/10 gap-2",
                    themeClasses.textPrimary,
                  )}
                >
                  <Check className="size-4" />
                  Completar tarea
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEndDialog(true)}
                  className="gap-2"
                >
                  <Timer className="size-4" />
                  Terminar sesion
                </Button>
              </motion.div>
            </div>

            <div className="flex items-center justify-center gap-8 pt-4 text-center">
              <div>
                <motion.div
                  className="text-2xl font-bold"
                  key={sessionsToday}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                >
                  {sessionsToday}
                </motion.div>
                <div className="text-xs text-muted-foreground">
                  sesiones hoy
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {totalMinutesToday}m
                </div>
                <div className="text-xs text-muted-foreground">
                  tiempo enfocado
                </div>
              </div>
            </div>
          </div>
        )}
      </FullscreenTimerLayout>

      {showEndDialog && (
        <EndSessionDialog
          isOpen={showEndDialog}
          onClose={() => setShowEndDialog(false)}
          onCompleteTask={handleConfirmComplete}
          onJustClose={handleConfirmClose}
          taskTitle={task.title}
        />
      )}
    </>
  );
}
