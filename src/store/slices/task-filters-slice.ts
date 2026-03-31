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

  private _updateFiltersState = (
    selectedProjectId: string | "all",
    selectedCategoryId: string | "all",
    searchQuery: string,
  ): void => {
    this._set({
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
    const state = this._get();
    this._updateFiltersState(
      projectId,
      state.selectedCategoryId,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Category
  // --------------------------------------------------------------------------

  setSelectedCategory = (categoryId: string | "all"): void => {
    const state = this._get();
    this._updateFiltersState(
      state.selectedProjectId,
      categoryId,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Search
  // --------------------------------------------------------------------------

  setSearchQuery = (query: string): void => {
    const state = this._get();
    this._updateFiltersState(
      state.selectedProjectId,
      state.selectedCategoryId,
      query,
    );
  };

  clearSearchQuery = (): void => {
    const state = this._get();
    this._updateFiltersState(
      state.selectedProjectId,
      state.selectedCategoryId,
      "",
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Global
  // --------------------------------------------------------------------------

  clearFilters = (): void => {
    this._updateFiltersState("all", "all", "");
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
