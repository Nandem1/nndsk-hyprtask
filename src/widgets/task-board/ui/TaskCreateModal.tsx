"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import {
  useTaskCreate,
  TaskCreateFields,
  TaskCreateFooter,
} from "@/features/task-create";
import { useActiveTasks } from "@/entities/task";
import { useActiveProjects, useActiveCategories } from "@/entities/project";
import { stopSpacePropagation } from "@/shared/lib/keyboard-shortcuts";

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  maxTasks: number;
  currentTasks: number;
  defaultProjectId?: string;
  defaultCategoryId?: string;
}

export function TaskCreateModal({
  isOpen,
  onClose,
  onTaskCreated,
  maxTasks,
  currentTasks,
  defaultProjectId,
  defaultCategoryId,
}: TaskCreateModalProps) {
  const { control, watch, isSubmitting, errors, onSubmit, titleValue, canCreate } =
    useTaskCreate({
      maxTasks,
      currentTasks,
      onSuccess: () => {
        onTaskCreated();
        onClose();
      },
      defaultProjectId,
      defaultCategoryId,
    });

  const { data: projects = [] } = useActiveProjects();
  const { data: categories = [] } = useActiveCategories();
  const { data: activeTasks = [] } = useActiveTasks();

  const incompleteTasks = activeTasks.filter((t) => !t.isCompleted);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        size="lg"
        className="sm:max-w-[500px]"
        onKeyDown={stopSpacePropagation}
      >
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5" />
              Crear nueva nota
            </DialogTitle>
            <DialogDescription>
              Agrega una nueva nota a tu lista de tareas
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <TaskCreateFields
              control={control}
              watch={watch}
              errors={errors}
              projects={projects}
              categories={categories}
              incompleteTasks={incompleteTasks}
              titleValue={titleValue}
            />
          </div>

          <DialogFooter>
            <TaskCreateFooter
              isSubmitting={isSubmitting}
              canCreate={canCreate}
              onCancel={onClose}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
