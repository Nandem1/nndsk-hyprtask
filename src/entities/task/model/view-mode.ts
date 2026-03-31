// Tipos para modos de vista de tareas

export type TaskViewMode = "pipeline" | "kanban";

export interface ViewModeConfig {
  id: TaskViewMode;
  name: string;
  emoji: string;
  description: string;
}

export const VIEW_MODES: ViewModeConfig[] = [
  {
    id: "pipeline",
    name: "Pipeline",
    emoji: "🔄",
    description: "Flujo secuencial de tareas",
  },
  {
    id: "kanban",
    name: "Kanban",
    emoji: "📋",
    description: "Columnas tipo tablero",
  },
];
