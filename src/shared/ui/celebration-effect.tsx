"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CelebrationPositions {
  x: number;
  y: number;
}

interface CelebrationEffectProps {
  show: boolean;
  mode?: "positions" | "radial";
  positions?: CelebrationPositions[];
  count?: number;
  distance?: number;
  size?: "sm" | "md";
  duration?: number;
}

export function CelebrationEffect({
  show,
  mode = "radial",
  positions,
  count = 8,
  distance = 100,
  size = "md",
  duration = 0.8,
}: CelebrationEffectProps) {
  const shouldReduceMotion = useReducedMotion();

  const particlePositions = useMemo(() => {
    if (mode === "radial") {
      return [...Array(count)].map((_, i) => {
        const angle = (i * 360) / count;
        const radians = (angle * Math.PI) / 180;
        return {
          x: Math.cos(radians) * distance,
          y: Math.sin(radians) * distance,
        };
      });
    }
    return positions || [];
  }, [mode, count, distance, positions]);

  if (shouldReduceMotion) return null;

  const iconSize = size === "sm" ? "size-3" : "size-6";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="celebration"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          {particlePositions.map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
                x: pos.x,
                y: pos.y,
              }}
              transition={{
                duration: mode === "positions" ? 0.6 : duration,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              <Sparkles className={`${iconSize} text-primary`} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
