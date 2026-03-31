import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { TaskViewMode } from "@/entities/task";

// ============================================================================
// State
// ============================================================================

export interface ViewModeState {
  viewMode: TaskViewMode;
  isTransitioning: boolean;
}

export const initialViewModeState: ViewModeState = {
  viewMode: "pipeline",
  isTransitioning: false,
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
  // Public Actions
  // --------------------------------------------------------------------------

  /**
   * Cambia el modo de vista con animación de transición
   */
  setViewMode = (mode: TaskViewMode): void => {
    if (this._get().viewMode === mode) return;

    this._set({ viewMode: mode, isTransitioning: true });

    // Finalizar transición después del delay
    setTimeout(() => {
      this._set({ isTransitioning: false });
    }, 150);
  };

  /**
   * Cambio inmediato sin animación
   */
  setViewModeImmediate = (mode: TaskViewMode): void => {
    if (this._get().viewMode === mode) return;
    this._set({ viewMode: mode, isTransitioning: false });
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type ViewModeActions = PublicActions<ViewModeActionImpl>;

export const createViewModeSlice = (set: Setter, get: Getter, api?: unknown) =>
  new ViewModeActionImpl(set, get, api);
