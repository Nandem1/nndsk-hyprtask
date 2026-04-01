"use client";

import { useState, useEffect, useCallback } from "react";
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
  Coffee,
  Zap,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import type { Task } from "@/entities/task";
import { useProjectInfo } from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { ParticlesBackground } from "@/shared/components/particles-background";
import { useFocusSessions } from "@/shared/hooks/use-focus-sessions";
import { EndSessionDialog } from "./EndSessionDialog";

interface FocusModeProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToggleTask: () => void;
}

function ProjectName({ projectId }: { projectId: string }) {
  const { name } = useProjectInfo(projectId);
  return <p className="text-muted-foreground mt-2">{name}</p>;
}

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

export function FocusMode({
  task,
  isOpen,
  onClose,
  onComplete,
  onToggleTask,
}: FocusModeProps) {
  const { themeClasses } = useThemeState();
  const shouldReduceMotion = useReducedMotion();
  const { sessions, incrementSession, getStats } = useFocusSessions();
  const [timerState, setTimerState] = useState<"idle" | "running" | "paused" | "break">("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showEndDialog, setShowEndDialog] = useState(false);

  const { sessionsToday, totalMinutesToday } = getStats();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const playSuccessSound = () => {
    const audioContext = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleSessionComplete = useCallback(() => {
    incrementSession(25);
    if (soundEnabled) {
      playSuccessSound();
    }
    setTimerState("break");
    setTimeLeft(BREAK_DURATION);
  }, [soundEnabled, incrementSession]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState === "running" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerState === "running") {
        handleSessionComplete();
      } else if (timerState === "break") {
        setTimerState("idle");
        setTimeLeft(FOCUS_DURATION);
      }
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, handleSessionComplete]);

  // Fullscreen sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Reset timer when opening
  useEffect(() => {
    if (isOpen) {
      setTimerState("idle");
      setTimeLeft(FOCUS_DURATION);
    }
  }, [isOpen]);

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
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleEndSessionClick = () => {
    setShowEndDialog(true);
  };

  const handleCompleteTask = () => {
    onToggleTask();
    onComplete();
    setShowEndDialog(false);
  };

  const handleJustClose = () => {
    onComplete();
    setShowEndDialog(false);
  };

  const totalTime = timerState === "break" ? BREAK_DURATION : FOCUS_DURATION;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-background/95 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-3 rounded-full",
                    timerState === "running"
                      ? "bg-primary animate-pulse"
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
                    "size-8",
                    soundEnabled && "bg-primary/20 text-primary"
                  )}
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Sonido activado" : "Sonido desactivado"}
                >
                  {soundEnabled ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
                </Button>

                <Button
                  variant={showParticles ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "size-8",
                    showParticles && "bg-primary/20 text-primary"
                  )}
                  onClick={() => setShowParticles(!showParticles)}
                  title={showParticles ? "Ocultar partículas" : "Mostrar partículas"}
                >
                  <Zap className="size-4" />
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X />
                </Button>
              </div>
            </div>

            {/* Particles background */}
            {showParticles && (
              <ParticlesBackground
                density="medium"
                speed="slow"
                className="absolute inset-0 pointer-events-none"
              />
            )}

            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
              {timerState === "break" ? (
                <motion.div
                  initial={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { scale: 0.9, opacity: 0 }
                  }
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="flex flex-col items-center gap-6 text-center"
                >
                  <div className={cn(
                    "size-24 mx-auto rounded-full flex items-center justify-center",
                    "backdrop-blur-xl bg-white/10 dark:bg-black/20",
                    "border border-white/20 dark:border-white/10",
                    "shadow-2xl"
                  )}>
                    <Coffee className={cn("size-12", themeClasses.textPrimary)} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      ¡Tiempo de descanso!
                    </h2>
                    <p className="text-muted-foreground">
                      Has completado {sessionsToday} sesion
                      {sessionsToday !== 1 ? "es" : ""} de foco hoy
                    </p>
                  </div>
                  <div
                    className={cn(
                      "text-6xl font-mono font-bold",
                      themeClasses.textPrimary,
                    )}
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={skipBreak}>
                      Saltar descanso
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full max-w-2xl flex flex-col gap-8">
                  <motion.div
                    initial={
                      shouldReduceMotion ? { opacity: 1 } : { y: 20, opacity: 0 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                    className="text-center"
                  >
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
                  </motion.div>

                  <div className="relative size-72 mx-auto">
                    {/* Glassmorphism background for timer */}
                    <div className={cn(
                      "absolute inset-0 rounded-full",
                      "backdrop-blur-xl bg-white/5 dark:bg-black/10",
                      "border border-white/10 dark:border-white/5",
                      "shadow-2xl"
                    )} />

                    <svg className="size-full -rotate-90 relative z-10" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-muted/20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 45 * (1 - progress / 100)
                        }`}
                        className={cn(
                          timerState === "running"
                            ? themeClasses.textPrimary
                            : "text-muted-foreground",
                          "transition-all duration-1000",
                        )}
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <span className="text-6xl font-mono font-bold">
                        {formatTime(timeLeft)}
                      </span>
                      <span className="text-muted-foreground mt-2">
                        {timerState === "idle"
                          ? "25:00"
                          : timerState === "paused"
                            ? "Pausado"
                            : "Restante"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    {timerState === "idle" || timerState === "paused" ? (
                      <Button size="lg" onClick={startTimer} className="px-8">
                        <Play data-icon="inline-start" />
                        {timerState === "paused" ? "Continuar" : "Empezar"}
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={pauseTimer}
                        className="px-8"
                      >
                        <Pause data-icon="inline-start" />
                        Pausar
                      </Button>
                    )}

                    {timerState === "running" || timerState === "paused" ? (
                      <Button variant="ghost" size="icon" onClick={resetTimer}>
                        <RotateCcw />
                      </Button>
                    ) : null}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggleTask}
                      className={cn(
                        "border-primary/30 hover:bg-primary/10",
                        themeClasses.textPrimary,
                      )}
                    >
                      <Check data-icon="inline-start" />
                      Completar tarea
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleEndSessionClick}>
                      <Timer data-icon="inline-start" />
                      Terminar sesion
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-8 pt-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {sessionsToday}
                      </div>
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
            </div>

            <motion.div
              initial={
                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.3,
                delay: shouldReduceMotion ? 0 : 0.5,
              }}
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

      <EndSessionDialog
        isOpen={showEndDialog}
        onClose={() => setShowEndDialog(false)}
        onCompleteTask={handleCompleteTask}
        onJustClose={handleJustClose}
        taskTitle={task.title}
      />
    </>
  );
}
