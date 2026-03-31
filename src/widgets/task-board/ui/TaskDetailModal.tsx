"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Componentes auxiliares para mostrar nombres
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

  // Hooks para notas
  const updateNotesMutation = useUpdateTaskNotes();

  // Hooks para relaciones
  const { data: parentTask } = useTaskParent(task?.id || "");
  const { data: childTask } = useTaskChild(task?.id || "");

  // Cargar notas cuando cambia la tarea
  useEffect(() => {
    if (task) {
      setNotes(task.notes || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]);

  // Guardar notas en la tarea persistente
  const handleSaveNotes = () => {
    if (task) {
      updateNotesMutation.mutate({ id: task.id, notes });
      setIsEditing(false);
    }
  };

  if (!task) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-background rounded-2xl border border-border shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onToggle(task.id)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted hover:border-primary"
                  }`}
                >
                  {task.isCompleted && <Check className="w-4 h-4" />}
                </button>

                <div>
                  <h2
                    className={`text-xl font-semibold ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </h2>
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
                        <Play className="w-3 h-3 mr-1" />
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
                    <Play className="w-4 h-4 mr-2" />
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
                    <Zap className="w-4 h-4 mr-2" />
                    Modo Foco
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Creada:{" "}
                      {new Date(task.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Deadline:{" "}
                        {new Date(task.dueDate).toLocaleDateString("es-ES")}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Notes Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Notas y código
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
                      <div className="space-y-3">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Escribe aquí tus notas, comandos SQL, snippets de código..."
                          className="w-full h-64 p-4 rounded-lg border border-border bg-muted/30 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={handleSaveNotes}>
                            <Save className="w-4 h-4 mr-2" />
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
                        className={`min-h-[200px] p-4 rounded-lg border border-border/50 cursor-text whitespace-pre-wrap font-mono text-sm ${notes ? "bg-muted/30" : "bg-muted/10 text-muted-foreground italic"}`}
                      >
                        {notes ||
                          "Haz click aquí para agregar notas, comandos SQL, links..."}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sidebar - Context */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Contexto
                  </h3>

                  {/* Previous task */}
                  {parentTask && (
                    <Card
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => onNavigateToTask?.(parentTask)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <ArrowLeft className="w-3 h-3" />
                          Viene de
                        </div>
                        <p className="text-sm font-medium line-clamp-2">
                          {parentTask.title}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Next task */}
                  {childTask && (
                    <Card
                      className="cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => onNavigateToTask?.(childTask)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <ArrowRight className="w-3 h-3" />
                          Continúa en
                        </div>
                        <p className="text-sm font-medium line-clamp-2">
                          {childTask.title}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {!parentTask && !childTask && (
                    <p className="text-sm text-muted-foreground italic">
                      Esta nota no tiene relaciones. Usa el pipeline para
                      establecer el orden.
                    </p>
                  )}

                  <Separator />

                  <div className="space-y-2">
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
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar nota
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
