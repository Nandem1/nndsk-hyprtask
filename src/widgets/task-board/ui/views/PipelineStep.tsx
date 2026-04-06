"use client";

import { memo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions, listItemVariants } from "@/shared/lib/animations";
import { ChevronRight, Focus, Clock } from "lucide-react";
import type { Task } from "@/entities/task";
import { FocusButton } from "@/entities/task/ui/FocusButton";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { TaskMetadataBadges } from "@/entities/project";
import { DNAHelix } from "@/shared/ui/dna-helix";
import { TaskCheckbox } from "@/shared/ui/task-checkbox";
import { RichText } from "../ConnectedRichText";
import { DragHandle } from "../DragHandle";
import { useOptionalTaskDrag } from "../../lib/dnd-context";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import { formatTaskDate } from "@/shared/lib/format-date";
import { useKeyboardSelected } from "@/shared/hooks/use-keyboard-selected";

interface PipelineStepProps {
  task: Task;
  index: number;
  status: "completed" | "current" | "pending";
  isLast: boolean;
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelect: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  classes: ExtendedThemeClasses;
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
  const { scrollRef, selectedClass } = useKeyboardSelected(task.id);

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
        <TaskCheckbox
          isCompleted={isCompleted}
          isCurrent={isCurrent}
          onClick={() => onToggle(task.id)}
          variant="lg"
          label={index + 1}
          textPrimaryClass={classes.textPrimary}
        />

        {!isLast ? (
          <DNAHelix
            isCompleted={isCompleted}
            isActive={isCurrent}
            delay={index * 0.1}
            className="mt-1"
          />
        ) : null}
      </div>

      <div className="flex-1 pb-8">
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -2, transition: { duration: 0.2 } }}
        >
          <Card
            ref={scrollRef}
            className={cn(
              "relative cursor-pointer overflow-hidden",
              "backdrop-blur-sm bg-white/5 dark:bg-black/10",
              "border border-white/10 dark:border-white/5",
              isCurrent
                ? cn(classes.border, "ring-1 ring-primary/20 bg-accent/30")
                : "hover:border-primary/30",
              "hover:shadow-lg",
              isDragging && "shadow-2xl scale-105 rotate-1",
              selectedClass,
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
                    classes.gradientBgSolid,
                  )}
                />
              )}
            </AnimatePresence>

            <CardContent className={cn("p-4", enableDrag && "pl-10")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <RichText
                    text={task.title}
                    inline
                    className={cn(
                      "font-medium transition-colors duration-300",
                      isCompleted && "line-through text-muted-foreground",
                      isCurrent && cn(classes.textPrimary, "text-lg"),
                    )}
                  />

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <TaskMetadataBadges
                      projectId={task.projectId}
                      categoryId={task.categoryId}
                    />
                    {task.dueDate ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        {formatTaskDate(task.dueDate)}
                      </span>
                    ) : null}
                  </div>

                  <AnimatePresence>
                    {task.notes ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 text-sm text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded"
                      >
                        <RichText text={task.notes} inline emoteSize="1x" />
                      </motion.div>
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
                      <FocusButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onEnterFocus?.(task);
                        }}
                        classes={classes}
                      />
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
