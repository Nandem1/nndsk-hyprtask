'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getActiveTasks,
  getCurrentTask,
  saveTask,
  toggleTask,
  deleteTask,
  setCurrentTask,
} from '../lib/storage';
import type { Task } from '../model/types';
import { taskKeys } from '../model/query-keys';

export { taskKeys };

// Hook para obtener tareas activas
export function useActiveTasks() {
  return useQuery({
    queryKey: taskKeys.active(),
    queryFn: getActiveTasks,
    refetchInterval: 5000, // Refetch cada 5 segundos
  });
}

// Hook para obtener tarea actual
export function useCurrentTask() {
  return useQuery({
    queryKey: taskKeys.current(),
    queryFn: getCurrentTask,
    refetchInterval: 2000, // Refetch cada 2 segundos (más frecuente)
  });
}

// Hook para crear tarea
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTask,
    onMutate: async (newTask: Task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? [...old, newTask] : [newTask]
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
      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old
          ? old.map((t) =>
              t.id === id
                ? { ...t, isCompleted: !t.isCompleted, isCurrent: t.isCurrent && t.isCompleted }
                : t
            )
          : []
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
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
      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? old.filter((t) => t.id !== id) : []
      );
      return { previousTasks };
    },
    onError: (_err, _id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
