// TIPOS PARA MODOS DE VISTA DE TAREAS

export type TaskViewMode = 
  | 'terminal'      // Lista tipo terminal/notas
  | 'sticky'        // Sticky notes flotantes
  | 'timeline'      // Lista tipo timeline/stream
  | 'kanban'        // Diseño tipo kanban minimalista
  | 'code-notes'    // Estilo comentarios de código
  | 'post-its'      // Post-its comfy
  | 'minimal'       // Lista minimalista con líneas
  | 'terminal-out'; // Terminal output

export interface ViewModeConfig {
  id: TaskViewMode;
  name: string;
  emoji: string;
  description: string;
}

export const VIEW_MODES: ViewModeConfig[] = [
  {
    id: 'terminal',
    name: 'Terminal Notes',
    emoji: '📝',
    description: 'Lista tipo terminal con bordes sutiles',
  },
  {
    id: 'sticky',
    name: 'Sticky Notes',
    emoji: '📌',
    description: 'Notas flotantes con rotación sutil',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    emoji: '📅',
    description: 'Stream vertical con conectores',
  },
  {
    id: 'kanban',
    name: 'Kanban',
    emoji: '📋',
    description: 'Columnas minimalistas',
  },
  {
    id: 'code-notes',
    name: 'Code Notes',
    emoji: '💻',
    description: 'Estilo comentarios de código',
  },
  {
    id: 'post-its',
    name: 'Post-its',
    emoji: '🗒️',
    description: 'Notas comfy con colores pastel',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    emoji: '✨',
    description: 'Lista limpia sin cards',
  },
  {
    id: 'terminal-out',
    name: 'Terminal Output',
    emoji: '🖥️',
    description: 'Output tipo terminal',
  },
];
