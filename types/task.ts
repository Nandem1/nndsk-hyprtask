// TIPOS PARA SISTEMA DE TAREAS
// Preparados para migrar a Supabase sin cambios

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskProject = 'MH-Backend' | 'Wails-Letter-MH' | 'MH-Next' | 'La Cantera' | 'general';
export type TaskCategory = 'issues' | 'fixes' | 'hotfix' | 'features' | 'general';

export interface Task {
  id: string;
  userId?: string; // Para Supabase, opcional en localStorage
  title: string;
  isCompleted: boolean;
  isCurrent: boolean; // Tarea actual en la que estás trabajando
  priority: TaskPriority;
  createdAt: string;
  completedAt?: string;
  dueDate?: string; // Formato YYYY-MM-DD
  project?: TaskProject; // Proyecto al que pertenece (opcional para compatibilidad)
  category?: TaskCategory; // Categoría de la tarea (opcional para compatibilidad)
}

// Configuración de límites
export interface TaskSettings {
  maxActiveTasks: number; // Máximo de tareas activas (default: 5)
  autoArchiveDays: number; // Días para auto-archivar completadas (default: 7)
}

