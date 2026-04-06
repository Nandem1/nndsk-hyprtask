import { useCallback, useEffect, useRef } from "react";
import type { Task } from "@/entities/task";
import {
  useKeyboardSelectionState,
  useKeyboardSelectionActions,
} from "@/store/hooks";

export function useKeyboardNavigation(tasks: Task[]) {
  const { keyboardSelectedId } = useKeyboardSelectionState();
  const { setKeyboardSelectedId, clearKeyboardSelection } =
    useKeyboardSelectionActions();

  const tasksRef = useRef(tasks);
  const selectedIdRef = useRef(keyboardSelectedId);

  useEffect(() => {
    tasksRef.current = tasks;
  });
  useEffect(() => {
    selectedIdRef.current = keyboardSelectedId;
  });

  const getSelectedIndex = useCallback(() => {
    const id = selectedIdRef.current;
    if (!id) return -1;
    return tasksRef.current.findIndex((t) => t.id === id);
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      const currentTasks = tasksRef.current;
      if (currentTasks.length === 0) return;
      const clamped = Math.max(0, Math.min(index, currentTasks.length - 1));
      setKeyboardSelectedId(currentTasks[clamped].id);
    },
    [setKeyboardSelectedId],
  );

  const getSelectedTask = useCallback((): Task | null => {
    const id = selectedIdRef.current;
    if (!id) return null;
    return tasksRef.current.find((t) => t.id === id) ?? null;
  }, []);

  const withSelectedId = useCallback(
    (action: (id: string) => void) => {
      const id = selectedIdRef.current;
      if (id) action(id);
    },
    [],
  );

  return {
    keyboardSelectedId,
    getSelectedIndex,
    selectIndex,
    getSelectedTask,
    hasSelection: !!keyboardSelectedId,
    withSelectedId,
    clearKeyboardSelection,
  };
}
