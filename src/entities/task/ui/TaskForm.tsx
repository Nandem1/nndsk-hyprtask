"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { X, ArrowRight, GitBranch } from "lucide-react";
import {
  useCreateTask,
  useSetTaskChild,
  useCurrentTask,
} from "../hooks/use-tasks";
import { useActiveProjects } from "../hooks/use-projects";
import { useActiveCategories } from "../hooks/use-categories";
import type { TaskPriority } from "../model/types";

interface TaskFormProps {
  onTaskAdded: () => void;
  onCancel: () => void;
  maxTasks: number;
  currentTasks: number;
  defaultProjectId?: string;
  defaultCategoryId?: string;
}

export function TaskForm({
  onTaskAdded,
  onCancel,
  maxTasks,
  currentTasks,
  defaultProjectId,
  defaultCategoryId,
}: TaskFormProps) {
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<TaskPriority>("low");
  const [projectId, setProjectId] = useState<string | undefined>(
    defaultProjectId,
  );
  const [categoryId, setCategoryId] = useState<string | undefined>(
    defaultCategoryId,
  );
  const [linkToCurrent, setLinkToCurrent] = useState(true);

  const createTaskMutation = useCreateTask();
  const setTaskChildMutation = useSetTaskChild();
  const { data: currentTask } = useCurrentTask();
  const { data: projects = [] } = useActiveProjects();
  const { data: categories = [] } = useActiveCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;
    if (currentTasks >= maxTasks) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      isCompleted: false,
      isCurrent: false,
      priority,
      createdAt: new Date().toISOString(),
      projectId,
      categoryId,
      notes: "",
      parentTaskId: linkToCurrent && currentTask ? currentTask.id : undefined,
    };

    createTaskMutation.mutate(newTask, {
      onSuccess: () => {
        if (linkToCurrent && currentTask) {
          setTaskChildMutation.mutate({
            taskId: currentTask.id,
            childTaskId: newTask.id,
          });
        }
        setTitle("");
        onTaskAdded();
      },
    });
  };

  const priorityOptions = [
    {
      value: "low" as TaskPriority,
      label: "Baja",
      color:
        "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
    },
    {
      value: "medium" as TaskPriority,
      label: "Media",
      color:
        "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
    },
    {
      value: "high" as TaskPriority,
      label: "Alta",
      color: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
    },
  ];

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Nueva Tarea
          </h3>
          <p className="text-xs text-muted-foreground">
            Agrega una nueva tarea a tu lista
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Titulo de la tarea
            </label>
            <Input
              type="text"
              placeholder="Que necesitas hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              autoFocus
              maxLength={100}
            />
            {title.length > 0 && (
              <div className="absolute right-2 top-[34px] text-xs text-muted-foreground">
                {title.length}/100
              </div>
            )}
          </div>

          {/* Proyecto y Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Proyecto
              </label>
              <select
                value={projectId || ""}
                onChange={(e) => setProjectId(e.target.value || undefined)}
                className="w-full px-3 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin proyecto</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Categoria
              </label>
              <select
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value || undefined)}
                className="w-full px-3 py-2.5 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Prioridad */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Prioridad
            </label>
            <div className="flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPriority(option.value)}
                  className={`flex-1 px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    priority === option.value
                      ? option.color
                      : "border-border hover:border-border/80 bg-muted/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vincular a tarea actual */}
          {currentTask && (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted">
              <input
                type="checkbox"
                id="linkToCurrent"
                checked={linkToCurrent}
                onChange={(e) => setLinkToCurrent(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <label
                htmlFor="linkToCurrent"
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <GitBranch className="w-4 h-4 text-muted-foreground" />
                <span>Continuación de:</span>
                <span className="font-medium truncate max-w-[200px]">
                  {currentTask.title}
                </span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </label>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={
                !title.trim() ||
                createTaskMutation.isPending ||
                currentTasks >= maxTasks
              }
              className="flex-1"
            >
              {createTaskMutation.isPending ? "Guardando..." : "Crear Tarea"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
