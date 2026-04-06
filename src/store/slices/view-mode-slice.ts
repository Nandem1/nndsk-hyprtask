import { StoreSetter, StoreGetter } from "../types";
import type { TaskViewMode } from "@/shared/types/view-mode";

// ============================================================================
// State
// ============================================================================

export interface ViewModeState {
  viewMode: TaskViewMode;
}

export const initialViewModeState: ViewModeState = {
  viewMode: "pipeline",
};

// ============================================================================
// Actions Class
// ============================================================================

type ViewModeStore = ViewModeState & ViewModeActions;
type Setter = StoreSetter<ViewModeStore>;
type Getter = StoreGetter<ViewModeStore>;

export class ViewModeActionImpl {
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter) {
    this.#set = set;
    this.#get = get;
  }

  // --------------------------------------------------------------------------
  // Public Actions
  // --------------------------------------------------------------------------

  setViewMode = (mode: TaskViewMode): void => {
    if (this.#get().viewMode === mode) return;
    this.#set({ viewMode: mode });
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type ViewModeActions = {
  setViewMode: (mode: TaskViewMode) => void;
};

export const createViewModeSlice = (set: Setter, get: Getter) =>
  new ViewModeActionImpl(set, get);
