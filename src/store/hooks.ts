import { useStore } from "./index";
import { useShallow } from "zustand/react/shallow";

export function useThemeState() {
  return useStore(
    useShallow((state) => ({
      palette: state.palette,
      themeClasses: state.themeClasses,
    })),
  );
}

export function useTheme() {
  return useStore(
    useShallow((state) => ({
      palette: state.palette,
      themeClasses: state.themeClasses,
      changePalette: state.changePalette,
    })),
  );
}

export function useTaskFiltersState() {
  return useStore(
    useShallow((state) => ({
      selectedProjectId: state.selectedProjectId,
      selectedCategoryId: state.selectedCategoryId,
      searchQuery: state.searchQuery,
      hasActiveFilters: state.hasActiveFilters,
    })),
  );
}

export function useTaskFiltersActions() {
  return useStore(
    useShallow((state) => ({
      setSelectedProject: state.setSelectedProject,
      setSelectedCategory: state.setSelectedCategory,
      setSearchQuery: state.setSearchQuery,
    })),
  );
}

export function useViewModeState() {
  return useStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      isTransitioning: state.isTransitioning,
    })),
  );
}

export function useViewModeActions() {
  return useStore(
    useShallow((state) => ({
      setViewMode: state.setViewMode,
    })),
  );
}

export function useColacionState() {
  return useStore(
    useShallow((state) => ({
      isColacionOpen: state.isColacionOpen,
    })),
  );
}

export function useColacionActions() {
  return useStore(
    useShallow((state) => ({
      openColacion: state.openColacion,
      closeColacion: state.closeColacion,
    })),
  );
}
