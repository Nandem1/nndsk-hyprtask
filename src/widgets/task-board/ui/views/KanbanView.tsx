"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Trash2, Target, Circle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { TaskForm } from "@/entities/task";
import type { Task } from "@/entities/task";
import type { useTheme } from "@/store/hooks";

interface KanbanViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ReturnType<typeof useTheme>["themeClasses"];
  showForm: boolean;
  canAddTask: boolean;
  onShowForm: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formProps: any;
  totalCount: number;
  filteredCount: number;
}

export function KanbanView({
  tasks,
  onToggle,
  onDelete,
  onSetCurrent,
  classes,
  showForm,
  canAddTask,
  onShowForm,
  formProps,
  totalCount,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  filteredCount,
}: KanbanViewProps) {
  const todoTasks = tasks.filter((t) => !t.isCompleted && !t.isCurrent);
  const activeTask = tasks.find((t) => t.isCurrent && !t.isCompleted);
  const doneTasks = tasks.filter((t) => t.isCompleted);

  const renderTask = (task: Task, index: number) => (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group"
    >
      <div
        className={`rounded-lg border p-3 transition-all hover:shadow-sm ${
          task.isCurrent
            ? `${classes.border} bg-accent`
            : "border-border bg-card hover:border-border/80"
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggle(task.id)}
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
              task.isCompleted
                ? "bg-primary border-primary"
                : "border-border hover:border-primary"
            }`}
          >
            {task.isCompleted && (
              <Check className="h-3 w-3 text-primary-foreground" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm leading-relaxed ${
                task.isCompleted
                  ? "line-through text-muted-foreground"
                  : task.isCurrent
                    ? `${classes.textPrimary} font-medium`
                    : "text-foreground"
              }`}
            >
              {task.title}
            </p>
            {(task.projectId || task.categoryId) && !task.isCompleted && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {task.projectId && (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Proyecto
                  </span>
                )}
                {task.categoryId && (
                  <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                    Categoría
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!task.isCurrent && !task.isCompleted && (
              <button
                onClick={() => onSetCurrent(task.id)}
                className="p-1.5 rounded-md border border-border hover:bg-accent transition-colors"
                title="Marcar como actual"
              >
                <Target className={`h-3.5 w-3.5 ${classes.textPrimary}`} />
              </button>
            )}
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-destructive transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderColumn = (
    title: string,
    icon: React.ReactNode,
    count: number,
    columnTasks: Task[],
    isActiveColumn = false,
  ) => (
    <div className="flex flex-col h-full">
      {/* Header de columna */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {icon}
        <h3
          className={`text-sm font-semibold uppercase tracking-wide ${
            isActiveColumn ? classes.textPrimary : "text-muted-foreground"
          }`}
        >
          {title}
        </h3>
        <span
          className={`text-xs ml-auto ${isActiveColumn ? classes.textPrimary : "text-muted-foreground"}`}
        >
          {count}
        </span>
      </div>

      {/* Lista de tareas */}
      <div className="flex-1 space-y-2 min-h-[100px]">
        <AnimatePresence mode="popLayout">
          {columnTasks.map((task, index) => renderTask(task, index))}
        </AnimatePresence>
        {columnTasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/30">
            Sin tareas
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Grid de columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do */}
        {renderColumn(
          "Por Hacer",
          <Circle className="h-4 w-4 text-muted-foreground" />,
          todoTasks.length,
          todoTasks,
        )}

        {/* Active */}
        {renderColumn(
          "En Progreso",
          <Circle className={`h-4 w-4 ${classes.textPrimary} fill-current`} />,
          activeTask ? 1 : 0,
          activeTask ? [activeTask] : [],
          true,
        )}

        {/* Done */}
        {renderColumn(
          "Completadas",
          <Check className="h-4 w-4 text-muted-foreground" />,
          doneTasks.length,
          doneTasks,
        )}
      </div>

      {/* Formulario */}
      {showForm && canAddTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <TaskForm {...formProps} />
        </motion.div>
      )}

      {/* Botón para agregar */}
      {!showForm && canAddTask && (
        <Button onClick={onShowForm} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Nueva nota
        </Button>
      )}

      {/* Estado vacío */}
      {tasks.length === 0 && !showForm && (
        <div className="rounded-xl border border-border p-8 text-center bg-card">
          <p className="text-foreground text-base font-medium mb-1">
            {totalCount === 0
              ? "Sin notas aún"
              : "No hay notas con estos filtros"}
          </p>
          <p className="text-sm text-muted-foreground">
            {totalCount === 0
              ? "Crea tu primera nota para comenzar"
              : "Prueba cambiando los filtros"}
          </p>
        </div>
      )}
    </div>
  );
}
