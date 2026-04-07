import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { Task } from "@/entities/task";
import { useActiveProjects } from "@/entities/project";
import { SHORTCUTS } from "@/shared/lib/keyboard-shortcuts";
import type { ThemePalette } from "@/shared/types/theme";
import { useKeyboardNavigation } from "./use-keyboard-navigation";
import {
  useViewModeActions,
  useViewModeState,
  useTaskFiltersActions,
  useTaskFiltersState,
  useColacionActions,
  useTheme,
  useUIPreferencesActions,
} from "@/store/hooks";

const PALETTE_ORDER: ThemePalette[] = ["genshin", "zenless", "wuthering", "osu", "mario"];

export interface TaskKeyboardActions {
  onOpenCreateModal: () => void;
  onSelectTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onEnterFocus: (task: Task) => void;
}

export interface ModalOpenState {
  isDetailOpen: boolean;
  isCreateOpen: boolean;
  isFocusOpen: boolean;
  isColacionOpen: boolean;
}

interface UseKeyboardShortcutsOptions {
  tasks: Task[];
  actions: TaskKeyboardActions;
  modals: ModalOpenState;
}

export function useKeyboardShortcuts({
  tasks,
  actions,
  modals,
}: UseKeyboardShortcutsOptions) {
  const { setViewMode } = useViewModeActions();
  const { viewMode } = useViewModeState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  const { selectedProjectId } = useTaskFiltersState();
  const { openColacion, closeColacion } = useColacionActions();
  const { palette, changePalette } = useTheme();
  const { data: projects = [] } = useActiveProjects();
  const { toggleSidebar } = useUIPreferencesActions();

  const navigation = useKeyboardNavigation(tasks);
  const { clearKeyboardSelection, hasSelection } = navigation;

  const anyCoreModalOpen =
    modals.isDetailOpen ||
    modals.isCreateOpen ||
    modals.isFocusOpen ||
    modals.isColacionOpen;
  const isModalOpen = anyCoreModalOpen;

  useEffect(() => {
    if (anyCoreModalOpen) clearKeyboardSelection();
  }, [anyCoreModalOpen, clearKeyboardSelection]);

  const navRef = useRef(navigation);
  useEffect(() => { navRef.current = navigation; });

  // Stable refs for callbacks that change every render
  const stateRef = useRef({ viewMode, selectedProjectId, palette, projects });
  useEffect(() => {
    stateRef.current = { viewMode, selectedProjectId, palette, projects };
  });

  const cb = useRef({
    ...actions,
    setViewMode,
    setSelectedProject,
    setSelectedCategory,
    openColacion,
    closeColacion,
    changePalette,
    toggleSidebar,
  });
  useEffect(() => {
    cb.current = {
      ...actions,
      setViewMode,
      setSelectedProject,
      setSelectedCategory,
      openColacion,
      closeColacion,
      changePalette,
      toggleSidebar,
    };
  });

  // ── Navegacion ────────────────────────────────────────────────
  useHotkeys(
    SHORTCUTS.NAVIGATE_DOWN.hotkeyString,
    (e) => {
      e.preventDefault();
      const { getSelectedIndex, selectIndex } = navRef.current;
      const idx = getSelectedIndex();
      selectIndex(idx === -1 ? 0 : idx + 1);
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.NAVIGATE_UP.hotkeyString,
    (e) => {
      e.preventDefault();
      const { getSelectedIndex, selectIndex } = navRef.current;
      const idx = getSelectedIndex();
      if (idx === -1) return;
      selectIndex(idx - 1);
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.OPEN_DETAIL.hotkeyString,
    (e) => {
      e.preventDefault();
      const task = navRef.current.getSelectedTask();
      if (task) cb.current.onSelectTask(task);
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  useHotkeys(
    SHORTCUTS.CLOSE.hotkeyString,
    () => {
      navRef.current.clearKeyboardSelection();
    },
    { enabled: !anyCoreModalOpen },
    [],
  );

  // ── Tareas ────────────────────────────────────────────────────
  useHotkeys(
    SHORTCUTS.NEW_TASK.hotkeyString,
    () => cb.current.onOpenCreateModal(),
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.ALIAS_NEW_TASK.hotkeyString,
    () => cb.current.onOpenCreateModal(),
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.FOCUS_MODE.hotkeyString,
    () => {
      const task = navRef.current.getSelectedTask();
      if (task) cb.current.onEnterFocus(task);
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  useHotkeys(
    SHORTCUTS.TOGGLE_COMPLETE.hotkeyString,
    (e) => {
      e.preventDefault();
      navRef.current.withSelectedId(cb.current.onToggleTask);
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  useHotkeys(
    SHORTCUTS.DELETE_TASK.hotkeyString,
    () => {
      navRef.current.withSelectedId((id) => {
        cb.current.onDeleteTask(id);
        navRef.current.clearKeyboardSelection();
      });
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  useHotkeys(
    SHORTCUTS.SET_CURRENT.hotkeyString,
    () => {
      navRef.current.withSelectedId(cb.current.onSetCurrent);
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  // ── Vistas ────────────────────────────────────────────────────
  useHotkeys(
    SHORTCUTS.VIEW_PIPELINE.hotkeyString,
    () => cb.current.setViewMode("pipeline"),
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.VIEW_KANBAN.hotkeyString,
    () => cb.current.setViewMode("kanban"),
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.CYCLE_VIEW.hotkeyString,
    () => {
      const next = stateRef.current.viewMode === "pipeline" ? "kanban" : "pipeline";
      cb.current.setViewMode(next);
    },
    { enabled: !isModalOpen },
    [],
  );

  // ── Interfaz ──────────────────────────────────────────────────
  useHotkeys(
    SHORTCUTS.OPEN_COLACION.hotkeyString,
    () => {
      if (modals.isColacionOpen) {
        cb.current.closeColacion();
      } else {
        cb.current.openColacion();
      }
    },
    { enabled: !modals.isDetailOpen && !modals.isCreateOpen && !modals.isFocusOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.CYCLE_THEME.hotkeyString,
    () => {
      const idx = PALETTE_ORDER.indexOf(stateRef.current.palette);
      const next = PALETTE_ORDER[(idx + 1) % PALETTE_ORDER.length];
      cb.current.changePalette(next);
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.TOGGLE_SIDEBAR.hotkeyString,
    () => cb.current.toggleSidebar(),
    { enabled: !isModalOpen },
    [],
  );

  // ── General ───────────────────────────────────────────────────
  useHotkeys(
    SHORTCUTS.CLEAR_FILTERS.hotkeyString,
    () => {
      cb.current.setSelectedProject("all");
      cb.current.setSelectedCategory("all");
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.FILTER_PREV.hotkeyString,
    () => {
      const { selectedProjectId: current, projects: ps } = stateRef.current;
      if (!ps.length) return;
      const ids = ["all", ...ps.map((p) => p.id)];
      const idx = ids.indexOf(current);
      const prev = ids[(idx - 1 + ids.length) % ids.length];
      cb.current.setSelectedProject(prev);
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.FILTER_NEXT.hotkeyString,
    () => {
      const { selectedProjectId: current, projects: ps } = stateRef.current;
      if (!ps.length) return;
      const ids = ["all", ...ps.map((p) => p.id)];
      const idx = ids.indexOf(current);
      const next = ids[(idx + 1) % ids.length];
      cb.current.setSelectedProject(next);
    },
    { enabled: !isModalOpen },
    [],
  );
}
