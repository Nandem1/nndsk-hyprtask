"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  UtensilsCrossed,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import { useWorkSettings } from "@/entities/work";
import { Button } from "@/shared/ui/button";
import { DNAHelixBackground } from "@/shared/ui/dna-helix-background";
import { playSuccessSound } from "@/shared/lib/audio";
import { useCountdownTimer } from "@/shared/hooks/use-countdown-timer";
import {
  containerVariants,
  contentVariants,
  timerModeVariants,
} from "../lib/focus-timer-constants";
import { FocusTimerCircle } from "./FocusTimerCircle";

interface ColacionModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColacionMode({ isOpen, onClose }: ColacionModeProps) {
  const { themeClasses } = useThemeState();
  const shouldReduceMotion = useReducedMotion();
  const { data: settings } = useWorkSettings();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const breakDurationSeconds = (settings?.breakDuration ?? 30) * 60;

  const handleComplete = useCallback(() => {
    if (soundEnabled) playSuccessSound();
    setShowCelebration(true);
    setTimeout(onClose, 2000);
  }, [soundEnabled, onClose]);

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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset();
      setShowCelebration(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="colacion-mode"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-background/95 backdrop-blur-sm flex flex-col overflow-hidden z-50"
        >
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
                    : timerState === "completed"
                      ? "bg-green-500"
                      : "bg-muted",
                )}
              />
              <span className="text-sm text-muted-foreground">
                {timerState === "running"
                  ? "En colacion"
                  : timerState === "completed"
                    ? "Colacion terminada"
                    : "Listo para colacion"}
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
                title={soundEnabled ? "Sonido activado" : "Sonido desactivado"}
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
                title={showParticles ? "Ocultar ADN" : "Mostrar ADN"}
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
            <DNAHelixBackground
              speed="slow"
              className="absolute inset-0 pointer-events-none"
              helixColor={themeClasses.particleColor}
            />
          ) : null}

          <div className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
            <motion.div
              key={timerState}
              variants={shouldReduceMotion ? undefined : timerModeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-2xl"
            >
              <div className="flex flex-col gap-8">
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

                <div className="flex items-center justify-center gap-4">
                  {timerState === "idle" || timerState === "paused" ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        onClick={start}
                        className="px-8 gap-2"
                      >
                        <Play className="size-5" />
                        {timerState === "paused" ? "Continuar" : "Empezar"}
                      </Button>
                    </motion.div>
                  ) : timerState === "running" ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={pause}
                        className="px-8 gap-2"
                      >
                        <Pause className="size-5" />
                        Pausar
                      </Button>
                    </motion.div>
                  ) : null}

                  {timerState === "running" || timerState === "paused" ? (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button variant="ghost" size="icon" onClick={reset}>
                        <RotateCcw className="size-5" />
                      </Button>
                    </motion.div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-center pb-8 text-muted-foreground text-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <UtensilsCrossed className="size-4" />
              <span>
                {timerState === "running"
                  ? "Disfruta tu colacion."
                  : "Cuando inicies tu colacion, el timer comenzara."}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
