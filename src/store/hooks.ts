import { useStore } from "./index";
import { useShallow } from "zustand/react/shallow";

// ============================================================================
// Theme Hooks
// ============================================================================

/**
 * Hook para el estado del tema (valores que cambian)
 * @example
 * const { palette, themeClasses, isDarkPalette } = useThemeState();
 */
export function useThemeState() {
  return useStore(
    useShallow((state) => ({
      palette: state.palette,
      themeClasses: state.themeClasses,
      isDarkPalette: state.isDarkPalette,
    })),
  );
}

/**
 * Hook para las acciones del tema (nunca cambian)
 * @example
 * const { changePalette } = useThemeActions();
 */
export function useThemeActions() {
  return useStore(
    useShallow((state) => ({
      changePalette: state.changePalette,
    })),
  );
}

/**
 * Hook combinado para tema (estado + acciones)
 * Usar solo cuando se necesiten ambos
 * @example
 * const { palette, changePalette, themeClasses } = useTheme();
 */
export function useTheme() {
  return useStore(
    useShallow((state) => ({
      palette: state.palette,
      themeClasses: state.themeClasses,
      isDarkPalette: state.isDarkPalette,
      changePalette: state.changePalette,
    })),
  );
}

// ============================================================================
// Task Filters Hooks
// ============================================================================

/**
 * Hook para el estado de filtros (valores que cambian)
 * @example
 * const { selectedProjectId, selectedCategoryId, hasActiveFilters } = useTaskFiltersState();
 */
export function useTaskFiltersState() {
  return useStore(
    useShallow((state) => ({
      selectedProjectId: state.selectedProjectId,
      selectedCategoryId: state.selectedCategoryId,
      searchQuery: state.searchQuery,
      hasActiveFilters: state.hasActiveFilters,
      activeFiltersCount: state.activeFiltersCount,
    })),
  );
}

/**
 * Hook para las acciones de filtros (nunca cambian)
 * @example
 * const { setSelectedProject, clearFilters } = useTaskFiltersActions();
 */
export function useTaskFiltersActions() {
  return useStore(
    useShallow((state) => ({
      setSelectedProject: state.setSelectedProject,
      setSelectedCategory: state.setSelectedCategory,
      setSearchQuery: state.setSearchQuery,
      clearSearchQuery: state.clearSearchQuery,
      clearFilters: state.clearFilters,
    })),
  );
}

/**
 * Hook combinado para filtros
 * @example
 * const { selectedProjectId, setSelectedProject, clearFilters } = useTaskFilters();
 */
export function useTaskFilters() {
  return useStore(
    useShallow((state) => ({
      selectedProjectId: state.selectedProjectId,
      selectedCategoryId: state.selectedCategoryId,
      searchQuery: state.searchQuery,
      setSelectedProject: state.setSelectedProject,
      setSelectedCategory: state.setSelectedCategory,
      setSearchQuery: state.setSearchQuery,
      clearSearchQuery: state.clearSearchQuery,
      clearFilters: state.clearFilters,
      hasActiveFilters: state.hasActiveFilters,
      activeFiltersCount: state.activeFiltersCount,
    })),
  );
}

/**
 * Hook para la búsqueda
 * @example
 * const { searchQuery, setSearchQuery } = useTaskSearch();
 */
export function useTaskSearch() {
  return useStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      clearSearchQuery: state.clearSearchQuery,
    })),
  );
}

// ============================================================================
// View Mode Hooks
// ============================================================================

/**
 * Hook para el estado de vista (valores que cambian)
 * @example
 * const { viewMode, isTransitioning } = useViewModeState();
 */
export function useViewModeState() {
  return useStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      isTransitioning: state.isTransitioning,
    })),
  );
}

/**
 * Hook para las acciones de vista (nunca cambian)
 * @example
 * const { setViewMode } = useViewModeActions();
 */
export function useViewModeActions() {
  return useStore(
    useShallow((state) => ({
      setViewMode: state.setViewMode,
      setViewModeImmediate: state.setViewModeImmediate,
    })),
  );
}

/**
 * Hook combinado para modo de vista
 * @example
 * const { viewMode, setViewMode, isTransitioning } = useViewMode();
 */
export function useViewMode() {
  return useStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      isTransitioning: state.isTransitioning,
      setViewMode: state.setViewMode,
      setViewModeImmediate: state.setViewModeImmediate,
    })),
  );
}
