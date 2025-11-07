// ABSTRACCIÓN DE ALMACENAMIENTO PARA TAREAS
// localStorage por ahora, preparado para migrar a Supabase

import type { Task, TaskSettings } from '@/types/task';

const STORAGE_KEYS = {
  TASKS: 'hyprtodo_tasks',
  SETTINGS: 'hyprtodo_task_settings',
} as const;

// ============================================
// TASKS
// ============================================

export async function getTasks(): Promise<Task[]> {
  // TODO: Migrar a Supabase cuando esté listo
  // return await supabase.from('tasks').select('*').order('createdAt', { ascending: false });
  
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!stored) return [];
  
  return JSON.parse(stored) as Task[];
}

export async function getActiveTasks(): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(task => !task.isCompleted);
}

export async function getCompletedTasks(): Promise<Task[]> {
  const tasks = await getTasks();
  return tasks.filter(task => task.isCompleted);
}

export async function saveTask(task: Task): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('tasks').upsert(task);
  
  const tasks = await getTasks();
  const existingIndex = tasks.findIndex(t => t.id === task.id);
  
  if (existingIndex >= 0) {
    tasks[existingIndex] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export async function deleteTask(id: string): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  // await supabase.from('tasks').delete().eq('id', id);
  
  const tasks = await getTasks();
  const filtered = tasks.filter(task => task.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
}

export async function toggleTask(id: string): Promise<void> {
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === id);
  
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
  const tasks = await getTasks();
  
  // Quitar current de todas las tareas
  tasks.forEach(task => {
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
  const current = tasks.find(t => t.isCurrent && !t.isCompleted);
  return current || null;
}

// ============================================
// SETTINGS
// ============================================

export async function getTaskSettings(): Promise<TaskSettings> {
  // TODO: Migrar a Supabase cuando esté listo
  
  if (typeof window === 'undefined') {
    return { maxActiveTasks: 5, autoArchiveDays: 7 };
  }
  
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!stored) {
    const defaultSettings: TaskSettings = { maxActiveTasks: 5, autoArchiveDays: 7 };
    await saveTaskSettings(defaultSettings);
    return defaultSettings;
  }
  
  return JSON.parse(stored) as TaskSettings;
}

export async function saveTaskSettings(settings: TaskSettings): Promise<void> {
  // TODO: Migrar a Supabase cuando esté listo
  
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ============================================
// AUTO-ARCHIVE
// ============================================

export async function autoArchiveCompletedTasks(): Promise<number> {
  const tasks = await getTasks();
  const settings = await getTaskSettings();
  const now = new Date();
  let archived = 0;
  
  const filtered = tasks.filter(task => {
    if (!task.isCompleted || !task.completedAt) return true;
    
    const completedDate = new Date(task.completedAt);
    const daysSinceCompleted = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceCompleted >= settings.autoArchiveDays) {
      archived++;
      return false; // Eliminar tarea
    }
    
    return true;
  });
  
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  return archived;
}

