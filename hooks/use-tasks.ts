'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTasks,
  getActiveTasks,
  getCurrentTask,
  saveTask,
  toggleTask,
  deleteTask,
  setCurrentTask,
} from '@/lib/tasks/storage';
import type { Task } from '@/types/task';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  active: () => [...taskKeys.all, 'active'] as const,
  current: () => [...taskKeys.all, 'current'] as const,
  detail: (id: string) => [...taskKeys.all, id] as const,
};

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para toggle tarea
export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para eliminar tarea
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
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

