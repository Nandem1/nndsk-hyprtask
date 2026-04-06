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

const STALE_NEVER = Infinity;
const STALE_30S = 1000 * 30;
const STALE_5MIN = 1000 * 60 * 5;

export function useActiveTasks() {
  return useQuery({
    queryKey: taskKeys.active(),
    queryFn: getActiveTasks,
    staleTime: STALE_NEVER,
  });
}

export function useCurrentTask() {
  return useQuery({
    queryKey: taskKeys.current(),
    queryFn: getCurrentTask,
    staleTime: STALE_NEVER,
  });
}

export function useTaskById(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTaskById(id),
    enabled: !!id,
    staleTime: STALE_NEVER,
  });
}

export function useTaskSettings() {
  return useQuery({
    queryKey: taskKeys.settings(),
    queryFn: getTaskSettings,
    staleTime: STALE_NEVER,
  });
}

export function useTaskParent(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "parent"],
    queryFn: () => getTaskParent(taskId),
    enabled: !!taskId,
    staleTime: STALE_30S,
  });
}

export function useTaskChild(taskId: string) {
  return useQuery({
    queryKey: [...taskKeys.detail(taskId), "child"],
    queryFn: () => getTaskChild(taskId),
    enabled: !!taskId,
    staleTime: STALE_30S,
  });
}

export function usePrefetchTask() {
  const queryClient = useQueryClient();

  return {
    prefetchTask: (id: string) => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.detail(id),
        queryFn: () => getTaskById(id),
        staleTime: STALE_5MIN,
      });
    },
    prefetchActiveTasks: () => {
      return queryClient.prefetchQuery({
        queryKey: taskKeys.active(),
        queryFn: getActiveTasks,
        staleTime: STALE_30S,
      });
    },
  };
}
