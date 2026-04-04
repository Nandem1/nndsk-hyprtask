// TIPOS PARA SISTEMA DE TAREAS

export type TaskPriority = "low" | "medium" | "high";

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

  // Referencias por ID a proyectos/categorías configurables
  projectId?: string; // ID del proyecto
  categoryId?: string; // ID de la categoría

  // Campos para relaciones y notas
  notes?: string; // Notas persistentes de la tarea
  parentTaskId?: string; // ID de la tarea anterior en el pipeline
  childTaskId?: string; // ID de la tarea siguiente en el pipeline
  order?: number; // Orden en el pipeline (para ordenamiento manual)
}

// Configuración de límites
export interface TaskSettings {
  maxActiveTasks: number; // Máximo de tareas activas (default: 5)
  autoArchiveDays: number; // Días para auto-archivar completadas (default: 7)
}

export interface FocusSessionData {
  count: number;
  lastDate: string;
  totalMinutes: number;
}
