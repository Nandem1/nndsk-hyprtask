"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveTask,
  toggleTask,
  deleteTask,
  setCurrentTask,
  saveTaskSettings,
  updateTaskNotes,
  setTaskParent,
  setTaskChild,
} from "../lib/storage";
import { asyncWrap } from "@shared/lib/storage";
import type { TaskSettings } from "../model/types";
import type { Task } from "../model/types";
import { taskKeys } from "../model/query-keys";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(saveTask),
    onMutate: async (newTask: Task) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );
      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? [...old, newTask] : [newTask],
      );
      if (newTask.isCurrent) {
        queryClient.setQueryData(taskKeys.current(), newTask);
      }
      return { previousTasks, previousCurrent };
    },
    onError: (_err, _task, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.active(), context.previousTasks);
      }
      if (context?.previousCurrent) {
        queryClient.setQueryData(taskKeys.current(), context.previousCurrent);
      }
    },
    onSuccess: (_data, variables) => {
      if (variables.parentTaskId) {
        queryClient.invalidateQueries({
          queryKey: [...taskKeys.detail(variables.parentTaskId), "child"],
        });
      }
      if (variables.childTaskId) {
        queryClient.invalidateQueries({
          queryKey: [...taskKeys.detail(variables.childTaskId), "parent"],
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(toggleTask),
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

      queryClient.setQueryData<Task | null>(taskKeys.current(), (old) => {
        if (old?.id === id && !old?.isCompleted) {
          return null;
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

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(deleteTask),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );

      queryClient.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );

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

export function useSetCurrentTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(setCurrentTask),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.all });
      const previousCurrent = queryClient.getQueryData<Task | null>(
        taskKeys.current(),
      );
      const tasks = queryClient.getQueryData<Task[]>(taskKeys.active());
      const newCurrent = tasks?.find((t) => t.id === id) || null;

      queryClient.setQueryData<Task | null>(taskKeys.current(), newCurrent);

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

export function useUpdateTaskSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(saveTaskSettings),
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

export function useUpdateTaskNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      updateTaskNotes(id, notes);
    },
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

export function useSetTaskParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      parentTaskId,
    }: {
      taskId: string;
      parentTaskId?: string;
    }) => { setTaskParent(taskId, parentTaskId); },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...taskKeys.detail(variables.taskId), "parent"],
      });
      if (variables.parentTaskId) {
        queryClient.invalidateQueries({
          queryKey: [...taskKeys.detail(variables.parentTaskId), "child"],
        });
      }
    },
  });
}

export function useSetTaskChild() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      childTaskId,
    }: {
      taskId: string;
      childTaskId?: string;
    }) => { setTaskChild(taskId, childTaskId); },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      queryClient.invalidateQueries({
        queryKey: [...taskKeys.detail(variables.taskId), "child"],
      });
      if (variables.childTaskId) {
        queryClient.invalidateQueries({
          queryKey: [...taskKeys.detail(variables.childTaskId), "parent"],
        });
      }
    },
  });
}
