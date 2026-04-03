"use client";

import { memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions, listItemVariants } from "@/shared/lib/animations";
import { Check, ChevronRight, Zap, Focus, Clock, Lock } from "lucide-react";
import type { Task } from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { TaskMetadataBadges } from "@/shared/ui/task-metadata-badges";
import { DragHandle } from "../DragHandle";
import { useOptionalTaskDrag } from "../../lib/dnd-context";
import type { useThemeState } from "@/store/hooks";

interface PipelineStepProps {
  task: Task;
  index: number;
  status: "completed" | "current" | "pending";
  isLast: boolean;
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelect: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  classes: ReturnType<typeof useThemeState>["themeClasses"];
  enableDrag?: boolean;
}

export const PipelineStep = memo(function PipelineStep({
  task,
  index,
  status,
  isLast,
  onToggle,
  onSetCurrent,
  onSelect,
  onEnterFocus,
  classes,
  enableDrag = false,
}: PipelineStepProps) {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const shouldReduceMotion = useReducedMotion();

  const { attributes, listeners, setNodeRef, style, isDragging } =
    useOptionalTaskDrag(task.id, enableDrag);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={listItemVariants}
      initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
      animate={isDragging ? { opacity: 0.5, scale: 1.02 } : "visible"}
      exit={{ opacity: 0, x: -20 }}
      transition={shouldReduceMotion ? { duration: 0 } : transitions.spring}
      className={cn("flex items-start gap-4", isDragging && "opacity-50")}
    >
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={() => onToggle(task.id)}
          className={cn(
            "size-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 shrink-0",
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : isCurrent
                ? cn("border-primary bg-primary/10", classes.textPrimary)
                : "border-border bg-card hover:border-primary/50",
          )}
        >
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={transitions.springBouncy}
              >
                <Check className="size-5" />
              </motion.div>
            ) : (
              <motion.span
                key="number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={transitions.spring}
                className="text-sm font-semibold"
              >
                {index + 1}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {!isLast ? (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn(
              "w-0.5 h-16 mt-2 origin-top transition-colors duration-500",
              isCompleted ? "bg-primary/50" : "bg-border",
            )}
          />
        ) : null}
      </div>

      <div className="flex-1 pb-8">
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -2, transition: { duration: 0.2 } }}
        >
          <Card
            className={cn(
              "relative cursor-pointer overflow-hidden",
              "backdrop-blur-sm bg-white/5 dark:bg-black/10",
              "border border-white/10 dark:border-white/5",
              isCurrent
                ? cn(classes.border, "ring-1 ring-primary/20 bg-accent/30")
                : "hover:border-primary/30",
              "hover:shadow-lg",
              isDragging && "shadow-2xl scale-105 rotate-1",
            )}
            onClick={() => onSelect(task)}
          >
            {enableDrag && (
              <DragHandle attributes={attributes} listeners={listeners} />
            )}

            <AnimatePresence>
              {isCurrent && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 origin-top",
                    classes.gradientBg?.replace("/10", "") || "bg-primary",
                  )}
                />
              )}
            </AnimatePresence>

            <CardContent className={cn("p-4", enableDrag && "pl-10")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3
                    className={cn(
                      "font-medium transition-colors duration-300",
                      isCompleted && "line-through text-muted-foreground",
                      isCurrent && cn(classes.textPrimary, "text-lg"),
                    )}
                  >
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <TaskMetadataBadges
                      projectId={task.projectId}
                      categoryId={task.categoryId}
                    />
                    {task.dueDate ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {new Date(task.dueDate).toLocaleDateString("es-ES", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                  </div>

                  <AnimatePresence>
                    {task.notes ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 text-sm text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded"
                      >
                        {task.notes}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!isCurrent && !isCompleted ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetCurrent(task.id);
                      }}
                      className="text-muted-foreground hover:text-primary h-9 transition-colors"
                      title="Marcar como actual"
                    >
                      <ChevronRight className="size-4 mr-1" />
                      <span className="hidden sm:inline">Actual</span>
                    </Button>
                  ) : null}
                  {isCurrent ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEnterFocus?.(task);
                        }}
                        className={cn(
                          "gap-1.5 h-9 transition-colors duration-200 hover:scale-105",
                          classes.gradientBg,
                          classes.textPrimary,
                        )}
                      >
                        <Zap className="size-3.5" />
                        <span className="hidden sm:inline">Foco</span>
                      </Button>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 border-primary/30 h-9 px-2.5 py-0 flex items-center",
                          classes.textPrimary,
                        )}
                      >
                        <Focus className="size-3" />
                        <span className="hidden sm:inline">ACTUAL</span>
                      </Badge>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
});
