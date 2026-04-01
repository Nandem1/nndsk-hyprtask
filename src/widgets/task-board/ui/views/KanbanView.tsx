"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Plus, Circle, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import type { Task } from "@/entities/task";
import type { useThemeState } from "@/store/hooks";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface KanbanViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ReturnType<typeof useThemeState>["themeClasses"];
  totalCount: number;
  filteredCount: number;
  onSelectTask: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
  onCreateTask: () => void;
  canAddTask: boolean;
}

export function KanbanView({
  tasks,
  onToggle,
  onDelete,
  onSetCurrent,
  classes,
  totalCount,
  filteredCount,
  onSelectTask,
  onEnterFocus,
  onCreateTask,
  canAddTask,
}: KanbanViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const todoTasks = tasks.filter((t) => !t.isCompleted && !t.isCurrent);
  const activeTask = tasks.find((t) => t.isCurrent && !t.isCompleted);
  const doneTasks = tasks.filter((t) => t.isCompleted);

  const renderColumn = (
    title: string,
    icon: React.ReactNode,
    count: number,
    columnTasks: Task[],
    isActiveColumn = false,
  ) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        {icon}
        <h3
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            isActiveColumn ? classes.textPrimary : "text-muted-foreground",
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            "text-xs ml-auto",
            isActiveColumn ? classes.textPrimary : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {columnTasks.map((task, index) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              index={index}
              onToggle={onToggle}
              onDelete={onDelete}
              onSetCurrent={onSetCurrent}
              onSelect={onSelectTask}
              onEnterFocus={onEnterFocus}
              classes={classes}
            />
          ))}
        </AnimatePresence>
        {columnTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/30">
            Sin tareas
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderColumn(
          "Por Hacer",
          <Circle className="size-4 text-muted-foreground" />,
          todoTasks.length,
          todoTasks,
        )}

        {renderColumn(
          "En Progreso",
          <Circle className={cn("size-4 fill-current", classes.textPrimary)} />,
          activeTask ? 1 : 0,
          activeTask ? [activeTask] : [],
          true,
        )}

        {renderColumn(
          "Completadas",
          <Check className="size-4 text-muted-foreground" />,
          doneTasks.length,
          doneTasks,
        )}
      </div>

      {tasks.length === 0 && (
        <EmptyState
          title={
            totalCount === 0
              ? "Sin notas aun"
              : "No hay notas con estos filtros"
          }
          description={
            totalCount === 0
              ? "Crea tu primera nota para comenzar"
              : "Prueba cambiando los filtros"
          }
          action={
            canAddTask && totalCount === 0 ? (
              <Button onClick={onCreateTask} className="gap-2">
                <Plus data-icon="inline-start" className="size-4" />
                Crear nota
              </Button>
            ) : null
          }
        />
      )}
    </div>
  );
}
