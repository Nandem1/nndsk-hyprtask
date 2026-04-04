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
} from "./slices/theme-slice";
import {
  createTaskFiltersSlice,
  initialTaskFiltersState,
  type TaskFiltersState,
  type TaskFiltersActions,
  computeHasActiveFilters,
} from "./slices/task-filters-slice";
import {
  createViewModeSlice,
  initialViewModeState,
  type ViewModeState,
  type ViewModeActions,
} from "./slices/view-mode-slice";
import {
  createUIPreferencesSlice,
  initialUIPreferencesState,
  type UIPreferencesState,
  type UIPreferencesActions,
} from "./slices/ui-preferences-slice";

// ============================================================================
// Store Type
// ============================================================================

export interface AppStore
  extends
    ThemeState,
    TaskFiltersState,
    ViewModeState,
    UIPreferencesState,
    ThemeActions,
    TaskFiltersActions,
    ViewModeActions,
    UIPreferencesActions {
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: ThemeState & TaskFiltersState & ViewModeState & UIPreferencesState = {
  ...initialThemeState,
  ...initialTaskFiltersState,
  ...initialViewModeState,
  ...initialUIPreferencesState,
};

// ============================================================================
// Store Creation with Persist Middleware
// ============================================================================

export const useStore = create<AppStore>()(
  devtools(
    persist(
      (...params: any[]) => ({
        ...initialState,
        ...flattenActions<ThemeActions & TaskFiltersActions & ViewModeActions & UIPreferencesActions>([
          createThemeSlice(params[0], params[1]),
          createTaskFiltersSlice(params[0], params[1]),
          createViewModeSlice(params[0], params[1]),
          createUIPreferencesSlice(params[0], params[1]),
        ]),
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
          animatedEmotes: state.animatedEmotes,
        }),
        // Custom merge to handle computed values on rehydration
        merge: (persistedState, currentState) => {
          const persisted = persistedState as {
            palette?: typeof DEFAULT_PALETTE;
            selectedProjectId?: TaskFiltersState["selectedProjectId"];
            selectedCategoryId?: TaskFiltersState["selectedCategoryId"];
            searchQuery?: string;
            viewMode?: ViewModeState["viewMode"];
            animatedEmotes?: boolean;
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
          const animatedEmotes = persisted.animatedEmotes ?? true;

          const hasActiveFilters = computeHasActiveFilters(
            selectedProjectId,
            selectedCategoryId,
            searchQuery,
          );

          return {
            ...currentState,
            palette,
            themeClasses: computeThemeClasses(palette),
            selectedProjectId,
            selectedCategoryId,
            searchQuery,
            hasActiveFilters,
            viewMode,
            animatedEmotes,
          };
        },
        // Skip hydration during SSR
        skipHydration: typeof window === "undefined",
      },
    ),
    { name: "hyprtask-store" },
  ),
);

