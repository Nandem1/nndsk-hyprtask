"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Check, Trash2, Target } from "lucide-react";
import type { Task } from "@/entities/task";
import type { useTheme } from "@/store/hooks";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ReturnType<typeof useTheme>["themeClasses"];
}

export function KanbanTaskCard({
  task,
  index,
  onToggle,
  onDelete,
  onSetCurrent,
  classes,
}: KanbanTaskCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={task.id}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2, delay: index * 0.03 }}
      className="group"
    >
      <div
        className={cn(
          "rounded-lg border p-3 transition-all hover:shadow-sm",
          task.isCurrent
            ? cn(classes.border, "bg-accent")
            : "border-border bg-card hover:border-border/80",
        )}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className={cn(
              "mt-0.5 size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
              task.isCompleted
                ? "bg-primary border-primary"
                : "border-border hover:border-primary",
            )}
          >
            {task.isCompleted ? (
              <Check className="size-3 text-primary-foreground" />
            ) : null}
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm leading-relaxed",
                task.isCompleted && "line-through text-muted-foreground",
                task.isCurrent && cn(classes.textPrimary, "font-medium"),
                !task.isCompleted && !task.isCurrent && "text-foreground",
              )}
            >
              {task.title}
            </p>
            {(task.projectId || task.categoryId) && !task.isCompleted ? (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {task.projectId ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Proyecto
                  </span>
                ) : null}
                {task.categoryId ? (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Categoria
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.isCurrent && !task.isCompleted ? (
              <button
                onClick={() => onSetCurrent(task.id)}
                className="p-1.5 rounded-md border border-border hover:bg-accent transition-colors"
                title="Marcar como actual"
              >
                <Target className={cn("size-3.5", classes.textPrimary)} />
              </button>
            ) : null}
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
              title="Eliminar"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
