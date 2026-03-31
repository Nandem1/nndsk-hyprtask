"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/utils";
import {
  X,
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
  const { name } = useProjectInfo(projectId);
  return <>{name}</>;
}

function CategoryName({ categoryId }: { categoryId: string }) {
  const { name } = useCategoryInfo(categoryId);
  return <>{name}</>;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggle(task.id)}
                className={cn(
                  "size-8 rounded-full border-2 flex items-center justify-center transition-all",
                  task.isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted hover:border-primary",
                )}
              >
                {task.isCompleted && <Check className="size-4" />}
              </button>

              <div>
                <DialogTitle
                  className={cn(
                    "text-xl font-semibold",
                    task.isCompleted && "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  {task.projectId && (
                    <Badge variant="secondary">
                      <ProjectName projectId={task.projectId} />
                    </Badge>
                  )}
                  {task.categoryId && (
                    <Badge variant="outline">
                      <CategoryName categoryId={task.categoryId} />
                    </Badge>
                  )}
                  {task.isCurrent && (
                    <Badge variant="default">
                      <Play className="size-3" />
                      Actual
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!task.isCurrent && !task.isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetCurrent(task.id)}
                  className={themeClasses.textPrimary}
                >
                  <Play data-icon="inline-start" />
                  Hacer actual
                </Button>
              )}
              {!task.isCompleted && onEnterFocus && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    onEnterFocus();
                    onClose();
                  }}
                >
                  <Zap data-icon="inline-start" />
                  Modo Foco
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X />
              </Button>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Detalle y edicion de la tarea {task.title}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  Creada:{" "}
                  {new Date(task.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                {task.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="size-4" />
                    Deadline:{" "}
                    {new Date(task.dueDate).toLocaleDateString("es-ES")}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium flex items-center gap-2">
                    <Tag className="size-4" />
                    Notas y codigo
                  </h3>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
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
                      <Button size="sm" onClick={handleSaveNotes}>
                        <Save data-icon="inline-start" />
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
                      "min-h-[200px] p-4 rounded-lg border border-border/50 cursor-text whitespace-pre-wrap font-mono text-sm",
                      notes
                        ? "bg-muted/30"
                        : "bg-muted/10 text-muted-foreground italic",
                    )}
                  >
                    {notes ||
                      "Haz click aqui para agregar notas, comandos SQL, links..."}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Contexto
              </h3>

              {parentTask && (
                <Card
                  className="cursor-pointer hover:border-primary/50 transition-colors"
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
                  className="cursor-pointer hover:border-primary/50 transition-colors"
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
                <p className="text-sm text-muted-foreground italic">
                  Esta nota no tiene relaciones. Usa el pipeline para establecer
                  el orden.
                </p>
              )}

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("¿Eliminar esta nota?")) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
              >
                <Trash2 data-icon="inline-start" />
                Eliminar nota
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
