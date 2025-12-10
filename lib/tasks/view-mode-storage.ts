// ALMACENAMIENTO DE VIEW MODE
// localStorage por ahora, preparado para migrar a Supabase

import type { TaskViewMode } from '@/types/view-mode';

const STORAGE_KEY = 'hyprtodo_task_view_mode';

export function getTaskViewMode(): TaskViewMode {
  if (typeof window === 'undefined') {
    return 'terminal'; // Default
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return 'terminal';
  
  // Validar que el view mode almacenado sea válido
  const validModes: TaskViewMode[] = [
    'terminal',
    'sticky',
    'timeline',
    'kanban',
    'code-notes',
    'post-its',
    'minimal',
    'terminal-out',
  ];
  
  if (stored && validModes.includes(stored as TaskViewMode)) {
    return stored as TaskViewMode;
  }
  
  return 'terminal';
}

export function saveTaskViewMode(mode: TaskViewMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, mode);
}
