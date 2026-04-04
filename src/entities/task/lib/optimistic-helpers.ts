import type { QueryClient } from "@tanstack/react-query";
import type { Task } from "../model/types";
import { taskKeys } from "../model/query-keys";

export interface TaskListContext {
  previousTasks?: Task[];
  previousCurrent?: Task | null;
}

export function snapshotTaskList(qc: QueryClient): TaskListContext {
  return {
    previousTasks: qc.getQueryData<Task[]>(taskKeys.active()),
    previousCurrent: qc.getQueryData<Task | null>(taskKeys.current()),
  };
}

export function rollbackTaskList(
  qc: QueryClient,
  context: TaskListContext | undefined,
): void {
  if (!context) return;
  if (context.previousTasks) {
    qc.setQueryData(taskKeys.active(), context.previousTasks);
  }
  if (context.previousCurrent) {
    qc.setQueryData(taskKeys.current(), context.previousCurrent);
  }
}

export function invalidateAllTasks(qc: QueryClient): void {
  qc.invalidateQueries({ queryKey: taskKeys.all });
}

export function invalidateTaskRelation(
  qc: QueryClient,
  taskId: string,
  relatedId?: string,
): void {
  qc.invalidateQueries({
    queryKey: [...taskKeys.detail(taskId), "parent"],
  });
  qc.invalidateQueries({
    queryKey: [...taskKeys.detail(taskId), "child"],
  });
  if (relatedId) {
    qc.invalidateQueries({
      queryKey: [...taskKeys.detail(relatedId), "parent"],
    });
    qc.invalidateQueries({
      queryKey: [...taskKeys.detail(relatedId), "child"],
    });
  }
}
