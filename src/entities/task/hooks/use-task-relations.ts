"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setTaskChild, reorderTasks } from "../lib/storage";
import type { Task } from "../model/types";
import {
  invalidateAllTasks,
  invalidateTaskRelation,
} from "../lib/optimistic-helpers";

export function useConnectTasks() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fromTaskId,
      toTaskId,
    }: {
      fromTaskId: string;
      toTaskId: string;
    }) => {
      await setTaskChild(fromTaskId, toTaskId);
      return { fromTaskId, toTaskId };
    },
    onSuccess: (_data, variables) => {
      invalidateAllTasks(qc);
      invalidateTaskRelation(qc, variables.fromTaskId, variables.toTaskId);
    },
  });
}

export function useDisconnectTasks() {
  const qc = useQueryClient();

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
    onSuccess: (_data, variables) => {
      invalidateAllTasks(qc);
      invalidateTaskRelation(qc, variables.parentTaskId, variables.childTaskId);
    },
  });
}

export function useAutoConnectPipeline() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (tasks: Task[]) => {
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

      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const current = sortedTasks[i];
        const next = sortedTasks[i + 1];

        if (!current.isCompleted && !next.isCompleted) {
          await setTaskChild(current.id, next.id);
        }
      }

      return sortedTasks;
    },
    onSuccess: (_data, variables) => {
      invalidateAllTasks(qc);
      variables.forEach((task) => {
        invalidateTaskRelation(qc, task.id);
      });
    },
  });
}

export function useReorderTasks() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      await reorderTasks(orderedIds);
      return orderedIds;
    },
    onSuccess: () => invalidateAllTasks(qc),
  });
}
