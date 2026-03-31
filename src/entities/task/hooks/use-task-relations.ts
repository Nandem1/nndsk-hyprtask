"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTaskChild, reorderTasks } from "../lib/storage";
import { taskKeys } from "../model/query-keys";
import type { Task } from "../model/types";

// Hook para conectar dos tareas en el pipeline
export function useConnectTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fromTaskId,
      toTaskId,
    }: {
      fromTaskId: string;
      toTaskId: string;
    }) => {
      // Establecer fromTask como padre de toTask
      await setTaskChild(fromTaskId, toTaskId);
      return { fromTaskId, toTaskId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para desconectar dos tareas
export function useDisconnectTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      parentTaskId,
      childTaskId,
    }: {
      parentTaskId: string;
      childTaskId: string;
    }) => {
      await setTaskChild(parentTaskId, undefined);
      return { parentTaskId, childTaskId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para auto-conectar tareas en orden
export function useAutoConnectPipeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: Task[]) => {
      // Ordenar tareas: primero completadas, luego por orden, luego por fecha
      const sortedTasks = [...tasks].sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? -1 : 1;
        }
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });

      // Establecer relaciones en cadena
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const current = sortedTasks[i];
        const next = sortedTasks[i + 1];

        if (!current.isCompleted && !next.isCompleted) {
          await setTaskChild(current.id, next.id);
        }
      }

      return sortedTasks;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

// Hook para reordenar tareas
export function useReorderTasks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await reorderTasks(orderedIds);
      return orderedIds;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
