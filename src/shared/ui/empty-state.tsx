import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: EmptyStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-border/20 bg-background/50",
        className,
      )}
    >
      {Icon ? (
        <div className="mb-4 p-3 rounded-full bg-muted">
          <Icon className="size-6 text-muted-foreground" />
        </div>
      ) : null}
      <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </motion.div>
  );
}
