import { useStore } from "./index";
import { useShallow } from "zustand/react/shallow";

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

export function useEmotePrefs() {
  return useStore(
    useShallow((state) => ({
      animatedEmotes: state.animatedEmotes,
      setAnimatedEmotes: state.setAnimatedEmotes,
    })),
  );
}

export function useKeyboardSelectionState() {
  return useStore(
    useShallow((state) => ({
      keyboardSelectedId: state.keyboardSelectedId,
    })),
  );
}

export function useKeyboardSelectionActions() {
  return useStore(
    useShallow((state) => ({
      setKeyboardSelectedId: state.setKeyboardSelectedId,
      clearKeyboardSelection: state.clearKeyboardSelection,
    })),
  );
}
