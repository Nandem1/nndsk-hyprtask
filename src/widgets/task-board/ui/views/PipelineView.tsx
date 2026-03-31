"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Check, Circle, Lock, Clock, ChevronRight, Zap } from "lucide-react";
import type { Task } from "@/entities/task";
import {
  useProjectInfo,
  useCategoryInfo,
} from "@/entities/task/hooks/use-project-colors";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { Alert, AlertDescription } from "@/shared/ui/alert";

interface PipelineViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  classes: {
    textPrimary: string;
    border: string;
    gradientBg: string;
    gradient: string;
  };
  showForm: boolean;
  canAddTask: boolean;
  onShowForm: () => void;
  formProps: Record<string, unknown>;
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
            "px-2 py-0.5 rounded text-xs",
            projectInfo.colorClasses?.badge || "bg-muted text-muted-foreground",
          )}
        >
          {projectInfo.name}
        </span>
      ) : null}
      {categoryId && categoryInfo.name ? (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs",
            categoryInfo.colorClasses?.badge ||
              "bg-muted text-muted-foreground",
          )}
        >
          {categoryInfo.name}
        </span>
      ) : null}
    </>
  );
}

function PipelineStep({
  task,
  index,
  status,
  isLast,
  onToggle,
  onSetCurrent,
  onSelect,
  onEnterFocus,
  classes,
}: {
  task: Task;
  index: number;
  status: "completed" | "current" | "pending";
  isLast: boolean;
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelect: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  classes: PipelineViewProps["classes"];
}) {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: shouldReduceMotion ? 0 : index * 0.1 }}
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={() => onToggle(task.id)}
          className={cn(
            "size-10 rounded-full flex items-center justify-center border-2 transition-colors",
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : isCurrent
                ? cn("border-primary bg-primary/10", classes.textPrimary)
                : "border-border bg-card",
          )}
        >
          {isCompleted ? (
            <Check className="size-5" />
          ) : (
            <span className="text-sm font-semibold">{index + 1}</span>
          )}
        </motion.button>

        {!isLast ? (
          <div
            className={cn(
              "w-0.5 h-16 mt-2",
              isCompleted ? "bg-primary/50" : "bg-border",
            )}
          />
        ) : null}
      </div>

      <div className="flex-1 pb-8">
        <Card
          className={cn(
            "cursor-pointer transition-shadow hover:shadow-sm",
            isCurrent
              ? cn(classes.border, "ring-1 ring-primary/20")
              : "border-border",
          )}
          onClick={() => onSelect(task)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-medium",
                    isCompleted && "line-through text-muted-foreground",
                    isCurrent && cn(classes.textPrimary, "text-lg"),
                  )}
                >
                  {task.title}
                </h3>

                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <TaskMetadataBadges
                    projectId={task.projectId}
                    categoryId={task.categoryId}
                  />
                  {task.dueDate ? (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {new Date(task.dueDate).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : null}
                </div>

                {(task as Task & { notes?: string }).notes ? (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {(task as Task & { notes?: string }).notes}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                {!isCurrent && !isCompleted ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetCurrent(task.id);
                    }}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ChevronRight />
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
                    >
                      <Zap data-icon="inline-start" />
                      Foco
                    </Button>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      ACTUAL
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export function PipelineView({
  tasks,
  onToggle,
  onSetCurrent,
  onSelectTask,
  onEnterFocus,
  classes,
  showForm,
  canAddTask,
  onShowForm,
}: PipelineViewProps) {
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const currentTask = tasks.find((t) => t.isCurrent && !t.isCompleted);
  const pendingTasks = tasks.filter((t) => !t.isCompleted && !t.isCurrent);

  const orderedTasks = [...completedTasks, currentTask, ...pendingTasks].filter(
    Boolean,
  ) as Task[];

  if (tasks.length === 0 && !showForm) {
    return (
      <EmptyState
        title="Sin notas activas"
        description="Crea tu primera nota para comenzar el pipeline"
        icon={Circle}
        action={
          canAddTask ? <Button onClick={onShowForm}>Crear nota</Button> : null
        }
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Pipeline de desarrollo</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks.length} completadas · {pendingTasks.length}{" "}
            pendientes
          </p>
        </div>
        {canAddTask && !showForm ? (
          <Button variant="outline" size="sm" onClick={onShowForm}>
            + Nueva nota
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col">
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
            />
          );
        })}
      </div>

      {pendingTasks.length > 0 && !canAddTask ? (
        <Alert variant="destructive" className="mt-6">
          <Lock className="size-4" />
          <AlertDescription>
            Limite de notas alcanzado. Completa algunas para agregar mas.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
