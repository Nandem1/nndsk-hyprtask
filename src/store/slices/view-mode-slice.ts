import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { TaskViewMode } from "@/entities/task";

// ============================================================================
// State
// ============================================================================

export interface ViewModeState {
  viewMode: TaskViewMode;
  isTransitioning: boolean;
  isKanbanView: boolean;
  isTerminalView: boolean;
  viewModeLabel: string;
}

const VIEW_MODE_LABELS: Record<TaskViewMode, string> = {
  kanban: "Kanban",
  timeline: "Timeline",
  minimal: "Minimal",
  "post-its": "Post-its",
  sticky: "Sticky Notes",
  terminal: "Terminal",
  "terminal-out": "Terminal Output",
  "code-notes": "Code Notes",
};

function computeIsKanbanView(mode: TaskViewMode): boolean {
  return mode === "kanban";
}

function computeIsTerminalView(mode: TaskViewMode): boolean {
  return mode === "terminal" || mode === "terminal-out";
}

function computeViewModeLabel(mode: TaskViewMode): string {
  return VIEW_MODE_LABELS[mode] ?? "";
}

export const initialViewModeState: ViewModeState = {
  viewMode: "kanban",
  isTransitioning: false,
  isKanbanView: true,
  isTerminalView: false,
  viewModeLabel: "Kanban",
};

// ============================================================================
// Actions Class
// ============================================================================

type ViewModeStore = ViewModeState & ViewModeActions;
type Setter = StoreSetter<ViewModeStore>;
type Getter = StoreGetter<ViewModeStore>;

export class ViewModeActionImpl {
  private readonly _get: Getter;
  private readonly _set: Setter;

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
    this._set = set;
    this._get = get;
  }

  // --------------------------------------------------------------------------
  // Internal Helpers
  // --------------------------------------------------------------------------

  private _updateViewModeState = (
    viewMode: TaskViewMode,
    isTransitioning: boolean,
  ): void => {
    this._set({
      viewMode,
      isTransitioning,
      isKanbanView: computeIsKanbanView(viewMode),
      isTerminalView: computeIsTerminalView(viewMode),
      viewModeLabel: computeViewModeLabel(viewMode),
    });
  };

  // --------------------------------------------------------------------------
  // Public Actions
  // --------------------------------------------------------------------------

  /**
   * Cambia el modo de vista con animación de transición
   */
  setViewMode = (mode: TaskViewMode): void => {
    // Iniciar transición
    this._updateViewModeState(mode, true);

    // Finalizar transición después del delay
    setTimeout(() => {
      this._set({ isTransitioning: false });
    }, 150);
  };

  /**
   * Cambio inmediato sin animación
   */
  setViewModeImmediate = (mode: TaskViewMode): void => {
    this._updateViewModeState(mode, false);
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type ViewModeActions = PublicActions<ViewModeActionImpl>;

export const createViewModeSlice = (set: Setter, get: Getter, api?: unknown) =>
  new ViewModeActionImpl(set, get, api);
