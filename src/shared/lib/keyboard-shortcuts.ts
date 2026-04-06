export interface ShortcutDef {
  keys: string[];
  hotkeyString: string;
  description: string;
  group: string;
  requiresSelection: boolean;
}

export const KEYBOARD_SELECTED_RING =
  "ring-2 ring-primary/50 ring-offset-2 ring-offset-background shadow-lg shadow-primary/10" as const;

export const SHORTCUT_GROUPS_ORDER = [
  "Navegacion",
  "Tareas",
  "Vistas",
  "General",
] as const;

export const SHORTCUTS = {
  NAVIGATE_DOWN: {
    keys: ["j", "↓"],
    hotkeyString: "j, ArrowDown",
    description: "Siguiente nota",
    group: "Navegacion",
    requiresSelection: false,
  },
  NAVIGATE_UP: {
    keys: ["k", "↑"],
    hotkeyString: "k, ArrowUp",
    description: "Nota anterior",
    group: "Navegacion",
    requiresSelection: false,
  },
  OPEN_DETAIL: {
    keys: ["Enter"],
    hotkeyString: "Enter",
    description: "Abrir detalle de la nota",
    group: "Navegacion",
    requiresSelection: true,
  },
  CLOSE: {
    keys: ["Escape"],
    hotkeyString: "Escape",
    description: "Cerrar modal / dialogo",
    group: "Navegacion",
    requiresSelection: false,
  },
  NEW_TASK: {
    keys: ["n"],
    hotkeyString: "n",
    description: "Crear nueva nota",
    group: "Tareas",
    requiresSelection: false,
  },
  FOCUS_MODE: {
    keys: ["f"],
    hotkeyString: "f",
    description: "Modo Foco en nota actual",
    group: "Tareas",
    requiresSelection: true,
  },
  TOGGLE_COMPLETE: {
    keys: ["Space"],
    hotkeyString: "Space",
    description: "Completar / descompletar nota",
    group: "Tareas",
    requiresSelection: true,
  },
  DELETE_TASK: {
    keys: ["d"],
    hotkeyString: "d",
    description: "Eliminar nota seleccionada",
    group: "Tareas",
    requiresSelection: true,
  },
  SET_CURRENT: {
    keys: ["s"],
    hotkeyString: "s",
    description: "Marcar nota como actual",
    group: "Tareas",
    requiresSelection: true,
  },
  VIEW_PIPELINE: {
    keys: ["1"],
    hotkeyString: "1",
    description: "Vista Pipeline",
    group: "Vistas",
    requiresSelection: false,
  },
  VIEW_KANBAN: {
    keys: ["2"],
    hotkeyString: "2",
    description: "Vista Kanban",
    group: "Vistas",
    requiresSelection: false,
  },
  CLEAR_FILTERS: {
    keys: ["q"],
    hotkeyString: "q",
    description: "Limpiar filtros",
    group: "General",
    requiresSelection: false,
  },
  HELP: {
    keys: ["?"],
    hotkeyString: "?",
    description: "Abrir / cerrar esta guia",
    group: "General",
    requiresSelection: false,
  },
} satisfies Record<string, ShortcutDef>;

export type ShortcutId = keyof typeof SHORTCUTS;

export const SHORTCUTS_ENTRIES = Object.entries(SHORTCUTS) as [
  ShortcutId,
  ShortcutDef,
][];

export const SIDEBAR_SHORTCUT_IDS: ShortcutId[] = [
  "NAVIGATE_DOWN",
  "OPEN_DETAIL",
  "NEW_TASK",
  "FOCUS_MODE",
  "TOGGLE_COMPLETE",
];



export function stopSpacePropagation(e: {
  key: string;
  stopPropagation: () => void;
}) {
  if (e.key === " ") {
    e.stopPropagation();
  }
}
