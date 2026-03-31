import { StoreSetter, StoreGetter, PublicActions } from "../types";

// ============================================================================
// State
// ============================================================================

export interface TaskFiltersState {
  selectedProjectId: string | "all";
  selectedCategoryId: string | "all";
  searchQuery: string;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

function computeHasActiveFilters(
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

function computeActiveFiltersCount(
  selectedProjectId: string | "all",
  selectedCategoryId: string | "all",
  searchQuery: string,
): number {
  let count = 0;
  if (selectedProjectId !== "all") count++;
  if (selectedCategoryId !== "all") count++;
  if (searchQuery !== "") count++;
  return count;
}

export const initialTaskFiltersState: TaskFiltersState = {
  selectedProjectId: "all",
  selectedCategoryId: "all",
  searchQuery: "",
  hasActiveFilters: false,
  activeFiltersCount: 0,
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

  constructor(set: Setter, get: Getter, _api?: unknown) {
    void _api;
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
      activeFiltersCount: computeActiveFiltersCount(
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

  clearSearchQuery = (): void => {
    const state = this.#get();
    this.#updateFiltersState(
      state.selectedProjectId,
      state.selectedCategoryId,
      "",
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Global
  // --------------------------------------------------------------------------

  clearFilters = (): void => {
    this.#updateFiltersState("all", "all", "");
  };
}

// ============================================================================
// Slice Factory
// ============================================================================

export type TaskFiltersActions = PublicActions<TaskFiltersActionImpl>;

export const createTaskFiltersSlice = (
  set: Setter,
  get: Getter,
  api?: unknown,
) => new TaskFiltersActionImpl(set, get, api);
