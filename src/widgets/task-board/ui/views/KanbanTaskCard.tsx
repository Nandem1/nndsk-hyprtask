"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Trash2, Target, Zap } from "lucide-react";
import type { Task } from "@/entities/task";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import { TaskMetadataBadges } from "@/entities/project";
import { TaskCheckbox } from "@/shared/ui/task-checkbox";
import { RichText } from "../ConnectedRichText";
import { DragHandle } from "../DragHandle";
import { useOptionalTaskDrag } from "../../lib/dnd-context";
import { useKeyboardSelected } from "@/shared/hooks/use-keyboard-selected";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelect: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
  classes: ExtendedThemeClasses;
  enableDrag?: boolean;
}

export const KanbanTaskCard = memo(function KanbanTaskCard({
  task,
  index,
  onToggle,
  onDelete,
  onSetCurrent,
  onSelect,
  onEnterFocus,
  classes,
  enableDrag = false,
}: KanbanTaskCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollRef, selectedClass } = useKeyboardSelected(task.id);

  const { attributes, listeners, setNodeRef, style, isDragging } =
    useOptionalTaskDrag(task.id, enableDrag);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      key={task.id}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        delay: index * 0.03,
      }}
      className="group"
    >
      <div
        ref={scrollRef}
        onClick={() => onSelect(task)}
        className={cn(
          "relative rounded-xl border p-4 cursor-pointer overflow-hidden",
          "backdrop-blur-sm bg-white/5 dark:bg-black/10",
          "border-white/10 dark:border-white/5",
          task.isCurrent
            ? cn(classes.border, "bg-accent/50 ring-1 ring-primary/20")
            : "hover:border-primary/30 hover:shadow-lg",
          isDragging && "shadow-2xl scale-105 rotate-1 z-50",
          selectedClass
        )}
      >
        {enableDrag && (
          <DragHandle attributes={attributes} listeners={listeners} />
        )}

        {task.isCurrent && (
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              classes.gradientBgSolid,
            )}
          />
        )}

        <div className={cn("flex items-start gap-3", enableDrag && "pl-8")}>
          <TaskCheckbox
            isCompleted={task.isCompleted}
            onClick={() => onToggle(task.id)}
            variant="sm"
          />

          <div className="flex-1 min-w-0">
            <RichText
              text={task.title}
              inline
              className={cn(
                "text-sm leading-relaxed pr-2",
                task.isCompleted && "line-through text-muted-foreground",
                task.isCurrent && cn(classes.textPrimary, "font-medium"),
                !task.isCompleted && !task.isCurrent && "text-foreground",
              )}
            />

            {(task.projectId || task.categoryId) && !task.isCompleted && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <TaskMetadataBadges
                  projectId={task.projectId}
                  categoryId={task.categoryId}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.isCurrent && !task.isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSetCurrent(task.id);
                }}
                className={cn(
                  "p-1.5 rounded-md border transition-colors",
                  "border-border hover:border-primary/50 hover:bg-accent",
                  classes.textPrimary,
                )}
                title="Marcar como actual"
              >
                <Target className="size-3.5" />
              </button>
            )}
            {!task.isCompleted && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterFocus(task);
                }}
                className={cn(
                  "p-1.5 rounded-md border transition-colors",
                  classes.textPrimary,
                  task.isCurrent
                    ? "border-primary/30 bg-primary/10 hover:bg-primary/20"
                    : "border-border hover:border-primary/50 hover:bg-accent",
                )}
                title="Modo Foco"
              >
                <Zap className="size-3.5" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="p-1.5 rounded-md border border-border hover:border-destructive/50 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              title="Eliminar"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
