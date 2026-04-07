"use client";

import { useCallback, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask, useSetTaskChild, useDeleteTask } from "@/entities/task";
import { toast } from "sonner";
import type { TaskPriority } from "@/entities/task";
import {
  createTaskSchema,
  defaultValues,
  type CreateTaskFormData,
  type UseTaskCreateOptions,
  type UseTaskCreateReturn,
} from "../model";

/**
 * Hook para manejar la lógica de creación de tareas
 * Separa la lógica de negocio de la UI
 * 
 * @param options - Opciones de configuración
 * @returns Controladores y estado del formulario
 */
export function useTaskCreate(options: UseTaskCreateOptions): UseTaskCreateReturn {
  const {
    maxTasks,
    currentTasks,
    onSuccess,
    defaultProjectId,
    defaultCategoryId,
  } = options;

  const createTaskMutation = useCreateTask();
  const setTaskChildMutation = useSetTaskChild();
  const deleteTaskMutation = useDeleteTask();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      ...defaultValues,
      projectId: defaultProjectId,
      categoryId: defaultCategoryId,
    },
    mode: "onChange",
  });

  const titleValue = useWatch({ control, name: "title", defaultValue: "" });

  const canCreate = useMemo(() => {
    return (
      isValid &&
      !isSubmitting &&
      currentTasks < maxTasks &&
      titleValue.trim().length > 0
    );
  }, [isValid, isSubmitting, currentTasks, maxTasks, titleValue]);

  const onSubmit = useCallback(
    async (data: CreateTaskFormData) => {
      if (!canCreate) return;

      const newTask = {
        id: crypto.randomUUID(),
        title: data.title.trim(),
        isCompleted: false,
        isCurrent: false,
        priority: data.priority as TaskPriority,
        createdAt: new Date().toISOString(),
        projectId: data.projectId,
        categoryId: data.categoryId,
        notes: "",
        parentTaskId: data.parentTaskId,
      };

      try {
        await createTaskMutation.mutateAsync(newTask);

        if (data.parentTaskId) {
          try {
            await setTaskChildMutation.mutateAsync({
              taskId: data.parentTaskId,
              childTaskId: newTask.id,
            });
          } catch {
            await deleteTaskMutation.mutateAsync(newTask.id);
            return;
          }
        }

        reset(defaultValues);
        onSuccess();
      } catch {
        toast.error("Error al crear la tarea. Inténtalo de nuevo.");
      }
    },
    [canCreate, createTaskMutation, setTaskChildMutation, deleteTaskMutation, reset, onSuccess]
  );

  return {
    control,
    isSubmitting: isSubmitting || createTaskMutation.isPending,
    isValid,
    errors,
    onSubmit: handleSubmit(onSubmit),
    titleValue,
    canCreate,
  };
}
