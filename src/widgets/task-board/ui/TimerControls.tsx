"use client";

import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";

type ControlState = "idle" | "running" | "paused" | "completed" | "break";

interface TimerControlsProps {
  state: ControlState;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  playLabel?: string;
  pauseLabel?: string;
}

export function TimerControls({
  state,
  onPlay,
  onPause,
  onReset,
  playLabel,
  pauseLabel = "Pausar",
}: TimerControlsProps) {
  const showPlay = state === "idle" || state === "paused";
  const showPause = state === "running";
  const showReset = state === "running" || state === "paused";

  return (
    <div className="flex items-center justify-center gap-4">
      {showPlay ? (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" onClick={onPlay} className="px-8 gap-2">
            <Play className="size-5" />
            {playLabel ?? (state === "paused" ? "Continuar" : "Empezar")}
          </Button>
        </motion.div>
      ) : null}
      {showPause ? (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" variant="outline" onClick={onPause} className="px-8 gap-2">
            <Pause className="size-5" />
            {pauseLabel}
          </Button>
        </motion.div>
      ) : null}
      {showReset ? (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" onClick={onReset}>
            <RotateCcw className="size-5" />
          </Button>
        </motion.div>
      ) : null}
    </div>
  );
}
