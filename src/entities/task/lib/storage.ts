// ABSTRACCIÓN DE ALMACENAMIENTO PARA TAREAS
// localStorage por ahora, preparado para migrar a Supabase

import type { Task, TaskSettings } from "../model/types";
import { storageGetList, storageGet, storageSet } from "@shared/lib/storage";
import { upsertItem, reorderById } from "@shared/lib/array";

const STORAGE_KEYS = {
  TASKS: "hyprtodo_tasks",
  SETTINGS: "hyprtodo_task_settings",
} as const;

// ============================================
// TASKS
// ============================================

export function getTasks(): Task[] {
  return storageGetList<Task>(STORAGE_KEYS.TASKS);
}

export function getActiveTasks(): Task[] {
  return getTasks().filter((task) => !task.isCompleted);
}

export function saveTask(task: Task): void {
  storageSet(STORAGE_KEYS.TASKS, upsertItem(getTasks(), task));
}

export function deleteTask(id: string): void {
  storageSet(STORAGE_KEYS.TASKS, getTasks().filter((task) => task.id !== id));
}

export function toggleTask(id: string): void {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.isCompleted = !task.isCompleted;
  task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
  if (task.isCompleted) task.isCurrent = false;

  saveTask(task);
}

export function setCurrentTask(id: string): void {
  const tasks = getTasks();
  tasks.forEach((task) => { task.isCurrent = task.id === id; });
  storageSet(STORAGE_KEYS.TASKS, tasks);
}

export function getCurrentTask(): Task | null {
  return getTasks().find((t) => t.isCurrent && !t.isCompleted) ?? null;
}

export function getTaskById(id: string): Task | null {
  return getTasks().find((t) => t.id === id) ?? null;
}

// ============================================
// SETTINGS
// ============================================

export function getTaskSettings(): TaskSettings {
  const stored = storageGet<TaskSettings>(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    const defaultSettings: TaskSettings = { maxActiveTasks: 5, autoArchiveDays: 7 };
    saveTaskSettings(defaultSettings);
    return defaultSettings;
  }
  return stored;
}

export function saveTaskSettings(settings: TaskSettings): void {
  storageSet(STORAGE_KEYS.SETTINGS, settings);
}

// ============================================
// AUTO-ARCHIVE
// ============================================

export function autoArchiveCompletedTasks(): number {
  const tasks = getTasks();
  const settings = getTaskSettings();
  const now = new Date();
  let archived = 0;

  const filtered = tasks.filter((task) => {
    if (!task.isCompleted || !task.completedAt) return true;
    const daysSince =
      (now.getTime() - new Date(task.completedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince >= settings.autoArchiveDays) {
      archived++;
      return false;
    }
    return true;
  });

  storageSet(STORAGE_KEYS.TASKS, filtered);
  return archived;
}

// ============================================
// TASK NOTES
// ============================================

export function updateTaskNotes(id: string, notes: string): void {
  const tasks = getTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.notes = notes;
  storageSet(STORAGE_KEYS.TASKS, tasks);
}

// ============================================
// TASK RELATIONS
// ============================================

/**
 * Aplica una relación bidireccional entre tareas.
 * Limpia la relación anterior y establece la nueva.
 * Muta el array en lugar (el caller lo guarda en localStorage).
 */
function applyTaskRelation(
  tasks: Task[],
  taskId: string,
  relatedId: string | undefined,
  ownField: "parentTaskId" | "childTaskId",
  otherField: "childTaskId" | "parentTaskId",
): void {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Remover puntero del task relacionado anterior
  const oldRelatedId = task[ownField];
  if (oldRelatedId) {
    const oldRelated = tasks.find((t) => t.id === oldRelatedId);
    if (oldRelated) oldRelated[otherField] = undefined;
  }

  // Actualizar el task principal
  task[ownField] = relatedId;

  // Actualizar el nuevo task relacionado
  if (relatedId) {
    const newRelated = tasks.find((t) => t.id === relatedId);
    if (newRelated) newRelated[otherField] = taskId;
  }
}

export function setTaskParent(taskId: string, parentTaskId: string | undefined): void {
  const tasks = getTasks();
  applyTaskRelation(tasks, taskId, parentTaskId, "parentTaskId", "childTaskId");
  storageSet(STORAGE_KEYS.TASKS, tasks);
}

export function setTaskChild(taskId: string, childTaskId: string | undefined): void {
  const tasks = getTasks();
  applyTaskRelation(tasks, taskId, childTaskId, "childTaskId", "parentTaskId");
  storageSet(STORAGE_KEYS.TASKS, tasks);
}

export function getTaskParent(taskId: string): Task | null {
  const task = getTaskById(taskId);
  if (!task?.parentTaskId) return null;
  return getTaskById(task.parentTaskId);
}

export function getTaskChild(taskId: string): Task | null {
  const task = getTaskById(taskId);
  if (!task?.childTaskId) return null;
  return getTaskById(task.childTaskId);
}

// ============================================
// TASK ORDERING
// ============================================

export function reorderTasks(orderedIds: string[]): void {
  storageSet(STORAGE_KEYS.TASKS, reorderById(getTasks(), orderedIds));
}
