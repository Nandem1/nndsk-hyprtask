// ABSTRACCIÓN DE ALMACENAMIENTO PARA TAREAS
// localStorage por ahora, preparado para migrar a Supabase

import type { Task, TaskSettings } from "../model/types";

const STORAGE_KEYS = {
  TASKS: "hyprtodo_tasks",
  SETTINGS: "hyprtodo_task_settings",
} as const;

// ============================================
// TASKS
// ============================================

export async function getTasks(): Promise<Task[]> {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!stored) return [];

  return JSON.parse(stored) as Task[];
}

export async function getActiveTasks(): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter((task) => !task.isCompleted);
}

export async function saveTask(task: Task): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const existingIndex = tasks.findIndex((t) => t.id === task.id);

  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function deleteTask(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const filtered = tasks.filter((task) => task.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
}

export async function toggleTask(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) return;

  task.isCompleted = !task.isCompleted;
  task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
  // Si se completa, quitar de current
  if (task.isCompleted) {
    task.isCurrent = false;
  }

  await saveTask(task);
}

export async function setCurrentTask(id: string): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();

  // Quitar current de todas las tareas
  tasks.forEach((task) => {
    if (task.id === id) {
      task.isCurrent = true;
    } else {
      task.isCurrent = false;
    }
  });

  // Guardar todas las tareas
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function getCurrentTask(): Promise<Task | null> {
  const tasks = await getTasks();
  const current = tasks.find((t) => t.isCurrent && !t.isCompleted);
  return current || null;
}

export async function getTaskById(id: string): Promise<Task | null> {
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id === id);
  return task || null;
}

// ============================================
// SETTINGS
// ============================================

export async function getTaskSettings(): Promise<TaskSettings> {
  if (typeof window === "undefined") {
    return { maxActiveTasks: 5, autoArchiveDays: 7 };
  }

  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    const defaultSettings: TaskSettings = {
      maxActiveTasks: 5,
      autoArchiveDays: 7,
    };
    await saveTaskSettings(defaultSettings);
    return defaultSettings;
  }

  return JSON.parse(stored) as TaskSettings;
}

export async function saveTaskSettings(settings: TaskSettings): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ============================================
// AUTO-ARCHIVE
// ============================================

export async function autoArchiveCompletedTasks(): Promise<number> {
  if (typeof window === "undefined") return 0;
  const tasks = await getTasks();
  const settings = await getTaskSettings();
  const now = new Date();
  let archived = 0;

  const filtered = tasks.filter((task) => {
    if (!task.isCompleted || !task.completedAt) return true;

    const completedDate = new Date(task.completedAt);
    const daysSinceCompleted =
      (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCompleted >= settings.autoArchiveDays) {
      archived++;
      return false; // Eliminar tarea
    }

    return true;
  });

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  return archived;
}

// ============================================
// TASK NOTES
// ============================================

export async function updateTaskNotes(
  id: string,
  notes: string,
): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id === id);

  if (!task) return;

  task.notes = notes;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

// ============================================
// TASK RELATIONS
// ============================================

export async function setTaskParent(
  taskId: string,
  parentTaskId: string | undefined,
): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  // Remover relación anterior si existe
  if (task.parentTaskId) {
    const oldParent = tasks.find((t) => t.id === task.parentTaskId);
    if (oldParent) {
      oldParent.childTaskId = undefined;
    }
  }

  // Establecer nueva relación
  task.parentTaskId = parentTaskId;

  if (parentTaskId) {
    const parent = tasks.find((t) => t.id === parentTaskId);
    if (parent) {
      parent.childTaskId = taskId;
    }
  }

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function setTaskChild(
  taskId: string,
  childTaskId: string | undefined,
): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  // Remover relación anterior si existe
  if (task.childTaskId) {
    const oldChild = tasks.find((t) => t.id === task.childTaskId);
    if (oldChild) {
      oldChild.parentTaskId = undefined;
    }
  }

  // Establecer nueva relación
  task.childTaskId = childTaskId;

  if (childTaskId) {
    const child = tasks.find((t) => t.id === childTaskId);
    if (child) {
      child.parentTaskId = taskId;
    }
  }

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function getTaskParent(taskId: string): Promise<Task | null> {
  const task = await getTaskById(taskId);
  if (!task?.parentTaskId) return null;
  return getTaskById(task.parentTaskId);
}

export async function getTaskChild(taskId: string): Promise<Task | null> {
  const task = await getTaskById(taskId);
  if (!task?.childTaskId) return null;
  return getTaskById(task.childTaskId);
}

// ============================================
// TASK ORDERING
// ============================================

export async function reorderTasks(orderedIds: string[]): Promise<void> {
  if (typeof window === "undefined") return;
  const tasks = await getTasks();

  orderedIds.forEach((id, index) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.order = index;
    }
  });

  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}
