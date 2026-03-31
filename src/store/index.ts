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
          selectedProject: state.selectedProject,
          selectedCategory: state.selectedCategory,
          searchQuery: state.searchQuery,
          viewMode: state.viewMode,
        }),
        // Custom merge to handle computed values on rehydration
        merge: (persistedState, currentState) => {
          const persisted = persistedState as {
            palette?: typeof DEFAULT_PALETTE;
            selectedProject?: TaskFiltersState["selectedProject"];
            selectedCategory?: TaskFiltersState["selectedCategory"];
            searchQuery?: string;
            viewMode?: ViewModeState["viewMode"];
          };

          const palette = persisted.palette ?? DEFAULT_PALETTE;
          const selectedProject = persisted.selectedProject ?? "all";
          const selectedCategory = persisted.selectedCategory ?? "all";
          const searchQuery = persisted.searchQuery ?? "";
          const viewMode = persisted.viewMode ?? "kanban";

          // Re-compute computed values
          const hasActiveFilters =
            selectedProject !== "all" ||
            selectedCategory !== "all" ||
            searchQuery !== "";
          const activeFiltersCount =
            (selectedProject !== "all" ? 1 : 0) +
            (selectedCategory !== "all" ? 1 : 0) +
            (searchQuery !== "" ? 1 : 0);

          return {
            ...currentState,
            // Theme
            palette,
            themeClasses: computeThemeClasses(palette),
            isDarkPalette: computeIsDarkPalette(palette),
            // Filters
            selectedProject,
            selectedCategory,
            searchQuery,
            hasActiveFilters,
            activeFiltersCount,
            // View Mode
            viewMode,
            isKanbanView: viewMode === "kanban",
            isTerminalView:
              viewMode === "terminal" || viewMode === "terminal-out",
            viewModeLabel:
              {
                kanban: "Kanban",
                timeline: "Timeline",
                minimal: "Minimal",
                "post-its": "Post-its",
                sticky: "Sticky Notes",
                terminal: "Terminal",
                "terminal-out": "Terminal Output",
                "code-notes": "Code Notes",
              }[viewMode] ?? "",
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

// ============================================================================
// Re-exports
// ============================================================================

export * from "./types";
export * from "./utils";
export * from "./slices/theme-slice";
export * from "./slices/task-filters-slice";
export * from "./slices/view-mode-slice";
