"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import {
  Check,
  Clock,
  Calendar,
  Tag,
  ArrowRight,
  ArrowLeft,
  Play,
  Save,
  Trash2,
  Zap,
  Focus,
  X,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import type { Task } from "@/entities/task";
import {
  useUpdateTaskNotes,
  useTaskParent,
  useTaskChild,
} from "@/entities/task";
import { useProjectInfo, useCategoryInfo } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Textarea } from "@/shared/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { CelebrationEffect } from "@/shared/ui/celebration-effect";
import { useConfirm } from "@/shared/hooks/use-confirm";

// Componentes puros para evitar re-renders innecesarios
function ProjectName({ projectId }: { projectId: string }) {
  const { name, colorClasses } = useProjectInfo(projectId);
  return (
    <span className={cn("text-xs font-medium", colorClasses.text)}>{name}</span>
  );
}

function CategoryName({ categoryId }: { categoryId: string }) {
  const { name, colorClasses } = useCategoryInfo(categoryId);
  return (
    <span className={cn("text-xs font-medium", colorClasses.text)}>{name}</span>
  );
}

// ARQUITECTURA: Componente de checkbox animado simplificado
function AnimatedCheckbox({ 
  isCompleted, 
  onClick 
}: { 
  isCompleted: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "mt-0.5 size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 relative",
        isCompleted
          ? "bg-primary border-primary text-primary-foreground"
          : "border-muted hover:border-primary bg-background",
      )}
    >
      <AnimatePresence initial={false}>
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={transitions.springBouncy}
          >
            <Check className="size-3.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ARQUITECTURA: Sección de notas con estado local aislado
function NotesSection({ 
  initialNotes, 
  onSave 
}: { 
  initialNotes: string;
  onSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await onSave(notes);
    setIsSaving(false);
    setIsEditing(false);
  }, [notes, onSave]);

  const handleCancel = useCallback(() => {
    setNotes(initialNotes);
    setIsEditing(false);
  }, [initialNotes]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
          <Tag className="size-4" />
          Notas y código
        </h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-8 transition-colors"
          >
            Editar
          </Button>
        )}
      </div>

      <motion.div layout transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}>
        <AnimatePresence mode="popLayout" initial={false}>
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col gap-3"
            >
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí tus notas, comandos SQL, snippets de código..."
                className="min-h-[16rem] font-mono text-sm resize-none"
                autoFocus
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-1.5 transition-all hover:scale-105"
                >
                  <Save className="size-3.5" />
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="transition-colors"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              onClick={() => setIsEditing(true)}
              className={cn(
                "min-h-[200px] p-4 rounded-lg border transition-colors cursor-text whitespace-pre-wrap font-mono text-sm",
                notes
                  ? "bg-muted/30 border-border/50"
                  : "bg-muted/10 border-border/30 text-muted-foreground italic",
                "hover:border-border hover:bg-muted/20",
              )}
            >
              {notes || "Haz click aquí para agregar notas, comandos SQL, links..."}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ARQUITECTURA: Tarjeta de contexto simplificada sin AnimatePresence
function ContextCard({
  task,
  type,
  onClick,
}: {
  task: Task;
  type: "parent" | "child";
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: type === "parent" ? 0.1 : 0.15 }}
    >
      <Card
        className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-l-4 border-l-primary/50"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            {type === "parent" ? (
              <>
                <ArrowLeft className="size-3" />
                Viene de
              </>
            ) : (
              <>
                <ArrowRight className="size-3" />
                Continúa en
              </>
            )}
          </div>
          <p className="text-sm font-medium line-clamp-2">{task.title}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

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

// ARQUITECTURA: Componente principal con mínimo estado y sin AnimatePresence anidados problemáticos
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
  const { themeClasses } = useThemeState();
  const [showCelebration, setShowCelebration] = useState(false);
  const { confirm } = useConfirm();

  const updateNotesMutation = useUpdateTaskNotes();
  const { data: parentTask } = useTaskParent(task.id);
  const { data: childTask } = useTaskChild(task.id);

  // ARQUITECTURA: Precalcular posiciones de celebración una sola vez
  const celebrationPositions = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const angle = (i * 90 * Math.PI) / 180;
      return {
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 30,
      };
    });
  }, []);

  // ARQUITECTURA: Callbacks memoizados para evitar re-renders
  const handleToggleTask = useCallback(() => {
    onToggle(task.id);
    if (!task.isCompleted) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [onToggle, task.id, task.isCompleted]);

  const handleSaveNotes = useCallback(async (notes: string) => {
    await updateNotesMutation.mutateAsync({ id: task.id, notes });
  }, [updateNotesMutation, task.id]);

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
      >
        <DialogHeader className="px-6 py-5 border-b border-border/50">
          <div className="flex flex-col gap-3">
            {/* Top row: Title and actions */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <AnimatedCheckbox 
                  isCompleted={task.isCompleted} 
                  onClick={handleToggleTask} 
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
                  {task.title}
                </DialogTitle>
              </div>

              {/* Actions */}
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
                  <Button
                    size="sm"
                    onClick={() => {
                      onEnterFocus();
                      onClose();
                    }}
                    className={cn(
                      "gap-1.5 h-9 transition-all hover:scale-105",
                      themeClasses.gradientBg,
                      themeClasses.textPrimary,
                    )}
                  >
                    <Zap className="size-3.5" />
                    <span className="hidden sm:inline">Foco</span>
                  </Button>
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

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap pl-10">
              {task.projectId && (
                <Badge variant="secondary" className="font-normal h-7 px-2.5">
                  <ProjectName projectId={task.projectId} />
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
            {/* Main content */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 shrink-0" />
                  <span>Creada:</span>
                  <span className="text-foreground">
                    {new Date(task.createdAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 shrink-0" />
                    <span>Deadline:</span>
                    <span className="text-foreground">
                      {new Date(task.dueDate).toLocaleDateString("es-ES")}
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Notes section - Componente aislado */}
              <NotesSection
                key={task.id}
                initialNotes={task.notes || ""}
                onSave={handleSaveNotes}
              />
            </div>

            {/* Sidebar - Context */}
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
