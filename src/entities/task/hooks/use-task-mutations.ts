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
import { asyncWrap } from "@shared/lib/utils";
import type { TaskSettings } from "../model/types";
import type { Task } from "../model/types";
import { taskKeys } from "../model/query-keys";
import {
  snapshotTaskList,
  rollbackTaskList,
  invalidateAllTasks,
  invalidateTaskRelation,
} from "../lib/optimistic-helpers";

export function useCreateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(saveTask),
    onMutate: async (newTask: Task) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);
      qc.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? [...old, newTask] : [newTask],
      );
      if (newTask.isCurrent) {
        qc.setQueryData(taskKeys.current(), newTask);
      }
      return ctx;
    },
    onError: (_err, _task, ctx) => rollbackTaskList(qc, ctx),
    onSuccess: (_data, variables) => {
      invalidateTaskRelation(qc, variables.id, variables.parentTaskId);
    },
    onSettled: () => invalidateAllTasks(qc),
  });
}

export function useToggleTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(toggleTask),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);

      qc.setQueryData<Task[]>(taskKeys.active(), (old) =>
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

      qc.setQueryData<Task | null>(taskKeys.current(), (old) => {
        if (old?.id === id && !old?.isCompleted) return null;
        return old;
      });

      return ctx;
    },
    onError: (_err, _id, ctx) => rollbackTaskList(qc, ctx),
    onSettled: () => invalidateAllTasks(qc),
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(deleteTask),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);

      qc.setQueryData<Task[]>(taskKeys.active(), (old) =>
        old ? old.filter((t) => t.id !== id) : [],
      );

      qc.setQueryData<Task | null>(taskKeys.current(), (old) => {
        if (old?.id === id) return null;
        return old;
      });

      return ctx;
    },
    onError: (_err, _id, ctx) => rollbackTaskList(qc, ctx),
    onSettled: () => invalidateAllTasks(qc),
  });
}

export function useSetCurrentTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(setCurrentTask),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);
      const newCurrent = ctx.previousTasks?.find((t) => t.id === id) || null;

      qc.setQueryData<Task | null>(taskKeys.current(), newCurrent);
      qc.setQueryData<Task[]>(
        taskKeys.active(),
        (old) =>
          old?.map((t) => ({
            ...t,
            isCurrent: t.id === id,
          })) || [],
      );

      return ctx;
    },
    onError: (_err, _id, ctx) => rollbackTaskList(qc, ctx),
    onSettled: () => invalidateAllTasks(qc),
  });
}

export function useUpdateTaskSettings() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: asyncWrap(saveTaskSettings),
    onMutate: async (newSettings: TaskSettings) => {
      await qc.cancelQueries({ queryKey: taskKeys.settings() });
      const previousSettings = qc.getQueryData<TaskSettings>(taskKeys.settings());
      qc.setQueryData(taskKeys.settings(), newSettings);
      return { previousSettings };
    },
    onError: (_err, _settings, context) => {
      if (context?.previousSettings) {
        qc.setQueryData(taskKeys.settings(), context.previousSettings);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: taskKeys.settings() });
    },
  });
}

export function useUpdateTaskNotes() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      updateTaskNotes(id, notes);
    },
    onMutate: async ({ id, notes }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);

      qc.setQueryData<Task[]>(
        taskKeys.active(),
        (old) => old?.map((t) => (t.id === id ? { ...t, notes } : t)) || [],
      );

      return ctx;
    },
    onError: (_err, _vars, ctx) => rollbackTaskList(qc, ctx),
    onSettled: (_data, _error, vars) => {
      qc.invalidateQueries({ queryKey: taskKeys.detail(vars.id) });
      invalidateAllTasks(qc);
    },
  });
}

export function useUpdateTaskPriority() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, priority }: { id: string; priority: Task["priority"] }) => {
      const tasks = qc.getQueryData<Task[]>(taskKeys.active()) ?? [];
      const task = tasks.find((t) => t.id === id);
      if (task) saveTask({ ...task, priority });
    },
    onMutate: async ({ id, priority }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all });
      const ctx = snapshotTaskList(qc);
      qc.setQueryData<Task[]>(
        taskKeys.active(),
        (old) => old?.map((t) => (t.id === id ? { ...t, priority } : t)) ?? [],
      );
      return ctx;
    },
    onError: (_err, _vars, ctx) => rollbackTaskList(qc, ctx),
    onSettled: () => invalidateAllTasks(qc),
  });
}

export function useSetTaskParent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      parentTaskId,
    }: {
      taskId: string;
      parentTaskId?: string;
    }) => {
      setTaskParent(taskId, parentTaskId);
    },
    onSuccess: (_data, variables) => {
      invalidateAllTasks(qc);
      invalidateTaskRelation(qc, variables.taskId, variables.parentTaskId);
    },
  });
}

export function useSetTaskChild() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      childTaskId,
    }: {
      taskId: string;
      childTaskId?: string;
    }) => {
      setTaskChild(taskId, childTaskId);
    },
    onSuccess: (_data, variables) => {
      invalidateAllTasks(qc);
      invalidateTaskRelation(qc, variables.taskId, variables.childTaskId);
    },
  });
}
