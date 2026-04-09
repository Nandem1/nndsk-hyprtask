"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import {
  Clock,
  Calendar,
  ArrowRight,
  Play,
  Trash2,
  Focus,
  X,
} from "lucide-react";
import { useTheme } from "@/store/hooks";
import type { Task } from "@/entities/task";
import { FocusButton } from "@/entities/task/ui/FocusButton";
import {
  useUpdateTaskNotes,
  useTaskParent,
  useTaskChild,
} from "@/entities/task";
import { ProjectName, CategoryName } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { CelebrationEffect } from "@/shared/ui/celebration-effect";
import { RichText } from "@/entities/emote";
import { NotesSection, type NotesSectionHandle } from "./NotesSection";
import { useDetailModalShortcuts } from "../hooks/useDetailModalShortcuts";
import { TaskCheckbox } from "@/shared/ui/task-checkbox";
import { ContextCard } from "./ContextCard";
import { useConfirm } from "@/shared/hooks/use-confirm";
import { formatTaskDate } from "@/shared/lib/format-date";
import { stopSpacePropagation } from "@/shared/lib/keyboard-shortcuts";

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onToggle: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onDelete: (id: string) => void;
  onEnterFocus?: () => void;
  onNavigateToTask?: (task: Task) => void;
}

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onToggle,
  onSetCurrent,
  onDelete,
  onEnterFocus,
  onNavigateToTask,
}: TaskDetailModalProps) {
  const { themeClasses } = useTheme();
  const [showCelebration, setShowCelebration] = useState(false);
  const { confirm } = useConfirm();
  const notesRef = useRef<NotesSectionHandle>(null);

  useDetailModalShortcuts({ task, isOpen, notesRef });

  const updateNotesMutation = useUpdateTaskNotes();
  const { data: parentTask } = useTaskParent(task.id);
  const { data: childTask } = useTaskChild(task.id);

  const celebrationPositions = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const angle = (i * 90 * Math.PI) / 180;
      return {
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 30,
      };
    });
  }, []);

  const handleToggleTask = useCallback(() => {
    onToggle(task.id);
    if (!task.isCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [onToggle, task.id, task.isCompleted]);

  const handleSaveNotes = useCallback(
    async (notes: string) => {
      await updateNotesMutation.mutateAsync({ id: task.id, notes });
    },
    [updateNotesMutation, task.id],
  );

  const handleDelete = useCallback(async () => {
    const confirmed = await confirm({
      title: "Eliminar nota",
      description: `¿Estás seguro de que quieres eliminar "${task.title}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      onDelete(task.id);
      onClose();
    }
  }, [confirm, onDelete, onClose, task.id, task.title]);

  const handleSetCurrent = useCallback(() => {
    onSetCurrent(task.id);
  }, [onSetCurrent, task.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0"
        showCloseButton={false}
        onKeyDown={stopSpacePropagation}
      >
        <DialogHeader className="px-6 py-5 border-b border-border/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-4">
              <div className="relative">
                <TaskCheckbox
                  isCompleted={task.isCompleted}
                  onClick={() => handleToggleTask()}
                  variant="md"
                />
                <CelebrationEffect
                  show={showCelebration}
                  mode="positions"
                  positions={celebrationPositions}
                  size="sm"
                />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <DialogTitle
                  className={cn(
                    "text-xl font-semibold leading-tight text-left transition-all duration-300",
                    task.isCompleted && "line-through text-muted-foreground",
                  )}
                >
                  <RichText text={task.title} inline emoteSize="2x" />
                </DialogTitle>
              </div>

              <div className="flex items-center gap-2 shrink-0 pt-0">
                {!task.isCurrent && !task.isCompleted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSetCurrent}
                    className="gap-1.5 h-9 transition-all hover:scale-105"
                  >
                    <Play className="size-3.5" />
                    <span className="hidden sm:inline">Actual</span>
                  </Button>
                )}
                {!task.isCompleted && onEnterFocus && (
                  <FocusButton
                    onClick={() => {
                      onEnterFocus();
                      onClose();
                    }}
                    classes={themeClasses}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                  <span className="sr-only">Cerrar</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap pl-10">
              {task.projectId && (
                <Badge variant="secondary" className="font-normal h-7 px-2.5">
                  <ProjectName projectId={task.projectId} variant="badge" />
                </Badge>
              )}
              {task.categoryId && (
                <Badge variant="outline" className="font-normal h-7 px-2.5">
                  <CategoryName categoryId={task.categoryId} />
                </Badge>
              )}
              {task.isCurrent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge
                    variant="default"
                    className={cn(
                      "gap-1 h-7 px-2.5",
                      themeClasses.gradientBg,
                      themeClasses.textPrimary,
                      "border-0",
                    )}
                  >
                    <Focus className="size-3" />
                    Actual
                  </Badge>
                </motion.div>
              )}
            </div>
          </div>

          <DialogDescription className="sr-only">
            Detalle y edicion de la tarea {task.title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0" />
                  <span>Creada:</span>
                  <span className="text-foreground">
                    {formatTaskDate(task.createdAt, "long")}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0" />
                    <span>Deadline:</span>
                    <span className="text-foreground">
                      {formatTaskDate(task.dueDate, "long")}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              <NotesSection
                key={task.id}
                ref={notesRef}
                initialNotes={task.notes || ""}
                onSave={handleSaveNotes}
              />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <ArrowRight className="size-4" />
                <h3 className="font-medium">Contexto</h3>
              </div>

              {parentTask && (
                <ContextCard
                  task={parentTask}
                  type="parent"
                  onClick={() => onNavigateToTask?.(parentTask)}
                />
              )}

              {childTask && (
                <ContextCard
                  task={childTask}
                  type="child"
                  onClick={() => onNavigateToTask?.(childTask)}
                />
              )}

              {!parentTask && !childTask && (
                <div className="bg-muted/20 p-4 rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    Esta nota no tiene relaciones. Usa el pipeline para
                    establecer el orden.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-all"
                  onClick={handleDelete}
                >
                  <Trash2 className="size-4" />
                  Eliminar nota
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
