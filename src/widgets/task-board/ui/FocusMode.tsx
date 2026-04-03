"use client";

import { useState, useEffect, useCallback, useRef, memo } from "react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  Timer,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import type { Task } from "@/entities/task";
import { useProjectInfo } from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { ParticlesBackground } from "@/shared/components/particles-background";
import { useFocusSessions } from "@/entities/task";
import { EndSessionDialog } from "./EndSessionDialog";
import { playSuccessSound } from "@/shared/lib/audio";
import {
  FOCUS_DURATION,
  BREAK_DURATION,
  containerVariants,
  contentVariants,
  timerModeVariants,
} from "../lib/focus-timer-constants";
import { FocusTimerCircle } from "./FocusTimerCircle";
import { BreakModeContent } from "./BreakModeContent";

interface FocusModeProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToggleTask: () => void;
}

const ProjectName = memo(function ProjectName({ projectId }: { projectId: string }) {
  const { name } = useProjectInfo(projectId);
  return <p className="text-muted-foreground mt-2">{name}</p>;
});

export function FocusMode({
  task,
  isOpen,
  onClose,
  onComplete,
  onToggleTask,
}: FocusModeProps) {
  const { themeClasses } = useThemeState();
  const shouldReduceMotion = useReducedMotion();
  const { incrementSession, getStats } = useFocusSessions();
  const [timerState, setTimerState] = useState<
    "idle" | "running" | "paused" | "break"
  >("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const timeLeftRef = useRef(timeLeft);
  const timerStateRef = useRef(timerState);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);

  const { sessionsToday, totalMinutesToday } = getStats();

  const totalTime = timerState === "break" ? BREAK_DURATION : FOCUS_DURATION;

  const handleSessionComplete = useCallback(() => {
    incrementSession(FOCUS_DURATION / 60);
    if (soundEnabled) {
      playSuccessSound();
    }
    setShowCelebration(true);
    setTimerState("break");
    setTimeLeft(BREAK_DURATION);
  }, [soundEnabled, incrementSession]);

  useEffect(() => {
    if (timerState !== "running") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerStateRef.current === "running") {
            handleSessionComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerState, handleSessionComplete]);

  useEffect(() => {
    if (timeLeft === 0 && timerState === "break") {
      setTimerState("idle");
      setTimeLeft(FOCUS_DURATION);
    }
  }, [timeLeft, timerState]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimerState("idle");
      setTimeLeft(FOCUS_DURATION);
      setShowCelebration(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  const startTimer = () => setTimerState("running");
  const pauseTimer = () => setTimerState("paused");
  const resetTimer = () => {
    setTimerState("idle");
    setTimeLeft(FOCUS_DURATION);
  };
  const skipBreak = () => {
    setTimerState("idle");
    setTimeLeft(FOCUS_DURATION);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleEndSessionClick = () => setShowEndDialog(true);

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

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="focus-mode"
            variants={shouldReduceMotion ? undefined : containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <motion.div
              variants={shouldReduceMotion ? undefined : contentVariants}
              className="flex items-center justify-between p-4 border-b border-border"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale:
                      timerState === "running" ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 1,
                    repeat: timerState === "running" ? Infinity : 0,
                  }}
                  className={cn(
                    "size-3 rounded-full",
                    timerState === "running"
                      ? "bg-primary"
                      : timerState === "break"
                        ? "bg-accent"
                        : "bg-muted",
                  )}
                />
                <span className="text-sm text-muted-foreground">
                  {timerState === "running"
                    ? "En foco"
                    : timerState === "break"
                      ? "Descanso"
                      : "Listo para empezar"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={soundEnabled ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "size-8 transition-colors",
                    soundEnabled && "bg-primary/20 text-primary",
                  )}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={
                    soundEnabled ? "Sonido activado" : "Sonido desactivado"
                  }
                >
                  {soundEnabled ? (
                    <Volume2 className="size-4" />
                  ) : (
                    <VolumeX className="size-4" />
                  )}
                </Button>

                <Button
                  variant={showParticles ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "size-8 transition-colors",
                    showParticles && "bg-primary/20 text-primary",
                  )}
                  onClick={() => setShowParticles(!showParticles)}
                  title={
                    showParticles
                      ? "Ocultar particulas"
                      : "Mostrar particulas"
                  }
                >
                  <Zap className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="size-4" />
                  ) : (
                    <Maximize2 className="size-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="transition-colors"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </motion.div>

            {showParticles ? (
              <ParticlesBackground
                density="medium"
                speed="slow"
                className="absolute inset-0 pointer-events-none"
                particleColor={themeClasses.particleColor}
              />
            ) : null}

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
              <motion.div
                key={timerState}
                variants={
                  shouldReduceMotion ? undefined : timerModeVariants
                }
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-2xl"
              >
                {timerState === "break" ? (
                  <BreakModeContent
                    timeLeft={timeLeft}
                    sessionsToday={sessionsToday}
                    themeClasses={themeClasses}
                    onSkipBreak={skipBreak}
                  />
                ) : (
                  <div className="flex flex-col gap-8">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Trabajando en
                      </p>
                      <h1
                        className={cn(
                          "text-3xl md:text-4xl font-bold",
                          themeClasses.textPrimary,
                        )}
                      >
                        {task.title}
                      </h1>
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

                    <div className="flex items-center justify-center gap-4">
                      {timerState === "idle" || timerState === "paused" ? (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="lg"
                            onClick={startTimer}
                            className="px-8 gap-2"
                          >
                            <Play className="size-5" />
                            {timerState === "paused" ? "Continuar" : "Empezar"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={pauseTimer}
                            className="px-8 gap-2"
                          >
                            <Pause className="size-5" />
                            Pausar
                          </Button>
                        </motion.div>
                      )}

                      {timerState === "running" ||
                      timerState === "paused" ? (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={resetTimer}
                          >
                            <RotateCcw className="size-5" />
                          </Button>
                        </motion.div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEndSessionClick}
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
                          onClick={handleEndSessionClick}
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
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center pb-8 text-muted-foreground text-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <Zap className="size-4" />
                <span>
                  {timerState === "running"
                    ? "Modo foco activado. Una tarea a la vez."
                    : "Elige una tarea y enfocate en ella."}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
