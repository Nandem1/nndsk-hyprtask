"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateTask, useSetTaskChild } from "@/entities/task";
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

  const {
    control,
    handleSubmit,
    watch,
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

  const titleValue = watch("title");

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
          await setTaskChildMutation.mutateAsync({
            taskId: data.parentTaskId,
            childTaskId: newTask.id,
          });
        }

        reset(defaultValues);
        onSuccess();
      } catch (error) {
        console.error("Error al crear la tarea:", error);
      }
    },
    [canCreate, createTaskMutation, setTaskChildMutation, reset, onSuccess]
  );

  return {
    control,
    watch,
    isSubmitting: isSubmitting || createTaskMutation.isPending,
    isValid,
    errors,
    onSubmit: handleSubmit(onSubmit),
    titleValue,
    canCreate,
  };
}
