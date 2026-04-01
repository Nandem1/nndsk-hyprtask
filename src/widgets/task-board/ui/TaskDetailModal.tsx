"use client";

import { useState, useEffect, useMemo } from "react";
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
  Sparkles,
} from "lucide-react";
import { useThemeState } from "@/store/hooks";
import type { Task } from "@/entities/task";
import {
  useUpdateTaskNotes,
  useTaskParent,
  useTaskChild,
  useProjectInfo,
  useCategoryInfo,
} from "@/entities/task";
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

// Hook to detect reduced motion preference
function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}

interface TaskDetailModalProps {
  task: Task | null;
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
  const { themeClasses } = useThemeState();
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const updateNotesMutation = useUpdateTaskNotes();
  const { data: parentTask } = useTaskParent(task?.id || "");
  const { data: childTask } = useTaskChild(task?.id || "");

  // Precalculate celebration positions with useMemo (4 elements instead of 6)
  const celebrationPositions = useMemo(() => {
    return [0, 1, 2, 3].map((i) => {
      const angle = (i * 90 * Math.PI) / 180;
      return {
        x: Math.cos(angle) * 30,
        y: Math.sin(angle) * 30,
      };
    });
  }, []);

  useEffect(() => {
    if (task) {
      setNotes(task.notes || "");
    }
  }, [task?.id, task?.notes]);

  const handleSaveNotes = () => {
    if (task) {
      updateNotesMutation.mutate({ id: task.id, notes });
      setIsEditing(false);
    }
  };

  const handleToggleTask = () => {
    if (task) {
      onToggle(task.id);
      if (!task.isCompleted) {
        // Mostrar celebración al completar
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0" showCloseButton={false}>
        <DialogHeader className="px-6 py-5 border-b border-border/50">
          <div className="flex flex-col gap-3">
            {/* Top row: Title and actions */}
            <div className="flex items-start gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleTask}
                className={cn(
                  "mt-0.5 size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 relative",
                  task.isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted hover:border-primary bg-background",
                )}
              >
                <AnimatePresence>
                  {task.isCompleted && (
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
                
                {/* Celebración al completar - Optimized with GPU acceleration */}
                <AnimatePresence>
                  {showCelebration && !prefersReducedMotion && (
                    <>
                      {celebrationPositions.map((pos, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1.5, 0],
                            opacity: [1, 1, 0],
                            x: pos.x,
                            y: pos.y,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{ 
                            duration: 0.6, 
                            ease: [0.4, 0, 0.2, 1] // Lighter cubic-bezier easing
                          }}
                          style={{
                            willChange: "transform, opacity",
                            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                          }}
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                          <Sparkles className="size-3 text-primary" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.button>

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
                    onClick={() => onSetCurrent(task.id)}
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
              <AnimatePresence>
                {task.isCurrent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={transitions.spring}
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
              </AnimatePresence>
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

              {/* Notes section */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                    <Tag className="size-4" />
                    Notas y código
                  </h3>
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key="edit-button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="h-8 transition-colors"
                        >
                          Editar
                        </Button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={transitions.spring}
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
                          onClick={handleSaveNotes}
                          className="gap-1.5 transition-all hover:scale-105"
                        >
                          <Save className="size-3.5" />
                          Guardar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false);
                            setNotes(task.notes || "");
                          }}
                          className="transition-colors"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="view-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={transitions.spring}
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        "min-h-[200px] p-4 rounded-lg border transition-all duration-200 cursor-text whitespace-pre-wrap font-mono text-sm",
                        notes
                          ? "bg-muted/30 border-border/50"
                          : "bg-muted/10 border-border/30 text-muted-foreground italic",
                        "hover:border-border hover:bg-muted/20",
                      )}
                    >
                      {notes ||
                        "Haz click aquí para agregar notas, comandos SQL, links..."}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar - Context */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <ArrowRight className="size-4" />
                <h3 className="font-medium">Contexto</h3>
              </div>

              <AnimatePresence mode="wait">
                {parentTask && (
                  <motion.div
                    key={parentTask.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={transitions.spring}
                  >
                    <Card
                      className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-l-4 border-l-primary/50"
                      onClick={() => onNavigateToTask?.(parentTask)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <ArrowLeft className="size-3" />
                          Viene de
                        </div>
                        <p className="text-sm font-medium line-clamp-2">
                          {parentTask.title}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {childTask && (
                  <motion.div
                    key={childTask.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={transitions.spring}
                  >
                    <Card
                      className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-l-4 border-l-primary/50"
                      onClick={() => onNavigateToTask?.(childTask)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <ArrowRight className="size-3" />
                          Continúa en
                        </div>
                        <p className="text-sm font-medium line-clamp-2">
                          {childTask.title}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {!parentTask && !childTask && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-muted/20 p-4 rounded-lg border border-dashed border-border"
                  >
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      Esta nota no tiene relaciones. Usa el pipeline para
                      establecer el orden.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 transition-all"
                  onClick={() => {
                    if (confirm("¿Eliminar esta nota?")) {
                      onDelete(task.id);
                      onClose();
                    }
                  }}
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
