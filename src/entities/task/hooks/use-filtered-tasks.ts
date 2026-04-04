"use client";

import { useMemo } from "react";
import type { Task } from "../model/types";

/**
 * Filtra tareas por proyecto y/o categoría.
 * Acepta "all" como valor para indicar sin filtro.
 */
export function useFilteredTasks(
  tasks: Task[],
  projectId: string,
  categoryId: string,
): Task[] {
  return useMemo(() => {
    return tasks.filter((task) => {
      if (projectId !== "all" && task.projectId !== projectId) return false;
      if (categoryId !== "all" && task.categoryId !== categoryId) return false;
      return true;
    });
  }, [tasks, projectId, categoryId]);
}
