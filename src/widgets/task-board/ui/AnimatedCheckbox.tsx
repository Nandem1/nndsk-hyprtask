"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import { Check } from "lucide-react";

interface AnimatedCheckboxProps {
  isCompleted: boolean;
  onClick: () => void;
}

export function AnimatedCheckbox({
  isCompleted,
  onClick,
}: AnimatedCheckboxProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "mt-0.5 size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 relative",
        isCompleted
          ? "bg-primary border-primary text-primary-foreground"
          : "border-muted hover:border-primary bg-background",
      )}
    >
      <AnimatePresence initial={false}>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={transitions.springBouncy}
          >
            <Check className="size-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
