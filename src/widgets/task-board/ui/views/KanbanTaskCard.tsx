"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Check, Trash2, Target, Zap } from "lucide-react";
import type { Task } from "@/entities/task";
import type { useTheme } from "@/store/hooks";
import {
  useProjectInfo,
  useCategoryInfo,
} from "@/entities/task/hooks/use-project-colors";

interface KanbanTaskCardProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelect: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
  classes: ReturnType<typeof useTheme>["themeClasses"];
}

function TaskMetadataBadges({
  projectId,
  categoryId,
}: {
  projectId?: string;
  categoryId?: string;
}) {
  const projectInfo = useProjectInfo(projectId);
  const categoryInfo = useCategoryInfo(categoryId);

  return (
    <>
      {projectId && projectInfo.name ? (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border",
            projectInfo.colorClasses?.badge ||
              "bg-muted text-muted-foreground border-border",
          )}
        >
          {projectInfo.name}
        </span>
      ) : null}
      {categoryId && categoryInfo.name ? (
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border",
            categoryInfo.colorClasses?.badge ||
              "bg-muted text-muted-foreground border-border",
          )}
        >
          {categoryInfo.name}
        </span>
      ) : null}
    </>
  );
}

export function KanbanTaskCard({
  task,
  index,
  onToggle,
  onDelete,
  onSetCurrent,
  onSelect,
  onEnterFocus,
  classes,
}: KanbanTaskCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key={task.id}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.2,
        delay: index * 0.03,
      }}
      className="group"
    >
      <div
        onClick={() => onSelect(task)}
        className={cn(
          "relative rounded-xl border p-4 transition-all cursor-pointer overflow-hidden",
          task.isCurrent
            ? cn(classes.border, "bg-accent/50 ring-1 ring-primary/20")
            : "border-border bg-card hover:border-primary/30 hover:shadow-md",
        )}
      >
        {/* Indicator line for current task */}
        {task.isCurrent && (
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1",
              classes.gradientBg.replace("/10", ""),
            )}
          />
        )}

        <div className="flex items-start gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className={cn(
              "mt-0.5 size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0",
              task.isCompleted
                ? "bg-primary border-primary"
                : "border-border hover:border-primary bg-background",
            )}
          >
            {task.isCompleted ? (
              <Check className="size-3 text-primary-foreground" />
            ) : null}
          </button>

          <div className="flex-1 min-w-0">
            <p
              className={cn(
                "text-sm leading-relaxed pr-2",
                task.isCompleted && "line-through text-muted-foreground",
                task.isCurrent && cn(classes.textPrimary, "font-medium"),
                !task.isCompleted && !task.isCurrent && "text-foreground",
              )}
            >
              {task.title}
            </p>

            {/* Badges row */}
            {(task.projectId || task.categoryId) && !task.isCompleted && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                <TaskMetadataBadges
                  projectId={task.projectId}
                  categoryId={task.categoryId}
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.isCurrent && !task.isCompleted && (
              <>
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterFocus(task);
                  }}
                  className={cn(
                    "p-1.5 rounded-md border transition-colors",
                    "border-border hover:border-primary/50 hover:bg-accent",
                    classes.textPrimary,
                  )}
                  title="Modo Foco"
                >
                  <Zap className="size-3.5" />
                </button>
              </>
            )}
            {task.isCurrent && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnterFocus(task);
                }}
                className={cn(
                  "p-1.5 rounded-md border transition-colors",
                  "border-primary/30 bg-primary/10 hover:bg-primary/20",
                  classes.textPrimary,
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
}
