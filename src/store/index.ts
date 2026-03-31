import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
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
  devtools(
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
        // Persist theme, filters and view mode
        partialize: (state) => ({
          palette: state.palette,
          selectedProjectId: state.selectedProjectId,
          selectedCategoryId: state.selectedCategoryId,
          searchQuery: state.searchQuery,
          viewMode: state.viewMode,
        }),
        // Custom merge to handle computed values on rehydration
        merge: (persistedState, currentState) => {
          const persisted = persistedState as {
            palette?: typeof DEFAULT_PALETTE;
            selectedProjectId?: TaskFiltersState["selectedProjectId"];
            selectedCategoryId?: TaskFiltersState["selectedCategoryId"];
            searchQuery?: string;
            viewMode?: ViewModeState["viewMode"];
            // Legacy fields for migration
            selectedProject?: string;
            selectedCategory?: string;
          };

          const palette = persisted.palette ?? DEFAULT_PALETTE;

          // Migrate legacy field names
          const selectedProjectId =
            persisted.selectedProjectId ?? persisted.selectedProject ?? "all";
          const selectedCategoryId =
            persisted.selectedCategoryId ?? persisted.selectedCategory ?? "all";

          const searchQuery = persisted.searchQuery ?? "";
          const viewMode = persisted.viewMode ?? "pipeline";

          // Re-compute computed values
          const hasActiveFilters =
            selectedProjectId !== "all" ||
            selectedCategoryId !== "all" ||
            searchQuery !== "";
          const activeFiltersCount =
            (selectedProjectId !== "all" ? 1 : 0) +
            (selectedCategoryId !== "all" ? 1 : 0) +
            (searchQuery !== "" ? 1 : 0);

          return {
            ...currentState,
            // Theme
            palette,
            themeClasses: computeThemeClasses(palette),
            isDarkPalette: computeIsDarkPalette(palette),
            // Filters
            selectedProjectId,
            selectedCategoryId,
            searchQuery,
            hasActiveFilters,
            activeFiltersCount,
            // View Mode
            viewMode,
            _hasHydrated: true,
          };
        },
        // Skip hydration during SSR
        skipHydration: typeof window === "undefined",
      },
    ),
    { name: "hyprtask-store" },
  ),
);

// ============================================================================
// Store Initializer (lightweight, just marks hydration complete)
// ============================================================================

export { StoreInitializer } from "./StoreInitializer";
