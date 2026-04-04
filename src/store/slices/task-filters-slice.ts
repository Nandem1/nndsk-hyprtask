import { StoreSetter, StoreGetter } from "../types";

// ============================================================================
// State
// ============================================================================

export interface TaskFiltersState {
  selectedProjectId: string | "all";
  selectedCategoryId: string | "all";
  searchQuery: string;
  hasActiveFilters: boolean;
}

export function computeHasActiveFilters(
  selectedProjectId: string | "all",
  selectedCategoryId: string | "all",
  searchQuery: string,
): boolean {
  return (
    selectedProjectId !== "all" ||
    selectedCategoryId !== "all" ||
    searchQuery !== ""
  );
}

export const initialTaskFiltersState: TaskFiltersState = {
  selectedProjectId: "all",
  selectedCategoryId: "all",
  searchQuery: "",
  hasActiveFilters: false,
};

// ============================================================================
// Actions Class
// ============================================================================

type FiltersStore = TaskFiltersState & TaskFiltersActions;
type Setter = StoreSetter<FiltersStore>;
type Getter = StoreGetter<FiltersStore>;

export class TaskFiltersActionImpl {
  readonly #get: Getter;
  readonly #set: Setter;

  constructor(set: Setter, get: Getter) {
    this.#set = set;
    this.#get = get;
  }

  // --------------------------------------------------------------------------
  // Internal Helpers
  // --------------------------------------------------------------------------

  #updateFiltersState = (
    selectedProjectId: string | "all",
    selectedCategoryId: string | "all",
    searchQuery: string,
  ): void => {
    this.#set({
      selectedProjectId,
      selectedCategoryId,
      searchQuery,
      hasActiveFilters: computeHasActiveFilters(
        selectedProjectId,
        selectedCategoryId,
        searchQuery,
      ),
    });
  };

  // --------------------------------------------------------------------------
  // Public Actions - Project
  // --------------------------------------------------------------------------

  setSelectedProject = (projectId: string | "all"): void => {
    const state = this.#get();
    this.#updateFiltersState(
      projectId,
      state.selectedCategoryId,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Category
  // --------------------------------------------------------------------------

  setSelectedCategory = (categoryId: string | "all"): void => {
    const state = this.#get();
    this.#updateFiltersState(
      state.selectedProjectId,
      categoryId,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Search
  // --------------------------------------------------------------------------

  setSearchQuery = (query: string): void => {
    const state = this.#get();
    this.#updateFiltersState(
      state.selectedProjectId,
      state.selectedCategoryId,
      query,
    );
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type TaskFiltersActions = {
  setSelectedProject: (projectId: string | "all") => void;
  setSelectedCategory: (categoryId: string | "all") => void;
  setSearchQuery: (query: string) => void;
};

export const createTaskFiltersSlice = (
  set: Setter,
  get: Getter,
) => new TaskFiltersActionImpl(set, get);
