// Almacenamiento de view mode
// localStorage por ahora, preparado para migrar a Supabase

import type { TaskViewMode } from "../model/view-mode";

const STORAGE_KEY = "hyprtodo_task_view_mode";

export function getTaskViewMode(): TaskViewMode {
  if (typeof window === "undefined") {
    return "pipeline"; // Default
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return "pipeline";

  // Validar que el view mode almacenado sea válido
  const validModes: TaskViewMode[] = ["pipeline", "kanban"];

  if (stored && validModes.includes(stored as TaskViewMode)) {
    return stored as TaskViewMode;
  }

  return "pipeline";
}

export function saveTaskViewMode(mode: TaskViewMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, mode);
}
