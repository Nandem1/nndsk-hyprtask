import { useMemo } from "react";
import type { Task } from "@/entities/task";

/**
 * Categoriza tasks por estado en un solo pase, reemplaza los useMemo inline
 * en PipelineView y KanbanView.
 */
export function useTasksByStatus(tasks: Task[]) {
  return useMemo(() => {
    const completedTasks: Task[] = [];
    const todoTasks: Task[] = [];
    let activeTask: Task | null = null;

    for (const task of tasks) {
      if (task.isCompleted) {
        completedTasks.push(task);
      } else if (task.isCurrent) {
        activeTask = task;
      } else {
        todoTasks.push(task);
      }
    }

    // PipelineView order: completadas → activa → pendientes
    const orderedTasks = [
      ...completedTasks,
      ...(activeTask ? [activeTask] : []),
      ...todoTasks,
    ];

    return { completedTasks, activeTask, todoTasks, orderedTasks };
  }, [tasks]);
}
