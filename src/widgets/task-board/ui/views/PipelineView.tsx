"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions, containerVariants } from "@/shared/lib/animations";
import { Circle, Lock, Plus } from "lucide-react";
 import type { Task } from "@/entities/task";
 import { Button } from "@/shared/ui/button";
 import { EmptyState } from "@/shared/ui/empty-state";
 import { Alert, AlertDescription } from "@/shared/ui/alert";
 import { PipelineStep } from "./PipelineStep";
 import type { useThemeState } from "@/store/hooks";



interface PipelineViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  onReorder?: (tasks: Task[]) => void;
  onCreateTask: () => void;
  canAddTask: boolean;
  classes: ReturnType<typeof useThemeState>["themeClasses"];
}

export function PipelineView({
  tasks,
  onToggle,
  onSetCurrent,
  onSelectTask,
  onEnterFocus,
  onReorder,
  onCreateTask,
  canAddTask,
  classes,
}: PipelineViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const { completedTasks, pendingTasks, orderedTasks } = useMemo(() => {
    const completed = tasks.filter((t) => t.isCompleted);
    const current = tasks.find((t) => t.isCurrent && !t.isCompleted);
    const pending = tasks.filter((t) => !t.isCompleted && !t.isCurrent);
    const ordered = [...completed, current, ...pending].filter(Boolean) as Task[];
    return { completedTasks: completed, pendingTasks: pending, orderedTasks: ordered };
  }, [tasks]);

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="Sin notas activas"
        description="Crea tu primera nota para comenzar el pipeline"
        icon={Circle}
        action={
          canAddTask ? (
            <Button onClick={onCreateTask} className="gap-2">
              <Plus className="size-4" />
              Crear nota
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">Pipeline de desarrollo</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks.length} completadas · {pendingTasks.length}{" "}
            pendientes
          </p>
        </div>
        {canAddTask ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateTask}
            className="gap-1.5 shrink-0 h-9"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nueva nota</span>
          </Button>
        ) : null}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-0"
      >
        <AnimatePresence mode="popLayout">
          {orderedTasks.map((task, index) => {
            const status = task.isCompleted
              ? "completed"
              : task.isCurrent
                ? "current"
                : "pending";

            return (
              <PipelineStep
                key={task.id}
                task={task}
                index={index}
                status={status}
                isLast={index === orderedTasks.length - 1}
                onToggle={onToggle}
                onSetCurrent={onSetCurrent}
                onSelect={onSelectTask}
                onEnterFocus={onEnterFocus}
                classes={classes}
                enableDrag={!!onReorder}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {pendingTasks.length > 0 && !canAddTask ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transitions.spring}
          >
            <Alert variant="destructive" className="mt-6">
              <Lock className="size-4" />
              <AlertDescription>
                Limite de notas alcanzado. Completa algunas para agregar mas.
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
