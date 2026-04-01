"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
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

  const updateNotesMutation = useUpdateTaskNotes();
  const { data: parentTask } = useTaskParent(task?.id || "");
  const { data: childTask } = useTaskChild(task?.id || "");

  useEffect(() => {
    if (task) {
      setNotes(task.notes || "");
    }
  }, [task?.id, task]);

  const handleSaveNotes = () => {
    if (task) {
      updateNotesMutation.mutate({ id: task.id, notes });
      setIsEditing(false);
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
              <button
                onClick={() => onToggle(task.id)}
                className={cn(
                  "mt-0.5 size-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                  task.isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted hover:border-primary bg-background",
                )}
              >
                {task.isCompleted && <Check className="size-3.5" />}
              </button>

              <div className="flex-1 min-w-0 pt-0.5">
                <DialogTitle
                  className={cn(
                    "text-xl font-semibold leading-tight text-left",
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
                    className="gap-1.5 h-9"
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
                      "gap-1.5 h-9",
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
                  className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground"
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

              {/* Notes section */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h3 className="font-medium flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                    <Tag className="size-4" />
                    Notas y codigo
                  </h3>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-8"
                    >
                      Editar
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex flex-col gap-3">
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Escribe aqui tus notas, comandos SQL, snippets de codigo..."
                      className="min-h-[16rem] font-mono text-sm resize-none"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveNotes}
                        className="gap-1.5"
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
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className={cn(
                      "min-h-[200px] p-4 rounded-lg border transition-colors cursor-text whitespace-pre-wrap font-mono text-sm",
                      notes
                        ? "bg-muted/30 border-border/50"
                        : "bg-muted/10 border-border/30 text-muted-foreground italic",
                      "hover:border-border hover:bg-muted/20",
                    )}
                  >
                    {notes ||
                      "Haz click aqui para agregar notas, comandos SQL, links..."}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Context */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                <ArrowRight className="size-4" />
                <h3 className="font-medium">Contexto</h3>
              </div>

              {parentTask && (
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
              )}

              {childTask && (
                <Card
                  className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all border-l-4 border-l-primary/50"
                  onClick={() => onNavigateToTask?.(childTask)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <ArrowRight className="size-3" />
                      Continua en
                    </div>
                    <p className="text-sm font-medium line-clamp-2">
                      {childTask.title}
                    </p>
                  </CardContent>
                </Card>
              )}

              {!parentTask && !childTask && (
                <div className="bg-muted/20 p-4 rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    Esta nota no tiene relaciones. Usa el pipeline para
                    establecer el orden.
                  </p>
                </div>
              )}

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
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
      </DialogContent>
    </Dialog>
  );
}
