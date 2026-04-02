"use client";

import { AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Plus, Circle, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import type { Task } from "@/entities/task";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface KanbanColumnProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  tasks: Task[];
  isActive?: boolean;
  classes: ExtendedThemeClasses;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
}

function KanbanColumn({
  title,
  icon,
  count,
  tasks,
  isActive = false,
  classes,
  onToggle,
  onDelete,
  onSetCurrent,
  onSelectTask,
  onEnterFocus,
}: KanbanColumnProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3 px-1">
        {icon}
        <h3
          className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            isActive ? classes.textPrimary : "text-muted-foreground",
          )}
        >
          {title}
        </h3>
        <span
          className={cn(
            "text-xs ml-auto",
            isActive ? classes.textPrimary : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => (
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
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/30">
            Sin tareas
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface KanbanViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ExtendedThemeClasses;
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
  const todoTasks = tasks.filter((t) => !t.isCompleted && !t.isCurrent);
  const activeTask = tasks.find((t) => t.isCurrent && !t.isCompleted);
  const doneTasks = tasks.filter((t) => t.isCompleted);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="Por Hacer"
          icon={<Circle className="size-4 text-muted-foreground" />}
          count={todoTasks.length}
          tasks={todoTasks}
          classes={classes}
          onToggle={onToggle}
          onDelete={onDelete}
          onSetCurrent={onSetCurrent}
          onSelectTask={onSelectTask}
          onEnterFocus={onEnterFocus}
        />

        <KanbanColumn
          title="En Progreso"
          icon={<Circle className={cn("size-4 fill-current", classes.textPrimary)} />}
          count={activeTask ? 1 : 0}
          tasks={activeTask ? [activeTask] : []}
          isActive
          classes={classes}
          onToggle={onToggle}
          onDelete={onDelete}
          onSetCurrent={onSetCurrent}
          onSelectTask={onSelectTask}
          onEnterFocus={onEnterFocus}
        />

        <KanbanColumn
          title="Completadas"
          icon={<Check className="size-4 text-muted-foreground" />}
          count={doneTasks.length}
          tasks={doneTasks}
          classes={classes}
          onToggle={onToggle}
          onDelete={onDelete}
          onSetCurrent={onSetCurrent}
          onSelectTask={onSelectTask}
          onEnterFocus={onEnterFocus}
        />
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
