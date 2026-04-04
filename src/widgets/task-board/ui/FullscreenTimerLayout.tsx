"use client";

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X,
  Maximize2,
  Minimize2,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { DNAHelixBackground } from "@/shared/ui/dna-helix-background";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import {
  containerVariants,
  contentVariants,
} from "../lib/focus-timer-constants";

interface FullscreenTimerLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  themeClasses: ExtendedThemeClasses;
  statusText: string;
  statusColor: "primary" | "accent" | "muted" | "green";
  isPulsing: boolean;
  children: ReactNode;
  footerContent?: ReactNode;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  showParticles: boolean;
  onParticlesToggle: () => void;
}

export function FullscreenTimerLayout({
  isOpen,
  onClose,
  themeClasses,
  statusText,
  statusColor,
  isPulsing,
  children,
  footerContent,
  soundEnabled,
  onSoundToggle,
  showParticles,
  onParticlesToggle,
}: FullscreenTimerLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  if (!isOpen) return null;

  const dotColorClass = {
    primary: "bg-primary",
    accent: "bg-accent",
    muted: "bg-muted",
    green: "bg-green-500",
  }[statusColor];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="fullscreen-layout"
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
                  scale: isPulsing ? [1, 1.2, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: isPulsing ? Infinity : 0,
                }}
                className={cn("size-3 rounded-full", dotColorClass)}
              />
              <span className="text-sm text-muted-foreground">
                {statusText}
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
                onClick={onSoundToggle}
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
                onClick={onParticlesToggle}
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
            {children}
          </div>

          {footerContent ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-center pb-8 text-muted-foreground text-sm"
            >
              {footerContent}
            </motion.div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
