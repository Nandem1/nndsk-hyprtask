import { StoreSetter, StoreGetter, PublicActions } from "../types";
import type { TaskProject, TaskCategory } from "@/entities/task";

// ============================================================================
// State
// ============================================================================

export interface TaskFiltersState {
  selectedProject: TaskProject | "all";
  selectedCategory: TaskCategory | "all";
  searchQuery: string;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

function computeHasActiveFilters(
  selectedProject: TaskProject | "all",
  selectedCategory: TaskCategory | "all",
  searchQuery: string,
): boolean {
  return (
    selectedProject !== "all" ||
    selectedCategory !== "all" ||
    searchQuery !== ""
  );
}

function computeActiveFiltersCount(
  selectedProject: TaskProject | "all",
  selectedCategory: TaskCategory | "all",
  searchQuery: string,
): number {
  let count = 0;
  if (selectedProject !== "all") count++;
  if (selectedCategory !== "all") count++;
  if (searchQuery !== "") count++;
  return count;
}

export const initialTaskFiltersState: TaskFiltersState = {
  selectedProject: "all",
  selectedCategory: "all",
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
    selectedProject: TaskProject | "all",
    selectedCategory: TaskCategory | "all",
    searchQuery: string,
  ): void => {
    this._set({
      selectedProject,
      selectedCategory,
      searchQuery,
      hasActiveFilters: computeHasActiveFilters(
        selectedProject,
        selectedCategory,
        searchQuery,
      ),
      activeFiltersCount: computeActiveFiltersCount(
        selectedProject,
        selectedCategory,
        searchQuery,
      ),
    });
  };

  // --------------------------------------------------------------------------
  // Public Actions - Project
  // --------------------------------------------------------------------------

  setSelectedProject = (project: TaskProject | "all"): void => {
    const state = this._get();
    this._updateFiltersState(
      project,
      state.selectedCategory,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Category
  // --------------------------------------------------------------------------

  setSelectedCategory = (category: TaskCategory | "all"): void => {
    const state = this._get();
    this._updateFiltersState(
      state.selectedProject,
      category,
      state.searchQuery,
    );
  };

  // --------------------------------------------------------------------------
  // Public Actions - Search
  // --------------------------------------------------------------------------

  setSearchQuery = (query: string): void => {
    const state = this._get();
    this._updateFiltersState(
      state.selectedProject,
      state.selectedCategory,
      query,
    );
  };

  clearSearchQuery = (): void => {
    const state = this._get();
    this._updateFiltersState(state.selectedProject, state.selectedCategory, "");
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
