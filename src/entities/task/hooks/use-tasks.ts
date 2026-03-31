"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveTasks,
  getCurrentTask,
  getTaskById,
  saveTask,
  toggleTask,
  deleteTask,
  setCurrentTask,
  getTaskSettings,
  saveTaskSettings,
  updateTaskNotes,
  getTaskParent,
  getTaskChild,
  setTaskParent,
  setTaskChild,
} from "../lib/storage";
import type { TaskSettings } from "../model/types";
import type { Task } from "../model/types";
import { taskKeys } from "../model/query-keys";

export { taskKeys };

// ============================================================================
// Query Hooks
// ============================================================================

// Hook para obtener tareas activas
export function useActiveTasks() {
  return useQuery({
    queryKey: taskKeys.active(),
    queryFn: getActiveTasks,
    refetchInterval: 5000,
    staleTime: 1000 * 30, // 30 segundos
  });
}

// Hook para obtener tarea actual
export function useCurrentTask() {
  return useQuery({
    queryKey: taskKeys.current(),
    queryFn: getCurrentTask,
    refetchInterval: 2000,
    staleTime: 1000 * 10, // 10 segundos
  });
}

// Hook para obtener tarea por ID (para prefetching)
export function useTaskById(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// Hook para obtener settings
export function useTaskSettings() {
  return useQuery({
    queryKey: taskKeys.settings(),
    queryFn: getTaskSettings,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

// Hook para crear tarea
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTask,
    onMutate: async (newTask: Task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? [...old, newTask] : [newTask],
      );
      return { previousTasks };
    },
    onError: (_err, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para toggle tarea (optimistic update)
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );

      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old
          ? old.map((t) =>
              t.id === id
                ? {
                    ...t,
                    isCompleted: !t.isCompleted,
                    isCurrent: t.isCurrent && t.isCompleted,
                    completedAt: !t.isCompleted
                      ? new Date().toISOString()
                      : undefined,
                  }
                : t,
            )
          : [],
      );

      // Update current task if needed
      queryClient.setQueryData<Task | null>(taskKeys.current(), (old) => {
        if (old?.id === id && !old?.isCompleted) {
          return null; // Task completed, no current task
        }
        return old;
      });

      return { previousTasks, previousCurrent };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
      }
      if (context?.previousCurrent) {
        queryClient.setQueryData(taskKeys.current(), context.previousCurrent);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para eliminar tarea (optimistic update)
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );

      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );

      // Remove from current if needed
      queryClient.setQueryData<Task | null>(taskKeys.current(), (old) => {
        if (old?.id === id) return null;
        return old;
      });

      return { previousTasks, previousCurrent };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
      }
      if (context?.previousCurrent) {
        queryClient.setQueryData(taskKeys.current(), context.previousCurrent);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para set current task
export function useSetCurrentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCurrentTask,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );
      const tasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const newCurrent = tasks?.find((t) => t.id === id) || null;

      queryClient.setQueryData<Task | null>(taskKeys.current(), newCurrent);

      // Update active tasks to reflect current status
      queryClient.setQueryData<Task[]>(
        taskKeys.active(),
        (old) =>
          old?.map((t) => ({
            ...t,
            isCurrent: t.id === id,
          })) || [],
      );

      return { previousCurrent };
    },
    onError: (_err, _id, context) => {
      if (context?.previousCurrent) {
        queryClient.setQueryData(taskKeys.current(), context.previousCurrent);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para actualizar settings
export function useUpdateTaskSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTaskSettings,
    onMutate: async (newSettings: TaskSettings) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.settings() });
      const previousSettings = queryClient.getQueryData<TaskSettings>(
        taskKeys.settings(),
      );
      queryClient.setQueryData(taskKeys.settings(), newSettings);
      return { previousSettings };
    },
    onError: (_err, _settings, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(taskKeys.settings(), context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.settings() });
    },
  });
}

// ============================================================================
// Notes Hooks
// ============================================================================

// Hook para actualizar notas de una tarea
export function useUpdateTaskNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      updateTaskNotes(id, notes),
    onMutate: async ({ id, notes }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());

      queryClient.setQueryData<Task[]>(
        taskKeys.active(),
        (old) => old?.map((t) => (t.id === id ? { ...t, notes } : t)) || [],
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// ============================================================================
// Relations Hooks
// ============================================================================

// Hook para obtener tarea padre
export function useTaskParent(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "parent"],
    queryFn: () => getTaskParent(taskId),
    enabled: !!taskId,
  });
}

// Hook para obtener tarea hija
export function useTaskChild(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "child"],
    queryFn: () => getTaskChild(taskId),
    enabled: !!taskId,
  });
}

// Hook para establecer relación padre
export function useSetTaskParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      parentTaskId,
    }: {
      taskId: string;
      parentTaskId?: string;
    }) => setTaskParent(taskId, parentTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para establecer relación hija
export function useSetTaskChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      childTaskId,
    }: {
      taskId: string;
      childTaskId?: string;
    }) => setTaskChild(taskId, childTaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// ============================================================================
// Prefetch Hooks
// ============================================================================

// Hook para prefetching de tareas
export function usePrefetchTask() {
  const queryClient = useQueryClient();

  return {
    prefetchTask: (id: string) => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => getTaskById(id),
        staleTime: 1000 * 60 * 5, // 5 minutos
      });
    },
    prefetchActiveTasks: () => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.active(),
        queryFn: getActiveTasks,
        staleTime: 1000 * 30, // 30 segundos
      });
    },
  };
}
