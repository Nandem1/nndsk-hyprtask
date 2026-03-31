import { useStore } from "./index";
import { useShallow } from "zustand/react/shallow";
import type { ThemePalette } from "@/shared/types/theme";
import type { TaskProject, TaskCategory, TaskViewMode } from "@/entities/task";

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

/**
 * Hook ligero para solo leer la paleta actual
 * Útil cuando solo necesitas el valor, no las acciones
 * @example
 * const palette = useThemePaletteOnly();
 */
export function useThemePaletteOnly(): ThemePalette {
  return useStore((state) => state.palette);
}

/**
 * Hook para verificar si la paleta es oscura
 * @example
 * const isDark = useIsDarkPalette();
 */
export function useIsDarkPalette(): boolean {
  return useStore((state) => state.isDarkPalette);
}

// ============================================================================
// Task Filters Hooks
// ============================================================================

/**
 * Hook para el estado de filtros (valores que cambian)
 * @example
 * const { selectedProject, selectedCategory, hasActiveFilters } = useTaskFiltersState();
 */
export function useTaskFiltersState() {
  return useStore(
    useShallow((state) => ({
      selectedProject: state.selectedProject,
      selectedCategory: state.selectedCategory,
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
 * const { selectedProject, setSelectedProject, clearFilters } = useTaskFilters();
 */
export function useTaskFilters() {
  return useStore(
    useShallow((state) => ({
      selectedProject: state.selectedProject,
      selectedCategory: state.selectedCategory,
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
 * Hook ligero para verificar si hay filtros activos
 * @example
 * const hasFilters = useHasActiveFilters();
 * {hasFilters && <ClearFiltersButton />}
 */
export function useHasActiveFilters(): boolean {
  return useStore((state) => state.hasActiveFilters);
}

/**
 * Hook para el conteo de filtros activos
 * @example
 * const count = useActiveFiltersCount();
 * {count > 0 && <Badge>{count}</Badge>}
 */
export function useActiveFiltersCount(): number {
  return useStore((state) => state.activeFiltersCount);
}

/**
 * Hook individual para proyecto seleccionado
 * Útil para componentes que solo necesitan este valor
 */
export function useSelectedProject(): TaskProject | "all" {
  return useStore((state) => state.selectedProject);
}

/**
 * Hook individual para categoría seleccionada
 */
export function useSelectedCategory(): TaskCategory | "all" {
  return useStore((state) => state.selectedCategory);
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
 * const { viewMode, isTransitioning, viewModeLabel } = useViewModeState();
 */
export function useViewModeState() {
  return useStore(
    useShallow((state) => ({
      viewMode: state.viewMode,
      isTransitioning: state.isTransitioning,
      isKanbanView: state.isKanbanView,
      isTerminalView: state.isTerminalView,
      viewModeLabel: state.viewModeLabel,
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
      isKanbanView: state.isKanbanView,
      isTerminalView: state.isTerminalView,
      viewModeLabel: state.viewModeLabel,
    })),
  );
}

/**
 * Hook ligero para solo leer el modo de vista actual
 */
export function useViewModeOnly(): TaskViewMode {
  return useStore((state) => state.viewMode);
}

/**
 * Hook para verificar si está en modo kanban
 * @example
 * const isKanban = useIsKanbanView();
 */
export function useIsKanbanView(): boolean {
  return useStore((state) => state.isKanbanView);
}

/**
 * Hook para verificar si es vista tipo terminal
 */
export function useIsTerminalView(): boolean {
  return useStore((state) => state.isTerminalView);
}

/**
 * Hook para el label del modo de vista
 */
export function useViewModeLabel(): string {
  return useStore((state) => state.viewModeLabel);
}

// ============================================================================
// Hydration Hook
// ============================================================================

/**
 * Hook para verificar si el store ha sido hidratado
 * Útil para evitar hydration mismatch en SSR
 * @example
 * const hasHydrated = useHasHydrated();
 * if (!hasHydrated) return <Skeleton />;
 */
export function useHasHydrated(): boolean {
  return useStore((state) => state._hasHydrated ?? true);
}
