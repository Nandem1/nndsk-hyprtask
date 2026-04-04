"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import { Check } from "lucide-react";

type CheckboxVariant = "sm" | "md" | "lg";

interface TaskCheckboxProps {
  isCompleted: boolean;
  isCurrent?: boolean;
  onClick: (e: React.MouseEvent) => void;
  variant?: CheckboxVariant;
  label?: string | number;
  textPrimaryClass?: string;
}

const VARIANT_STYLES: Record<
  CheckboxVariant,
  { root: string; completed: string; icon: string }
> = {
  sm: {
    root: "mt-0.5 size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
    completed: "bg-primary border-primary",
    icon: "size-3 text-primary-foreground",
  },
  md: {
    root: "mt-0.5 size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 relative",
    completed: "bg-primary border-primary text-primary-foreground",
    icon: "size-3.5",
  },
  lg: {
    root: "size-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shrink-0",
    completed: "bg-primary border-primary text-primary-foreground",
    icon: "size-5",
  },
};

export function TaskCheckbox({
  isCompleted,
  isCurrent = false,
  onClick,
  variant = "md",
  label,
  textPrimaryClass,
}: TaskCheckboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const styles = VARIANT_STYLES[variant];
  const isAnimated = variant !== "sm";
  const isPipeline = variant === "lg";

  const rootClassName = cn(
    styles.root,
    isCompleted
      ? styles.completed
      : isPipeline && isCurrent
        ? cn("border-primary bg-primary/10", textPrimaryClass)
        : isPipeline
          ? "border-border bg-card hover:border-primary/50"
          : "border-muted hover:border-primary bg-background",
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(e);
  };

  if (!isAnimated) {
    return (
      <button onClick={handleClick} className={rootClassName}>
        {isCompleted ? <Check className={styles.icon} /> : null}
      </button>
    );
  }

  const hover = shouldReduceMotion ? undefined : { scale: 1.1 };
  const tap = shouldReduceMotion ? undefined : { scale: 0.95 };

  return (
    <motion.button whileHover={hover} whileTap={tap} onClick={handleClick} className={rootClassName}>
      <AnimatePresence mode={isPipeline ? "wait" : undefined} initial={!isPipeline ? false : undefined}>
        {isCompleted ? (
          <motion.div
            key="check"
            initial={
              isPipeline
                ? { scale: 0, rotate: -180 }
                : { scale: 0 }
            }
            animate={
              isPipeline
                ? { scale: 1, rotate: 0 }
                : { scale: 1 }
            }
            exit={
              isPipeline
                ? { scale: 0, rotate: 180 }
                : { scale: 0 }
            }
            transition={transitions.springBouncy}
          >
            <Check className={styles.icon} />
          </motion.div>
        ) : isPipeline && label != null ? (
          <motion.span
            key="label"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={transitions.spring}
            className="text-sm font-semibold"
          >
            {label}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
