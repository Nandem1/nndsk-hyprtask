"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
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
    { value: "low" as TaskPriority, label: "Baja" },
    { value: "medium" as TaskPriority, label: "Media" },
    { value: "high" as TaskPriority, label: "Alta" },
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Label
              htmlFor="task-title"
              className="text-xs font-medium text-muted-foreground mb-2 block"
            >
              Titulo de la tarea
            </Label>
            <Input
              id="task-title"
              type="text"
              placeholder="Que necesitas hacer?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              autoFocus
              maxLength={100}
            />
            {title.length > 0 ? (
              <div className="absolute right-2 top-[34px] text-xs text-muted-foreground">
                {title.length}/100
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Proyecto
              </Label>
              <Select
                value={projectId || "__none__"}
                onValueChange={(value) =>
                  setProjectId(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none__">Sin proyecto</SelectItem>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Categoria
              </Label>
              <Select
                value={categoryId || "__none__"}
                onValueChange={(value) =>
                  setCategoryId(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none__">Sin categoria</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Prioridad
            </Label>
            <ToggleGroup
              type="single"
              value={priority}
              onValueChange={(value) => {
                if (value) setPriority(value as TaskPriority);
              }}
              className="flex gap-2"
            >
              {priorityOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex-1",
                    option.value === "high" &&
                      "data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground data-[state=on]:border-destructive",
                  )}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {currentTask ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted">
              <Switch
                id="linkToCurrent"
                checked={linkToCurrent}
                onCheckedChange={setLinkToCurrent}
              />
              <label
                htmlFor="linkToCurrent"
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <GitBranch className="size-4 text-muted-foreground" />
                <span>Continuacion de:</span>
                <span className="font-medium truncate max-w-[200px]">
                  {currentTask.title}
                </span>
                <ArrowRight className="size-3 text-muted-foreground" />
              </label>
            </div>
          ) : null}

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
              <X data-icon="inline-start" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
