import { create } from "zustand";
import { persist } from "zustand/middleware";
import { flattenActions } from "./utils";

// Slices
import {
  createThemeSlice,
  initialThemeState,
  type ThemeState,
  type ThemeActions,
  DEFAULT_PALETTE,
  computeThemeClasses,
  computeIsDarkPalette,
} from "./slices/theme-slice";
import {
  createTaskFiltersSlice,
  initialTaskFiltersState,
  type TaskFiltersState,
  type TaskFiltersActions,
} from "./slices/task-filters-slice";
import {
  createViewModeSlice,
  initialViewModeState,
  type ViewModeState,
  type ViewModeActions,
} from "./slices/view-mode-slice";

// ============================================================================
// Store Type
// ============================================================================

export interface AppStore
  extends
    ThemeState,
    TaskFiltersState,
    ViewModeState,
    ThemeActions,
    TaskFiltersActions,
    ViewModeActions {
  // Persist middleware properties
  _hasHydrated?: boolean;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: ThemeState & TaskFiltersState & ViewModeState = {
  ...initialThemeState,
  ...initialTaskFiltersState,
  ...initialViewModeState,
};

// ============================================================================
// Store Creation with Persist Middleware
// ============================================================================

export const useStore = create<AppStore>()(
  persist(
    (...params) => ({
      ...initialState,
      ...flattenActions<ThemeActions & TaskFiltersActions & ViewModeActions>([
        createThemeSlice(...params),
        createTaskFiltersSlice(...params),
        createViewModeSlice(...params),
      ]),
      _hasHydrated: false,
    }),
    {
      name: "hyprtask-store",
      // Only persist theme palette, not the entire state
      partialize: (state) => ({
        palette: state.palette,
      }),
      // Custom merge to handle computed values on rehydration
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          palette?: typeof DEFAULT_PALETTE;
        };
        const palette = persisted.palette ?? DEFAULT_PALETTE;

        return {
          ...currentState,
          palette,
          themeClasses: computeThemeClasses(palette),
          isDarkPalette: computeIsDarkPalette(palette),
          _hasHydrated: true,
        };
      },
      // Skip hydration during SSR
      skipHydration: typeof window === "undefined",
    },
  ),
);

// ============================================================================
// Store Initializer (lightweight, just marks hydration complete)
// ============================================================================

export { StoreInitializer } from "./StoreInitializer";

// ============================================================================
// Re-exports
// ============================================================================

export * from "./types";
export * from "./utils";
export * from "./slices/theme-slice";
export * from "./slices/task-filters-slice";
export * from "./slices/view-mode-slice";
