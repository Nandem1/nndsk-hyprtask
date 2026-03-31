"use client";

import { motion } from "framer-motion";
import { Check, Circle, Lock, Clock, ChevronRight, Zap } from "lucide-react";
import type { Task } from "@/entities/task";
import {
  useProjectInfo,
  useCategoryInfo,
} from "@/entities/task/hooks/use-project-colors";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

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

// Componente separado para los badges de proyecto/categoría
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
      {projectId && projectInfo.name && (
        <span
          className={`px-2 py-0.5 rounded text-xs ${projectInfo.colorClasses?.badge || "bg-muted text-muted-foreground"}`}
        >
          {projectInfo.name}
        </span>
      )}
      {categoryId && categoryInfo.name && (
        <span
          className={`px-2 py-0.5 rounded text-xs ${categoryInfo.colorClasses?.badge || "bg-muted text-muted-foreground"}`}
        >
          {categoryInfo.name}
        </span>
      )}
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-4"
    >
      {/* Indicador de paso */}
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onToggle(task.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
            isCompleted
              ? "bg-primary border-primary text-primary-foreground"
              : isCurrent
                ? `border-primary ${classes.textPrimary} bg-primary/10`
                : "border-border bg-card"
          }`}
        >
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : (
            <span className="text-sm font-semibold">{index + 1}</span>
          )}
        </motion.button>

        {/* Línea conectora */}
        {!isLast && (
          <div
            className={`w-0.5 h-16 mt-2 ${
              isCompleted ? "bg-primary/50" : "bg-border"
            }`}
          />
        )}
      </div>

      {/* Card de la tarea */}
      <div className="flex-1 pb-8">
        <Card
          className={`cursor-pointer transition-shadow hover:shadow-sm ${
            isCurrent
              ? `${classes.border} ring-1 ring-primary/20`
              : "border-border"
          }`}
          onClick={() => onSelect(task)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3
                  className={`font-medium ${
                    isCompleted
                      ? "line-through text-muted-foreground"
                      : isCurrent
                        ? `${classes.textPrimary} text-lg`
                        : ""
                  }`}
                >
                  {task.title}
                </h3>

                {/* Metadata */}
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <TaskMetadataBadges
                    projectId={task.projectId}
                    categoryId={task.categoryId}
                  />
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}
                </div>

                {/* Preview de notas si tiene */}
                {(task as Task & { notes?: string }).notes && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {(task as Task & { notes?: string }).notes}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2">
                {!isCurrent && !isCompleted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetCurrent(task.id);
                    }}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
                {isCurrent && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnterFocus?.(task);
                      }}
                    >
                      <Zap className="w-3.5 h-3.5 mr-1.5" />
                      Foco
                    </Button>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      ACTUAL
                    </span>
                  </div>
                )}
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

  // Ordenar: completadas primero, luego actual, luego pendientes
  const orderedTasks = [...completedTasks, currentTask, ...pendingTasks].filter(
    Boolean,
  ) as Task[];

  if (tasks.length === 0 && !showForm) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <Circle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Sin notas activas</h3>
        <p className="text-muted-foreground mb-4">
          Crea tu primera nota para comenzar el pipeline
        </p>
        {canAddTask && <Button onClick={onShowForm}>Crear nota</Button>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header del pipeline */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Pipeline de desarrollo</h2>
          <p className="text-sm text-muted-foreground">
            {completedTasks.length} completadas · {pendingTasks.length}{" "}
            pendientes
          </p>
        </div>
        {canAddTask && !showForm && (
          <Button variant="outline" size="sm" onClick={onShowForm}>
            + Nueva nota
          </Button>
        )}
      </div>

      {/* Pasos del pipeline */}
      <div className="space-y-0">
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

      {/* Bloqueado por límite */}
      {pendingTasks.length > 0 && !canAddTask && (
        <div className="mt-6 p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 flex items-center gap-3">
          <Lock className="w-5 h-5 text-yellow-500" />
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Límite de notas alcanzado. Completa algunas para agregar más.
          </p>
        </div>
      )}
    </div>
  );
}
