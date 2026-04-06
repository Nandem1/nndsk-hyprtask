import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { Task } from "@/entities/task";
import { SHORTCUTS } from "@/shared/lib/keyboard-shortcuts";
import { useKeyboardNavigation } from "./use-keyboard-navigation";
import { useViewModeActions, useTaskFiltersActions } from "@/store/hooks";

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
  const [isShortcutsDialogOpen, setIsShortcutsDialogOpen] = useState(false);
  const { setViewMode } = useViewModeActions();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();

  const navigation = useKeyboardNavigation(tasks);
  const { clearKeyboardSelection, hasSelection } = navigation;

  const anyCoreModalOpen = modals.isDetailOpen || modals.isCreateOpen || modals.isFocusOpen;
  const isModalOpen = anyCoreModalOpen || isShortcutsDialogOpen;

  useEffect(() => {
    if (anyCoreModalOpen) clearKeyboardSelection();
  }, [anyCoreModalOpen, clearKeyboardSelection]);

  const navRef = useRef(navigation);
  useEffect(() => { navRef.current = navigation; });

  const isDialogOpenRef = useRef(isShortcutsDialogOpen);
  useEffect(() => { isDialogOpenRef.current = isShortcutsDialogOpen; });

  const cb = useRef({ ...actions, setViewMode, setSelectedProject, setSelectedCategory });
  useEffect(() => {
    cb.current = { ...actions, setViewMode, setSelectedProject, setSelectedCategory };
  });

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
    () => {
      const task = navRef.current.getSelectedTask();
      if (task) cb.current.onSelectTask(task);
    },
    { enabled: !isModalOpen && hasSelection },
    [],
  );

  useHotkeys(
    SHORTCUTS.NEW_TASK.hotkeyString,
    () => {
      cb.current.onOpenCreateModal();
    },
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
    SHORTCUTS.CLEAR_FILTERS.hotkeyString,
    () => {
      cb.current.setSelectedProject("all");
      cb.current.setSelectedCategory("all");
    },
    { enabled: !isModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.HELP.hotkeyString,
    () => {
      setIsShortcutsDialogOpen((p) => !p);
    },
    { enabled: !anyCoreModalOpen },
    [],
  );

  useHotkeys(
    SHORTCUTS.CLOSE.hotkeyString,
    () => {
      if (isDialogOpenRef.current) {
        setIsShortcutsDialogOpen(false);
      } else {
        navRef.current.clearKeyboardSelection();
      }
    },
    { enabled: !anyCoreModalOpen },
    [],
  );

  return { isShortcutsDialogOpen, setIsShortcutsDialogOpen };
}
