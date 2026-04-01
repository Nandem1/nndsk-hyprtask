"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import { transitions } from "@/shared/lib/animations";
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
  Sparkles,
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

// ARQUITECTURA: Variants para transiciones fluidas sin AnimatePresence anidado
// Esto elimina el micro-parpadeo causado por múltiples AnimatePresence
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const contentVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.1 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const timerModeVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.25, 
      ease: [0.25, 0.1, 0.25, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

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
  const [showCelebration, setShowCelebration] = useState(false);

  // Refs para animación del círculo sin re-render
  const circleRef = useRef<SVGCircleElement>(null);
  const progressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

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
    // Mostrar celebración
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
    setTimerState("break");
    setTimeLeft(BREAK_DURATION);
  }, [soundEnabled, incrementSession]);

  // Timer effect - solo actualiza el estado del tiempo, no la animación del círculo
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

  // Animación del círculo de progreso usando RAF - separada del estado React
  useEffect(() => {
    if (!circleRef.current || shouldReduceMotion) return;

    const totalTime = timerState === "break" ? BREAK_DURATION : FOCUS_DURATION;
    const targetProgress = ((totalTime - timeLeft) / totalTime) * 100;

    const animateCircle = () => {
      const now = Date.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Interpolación suave hacia el target
      const diff = targetProgress - progressRef.current;
      if (Math.abs(diff) > 0.1) {
        progressRef.current += diff * 0.1; // Suavizado
        
        if (circleRef.current) {
          const circumference = 2 * Math.PI * 45;
          const offset = circumference * (1 - progressRef.current / 100);
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
  }, [timeLeft, timerState, shouldReduceMotion]);

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
      setShowCelebration(false);
      progressRef.current = 0;
    }
  }, [isOpen]);

  const startTimer = () => setTimerState("running");
  const pauseTimer = () => setTimerState("paused");
  const resetTimer = () => {
    setTimerState("idle");
    setTimeLeft(FOCUS_DURATION);
    progressRef.current = 0;
    if (circleRef.current) {
      const circumference = 2 * Math.PI * 45;
      circleRef.current.style.strokeDashoffset = String(circumference);
    }
  };

  const skipBreak = () => {
    setTimerState("idle");
    setTimeLeft(FOCUS_DURATION);
    progressRef.current = 0;
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
      {/* ARQUITECTURA: Un solo AnimatePresence a nivel raíz */}
      {/* Eliminado AnimatePresence anidado que causaba micro-parpadeo */}
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
                    scale: timerState === "running" ? [1, 1.2, 1] : 1,
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
                    "size-8 transition-all",
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
                    "size-8 transition-all",
                    showParticles && "bg-primary/20 text-primary"
                  )}
                  onClick={() => setShowParticles(!showParticles)}
                  title={showParticles ? "Ocultar partículas" : "Mostrar partículas"}
                >
                  <Zap className="size-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleFullscreen}
                  className="transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
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

            {/* Particles background */}
            {showParticles && (
              <ParticlesBackground
                density="medium"
                speed="slow"
                className="absolute inset-0 pointer-events-none"
              />
            )}

            {/* ARQUITECTURA: Contenido principal con variants en lugar de AnimatePresence anidado */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
              <motion.div
                key={timerState}
                variants={shouldReduceMotion ? undefined : timerModeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-2xl"
              >
                {timerState === "break" ? (
                  /* Break Mode */
                  <div className="flex flex-col items-center gap-6 text-center">
                    <motion.div 
                      className={cn(
                        "size-24 mx-auto rounded-full flex items-center justify-center",
                        // Optimizado: eliminado backdrop-blur excesivo
                        "bg-white/10 dark:bg-black/20",
                        "border border-white/20 dark:border-white/10",
                        "shadow-2xl"
                      )}
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Coffee className={cn("size-12", themeClasses.textPrimary)} />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        ¡Tiempo de descanso!
                      </h2>
                      <p className="text-muted-foreground">
                        Has completado {sessionsToday} sesión
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
                      <Button 
                        variant="outline" 
                        onClick={skipBreak}
                        className="transition-all hover:scale-105"
                      >
                        Saltar descanso
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Focus Timer */
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

                    <div className="relative size-72 mx-auto">
                      {/* Background circle - sin backdrop-blur */}
                      <div 
                        className={cn(
                          "absolute inset-0 rounded-full",
                          "bg-white/5 dark:bg-black/10",
                          "border border-white/10 dark:border-white/5",
                          "shadow-2xl"
                        )}
                      />

                      {/* Celebración al completar */}
                      <AnimatePresence>
                        {showCelebration && (
                          <>
                            {[...Array(8)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{
                                  scale: [0, 1.5, 0],
                                  opacity: [1, 1, 0],
                                  x: Math.cos((i * 45 * Math.PI) / 180) * 100,
                                  y: Math.sin((i * 45 * Math.PI) / 180) * 100,
                                }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <Sparkles className="size-6 text-primary" />
                              </motion.div>
                            ))}
                          </>
                        )}
                      </AnimatePresence>

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
                        {/* Círculo de progreso optimizado */}
                        <circle
                          ref={circleRef}
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45}`}
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
                        <motion.span 
                          className="text-6xl font-mono font-bold"
                          key={timeLeft}
                          initial={shouldReduceMotion ? {} : { scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {formatTime(timeLeft)}
                        </motion.span>
                        <span className="text-muted-foreground mt-2">
                          {timerState === "paused"
                            ? "Pausado"
                            : "Restante"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      {timerState === "idle" || timerState === "paused" ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button size="lg" onClick={startTimer} className="px-8 gap-2">
                            <Play className="size-5" />
                            {timerState === "paused" ? "Continuar" : "Empezar"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

                      {timerState === "running" || timerState === "paused" ? (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button variant="ghost" size="icon" onClick={resetTimer}>
                            <RotateCcw className="size-5" />
                          </Button>
                        </motion.div>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-center gap-3 pt-4">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onToggleTask}
                          className={cn(
                            "border-primary/30 hover:bg-primary/10 gap-2",
                            themeClasses.textPrimary,
                          )}
                        >
                          <Check className="size-4" />
                          Completar tarea
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleEndSessionClick}
                          className="gap-2"
                        >
                          <Timer className="size-4" />
                          Terminar sesión
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
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
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
                    : "Elige una tarea y enfócate en ella."}
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
