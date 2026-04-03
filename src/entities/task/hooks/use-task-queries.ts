"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getActiveTasks,
  getCurrentTask,
  getTaskById,
  getTaskSettings,
  getTaskParent,
  getTaskChild,
} from "../lib/storage";
import { taskKeys } from "../model/query-keys";

export { taskKeys };

export function useActiveTasks() {
  return useQuery({
    queryKey: taskKeys.active(),
    queryFn: getActiveTasks,
    staleTime: Infinity,
  });
}

export function useCurrentTask() {
  return useQuery({
    queryKey: taskKeys.current(),
    queryFn: getCurrentTask,
    staleTime: Infinity,
  });
}

export function useTaskById(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useTaskSettings() {
  return useQuery({
    queryKey: taskKeys.settings(),
    queryFn: getTaskSettings,
    staleTime: Infinity,
  });
}

export function useTaskParent(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "parent"],
    queryFn: () => getTaskParent(taskId),
    enabled: !!taskId,
    staleTime: 1000 * 30,
  });
}

export function useTaskChild(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "child"],
    queryFn: () => getTaskChild(taskId),
    enabled: !!taskId,
    staleTime: 1000 * 30,
  });
}

export function usePrefetchTask() {
  const queryClient = useQueryClient();

  return {
    prefetchTask: (id: string) => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => getTaskById(id),
        staleTime: 1000 * 60 * 5,
      });
    },
    prefetchActiveTasks: () => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.active(),
        queryFn: getActiveTasks,
        staleTime: 1000 * 30,
      });
    },
  };
}
