"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import {
  transitions,
  listItemVariants,
  containerVariants,
} from "@/shared/lib/animations";
import {
  Check,
  Circle,
  Lock,
  Clock,
  ChevronRight,
  Zap,
  Plus,
  Focus,
  GripVertical,
} from "lucide-react";
import type { Task } from "@/entities/task";
import {
  useProjectInfo,
  useCategoryInfo,
} from "@/entities/task/hooks/use-project-colors";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { EmptyState } from "@/shared/ui/empty-state";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { useTaskDrag } from "@/shared/lib/dnd-context";
import { CSS } from "@dnd-kit/utilities";

interface PipelineViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEnterFocus?: (task: Task) => void;
  onReorder?: (tasks: Task[]) => void;
  onCreateTask: () => void;
  canAddTask: boolean;
  classes: {
    textPrimary: string;
    border: string;
    gradientBg: string;
    gradient: string;
    glassBg?: string;
    glassBorder?: string;
    depthShadow?: string;
    depthShadowHover?: string;
  };
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
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors",
            projectInfo.colorClasses?.badge ||
              "bg-muted text-muted-foreground border-border hover:border-primary/30",
          )}
        >
          {projectInfo.name}
        </motion.span>
      ) : null}
      {categoryId && categoryInfo.name ? (
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors",
            categoryInfo.colorClasses?.badge ||
              "bg-muted text-muted-foreground border-border hover:border-primary/30",
          )}
        >
          {categoryInfo.name}
        </motion.span>
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
  enableDrag = false,
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
  enableDrag?: boolean;
}) {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const shouldReduceMotion = useReducedMotion();

  // Drag and drop setup
  const { attributes, listeners, setNodeRef, transform, isDragging } = enableDrag
    ? useTaskDrag(task.id)
    : {
        attributes: {},
        listeners: undefined,
        setNodeRef: () => {},
        transform: null,
        isDragging: false,
      };

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      // ELIMINADO: layout prop que causaba layout thrashing
      variants={listItemVariants}
      initial={shouldReduceMotion ? { opacity: 1 } : "hidden"}
      animate={isDragging ? { opacity: 0.5, scale: 1.02 } : "visible"}
      exit={{ opacity: 0, x: -20 }}
      transition={shouldReduceMotion ? { duration: 0 } : transitions.spring}
      className={cn("flex items-start gap-4", isDragging && "opacity-50")}
    >
      {/* Step indicator */}
      <div className="flex flex-col items-center">
        <motion.button
          whileHover={shouldReduceMotion ? undefined : { scale: 1.1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={() => onToggle(task.id)}
          className={cn(
            "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0",
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

      {/* Card */}
      <div className="flex-1 pb-8">
        <motion.div
          // ELIMINADO: layout prop que causaba layout thrashing
          whileHover={shouldReduceMotion ? undefined : { y: -2, transition: { duration: 0.2 } }}
        >
          <Card
            className={cn(
              "relative cursor-pointer overflow-hidden",
              // Reducido: backdrop-blur-xl → backdrop-blur-sm para mejor rendimiento
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
            {/* Drag handle */}
            {enableDrag && (
              <div
                {...attributes}
                {...listeners}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 z-10",
                  "p-1.5 rounded-md cursor-grab active:cursor-grabbing",
                  "text-muted-foreground hover:text-foreground",
                  "hover:bg-white/10 dark:hover:bg-white/5",
                  "transition-colors",
                )}
              >
                <GripVertical className="size-4" />
              </div>
            )}

            {/* Left accent line for current */}
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
                  <motion.h3
                    // ELIMINADO: layout="position" que causaba recálculos
                    className={cn(
                      "font-medium transition-all duration-300",
                      isCompleted && "line-through text-muted-foreground",
                      isCurrent && cn(classes.textPrimary, "text-lg"),
                    )}
                  >
                    {task.title}
                  </motion.h3>

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
                    {(task as Task & { notes?: string }).notes ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 text-sm text-muted-foreground line-clamp-2 bg-muted/30 p-2 rounded"
                      >
                        {(task as Task & { notes?: string }).notes}
                      </motion.p>
                    ) : null}
                  </AnimatePresence>
                </div>

                {/* Actions */}
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
                          "gap-1.5 h-9 transition-all duration-200 hover:scale-105",
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
  const completedTasks = tasks.filter((t) => t.isCompleted);
  const currentTask = tasks.find((t) => t.isCurrent && !t.isCompleted);
  const pendingTasks = tasks.filter((t) => !t.isCompleted && !t.isCurrent);

  const orderedTasks = [...completedTasks, currentTask, ...pendingTasks].filter(
    Boolean,
  ) as Task[];

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
      {/* Header */}
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

      {/* Steps */}
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

      {/* Limit alert */}
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
