"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { TaskForm } from "@/entities/task";
import { Plus } from "lucide-react";

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
  const formProps = {
    onTaskAdded: () => {
      onTaskCreated();
      onClose();
    },
    onCancel: onClose,
    maxTasks,
    currentTasks,
    defaultProjectId,
    defaultCategoryId,
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="lg" className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus data-icon="inline-start" className="size-5" />
            Crear nueva nota
          </DialogTitle>
          <DialogDescription>
            Agrega una nueva nota a tu lista de tareas
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <TaskForm {...formProps} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
