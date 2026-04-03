"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Coffee } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { formatTime } from "../lib/focus-timer-constants";
import type { ExtendedThemeClasses } from "@/shared/types/theme";

interface BreakModeContentProps {
  timeLeft: number;
  sessionsToday: number;
  themeClasses: ExtendedThemeClasses;
  onSkipBreak: () => void;
}

export const BreakModeContent = memo(function BreakModeContent({
  timeLeft,
  sessionsToday,
  themeClasses,
  onSkipBreak,
}: BreakModeContentProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <motion.div
        className={cn(
          "size-24 mx-auto rounded-full flex items-center justify-center",
          "bg-white/10 dark:bg-black/20",
          "border border-white/20 dark:border-white/10",
          "shadow-2xl",
        )}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Coffee className={cn("size-12", themeClasses.textPrimary)} />
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold mb-2">Tiempo de descanso!</h2>
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
        <Button
          variant="outline"
          onClick={onSkipBreak}
          className="transition-all hover:scale-105"
        >
          Saltar descanso
        </Button>
      </div>
    </div>
  );
});
