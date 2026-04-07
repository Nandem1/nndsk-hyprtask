export type ShortcutContext = "global" | "detail" | "focus";

export interface ShortcutDef {
  keys: string[];
  hotkeyString: string;
  description: string;
  group: string;
  requiresSelection: boolean;
  context: ShortcutContext;
  isSequence?: boolean;
}

export const KEYBOARD_SELECTED_RING =
  "ring-2 ring-primary/50 ring-offset-2 ring-offset-background shadow-lg shadow-primary/10" as const;

export const SHORTCUT_GROUPS_ORDER = [
  "Navegacion",
  "Tareas",
  "Vistas",
  "Interfaz",
  "General",
  "Ir a",
  "En detalle",
  "En foco",
] as const;

export const SHORTCUTS = {
  // ── Navegacion ──────────────────────────────────────────────
  NAVIGATE_DOWN: {
    keys: ["j", "↓"],
    hotkeyString: "j, ArrowDown",
    description: "Siguiente nota",
    group: "Navegacion",
    requiresSelection: false,
    context: "global",
  },
  NAVIGATE_UP: {
    keys: ["k", "↑"],
    hotkeyString: "k, ArrowUp",
    description: "Nota anterior",
    group: "Navegacion",
    requiresSelection: false,
    context: "global",
  },
  OPEN_DETAIL: {
    keys: ["Enter"],
    hotkeyString: "Enter",
    description: "Abrir detalle de la nota",
    group: "Navegacion",
    requiresSelection: true,
    context: "global",
  },
  CLOSE: {
    keys: ["Esc"],
    hotkeyString: "Escape",
    description: "Cerrar / limpiar seleccion",
    group: "Navegacion",
    requiresSelection: false,
    context: "global",
  },

  // ── Tareas ───────────────────────────────────────────────────
  NEW_TASK: {
    keys: ["n"],
    hotkeyString: "n",
    description: "Crear nueva nota",
    group: "Tareas",
    requiresSelection: false,
    context: "global",
  },
  ALIAS_NEW_TASK: {
    keys: ["o"],
    hotkeyString: "o",
    description: "Crear nueva nota (alias)",
    group: "Tareas",
    requiresSelection: false,
    context: "global",
  },
  FOCUS_MODE: {
    keys: ["f"],
    hotkeyString: "f",
    description: "Modo Foco en nota actual",
    group: "Tareas",
    requiresSelection: true,
    context: "global",
  },
  TOGGLE_COMPLETE: {
    keys: ["Space"],
    hotkeyString: "Space",
    description: "Completar / descompletar nota",
    group: "Tareas",
    requiresSelection: true,
    context: "global",
  },
  DELETE_TASK: {
    keys: ["d"],
    hotkeyString: "d",
    description: "Eliminar nota seleccionada",
    group: "Tareas",
    requiresSelection: true,
    context: "global",
  },
  SET_CURRENT: {
    keys: ["s"],
    hotkeyString: "s",
    description: "Marcar nota como actual",
    group: "Tareas",
    requiresSelection: true,
    context: "global",
  },

  // ── Vistas ───────────────────────────────────────────────────
  VIEW_PIPELINE: {
    keys: ["1"],
    hotkeyString: "1",
    description: "Vista Pipeline",
    group: "Vistas",
    requiresSelection: false,
    context: "global",
  },
  VIEW_KANBAN: {
    keys: ["2"],
    hotkeyString: "2",
    description: "Vista Kanban",
    group: "Vistas",
    requiresSelection: false,
    context: "global",
  },
  CYCLE_VIEW: {
    keys: ["v"],
    hotkeyString: "v",
    description: "Alternar vista",
    group: "Vistas",
    requiresSelection: false,
    context: "global",
  },

  // ── Interfaz ─────────────────────────────────────────────────
  OPEN_COLACION: {
    keys: ["m"],
    hotkeyString: "m",
    description: "Abrir Colacion",
    group: "Interfaz",
    requiresSelection: false,
    context: "global",
  },
  CYCLE_THEME: {
    keys: ["t"],
    hotkeyString: "t",
    description: "Ciclar paleta de tema",
    group: "Interfaz",
    requiresSelection: false,
    context: "global",
  },
  TOGGLE_SIDEBAR: {
    keys: ["\\"],
    hotkeyString: "\\",
    description: "Toggle sidebar",
    group: "Interfaz",
    requiresSelection: false,
    context: "global",
  },

  // ── General ──────────────────────────────────────────────────
  CLEAR_FILTERS: {
    keys: ["q"],
    hotkeyString: "q",
    description: "Limpiar filtros",
    group: "General",
    requiresSelection: false,
    context: "global",
  },
  FILTER_PREV: {
    keys: ["["],
    hotkeyString: "[",
    description: "Proyecto anterior",
    group: "General",
    requiresSelection: false,
    context: "global",
  },
  FILTER_NEXT: {
    keys: ["]"],
    hotkeyString: "]",
    description: "Proyecto siguiente",
    group: "General",
    requiresSelection: false,
    context: "global",
  },

  // ── Ir a (leader key: g) ─────────────────────────────────────
  GOTO_HOME: {
    keys: ["g", "h"],
    hotkeyString: "",
    description: "Ir a Tareas",
    group: "Ir a",
    requiresSelection: false,
    context: "global",
    isSequence: true,
  },
  GOTO_SLEEP: {
    keys: ["g", "s"],
    hotkeyString: "",
    description: "Ir a Sleep",
    group: "Ir a",
    requiresSelection: false,
    context: "global",
    isSequence: true,
  },
  GOTO_WORK: {
    keys: ["g", "w"],
    hotkeyString: "",
    description: "Ir a Trabajo",
    group: "Ir a",
    requiresSelection: false,
    context: "global",
    isSequence: true,
  },
  GOTO_CONFIG: {
    keys: ["g", "c"],
    hotkeyString: "",
    description: "Ir a Configuracion",
    group: "Ir a",
    requiresSelection: false,
    context: "global",
    isSequence: true,
  },

  // ── En detalle ───────────────────────────────────────────────
  DETAIL_EDIT_NOTES: {
    keys: ["e"],
    hotkeyString: "e",
    description: "Editar notas",
    group: "En detalle",
    requiresSelection: false,
    context: "detail",
  },
  DETAIL_SAVE_NOTES: {
    keys: ["Ctrl+↵"],
    hotkeyString: "ctrl+enter",
    description: "Guardar notas",
    group: "En detalle",
    requiresSelection: false,
    context: "detail",
  },
  DETAIL_CYCLE_PRIORITY: {
    keys: ["p"],
    hotkeyString: "p",
    description: "Ciclar prioridad",
    group: "En detalle",
    requiresSelection: false,
    context: "detail",
  },

  // ── En foco ──────────────────────────────────────────────────
  FOCUS_PLAY_PAUSE: {
    keys: ["Space"],
    hotkeyString: "Space",
    description: "Play / Resume timer",
    group: "En foco",
    requiresSelection: false,
    context: "focus",
  },
  FOCUS_PAUSE: {
    keys: ["p"],
    hotkeyString: "p",
    description: "Pausar timer",
    group: "En foco",
    requiresSelection: false,
    context: "focus",
  },
  FOCUS_RESET: {
    keys: ["r"],
    hotkeyString: "r",
    description: "Resetear timer",
    group: "En foco",
    requiresSelection: false,
    context: "focus",
  },
  FOCUS_COMPLETE: {
    keys: ["c"],
    hotkeyString: "c",
    description: "Completar tarea y salir",
    group: "En foco",
    requiresSelection: false,
    context: "focus",
  },
  FOCUS_SKIP_BREAK: {
    keys: ["b"],
    hotkeyString: "b",
    description: "Saltar break",
    group: "En foco",
    requiresSelection: false,
    context: "focus",
  },
} satisfies Record<string, ShortcutDef>;

export type ShortcutId = keyof typeof SHORTCUTS;

export const SHORTCUTS_ENTRIES = Object.entries(SHORTCUTS) as [
  ShortcutId,
  ShortcutDef,
][];

export function stopSpacePropagation(e: {
  key: string;
  stopPropagation: () => void;
}) {
  if (e.key === " ") {
    e.stopPropagation();
  }
}
