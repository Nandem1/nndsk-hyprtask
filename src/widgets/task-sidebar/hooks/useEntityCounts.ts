import { useMemo } from "react";
import type { Task } from "@/entities/task";

/**
 * Añade un campo `count` a cada entidad con el número de tasks asociadas.
 * Reemplaza los dos useMemo idénticos de projectCounts y categoryCounts en TaskSidebar.
 */
export function useEntityCounts<T extends { id: string }>(
  tasks: Task[],
  entities: T[],
  getEntityId: (task: Task) => string | undefined,
): (T & { count: number })[] {
  return useMemo(() => {
    const countMap = new Map<string, number>();
    for (const task of tasks) {
      const id = getEntityId(task);
      if (id) countMap.set(id, (countMap.get(id) ?? 0) + 1);
    }
    return entities.map((entity) => ({
      ...entity,
      count: countMap.get(entity.id) ?? 0,
    }));
  }, [tasks, entities, getEntityId]);
}
