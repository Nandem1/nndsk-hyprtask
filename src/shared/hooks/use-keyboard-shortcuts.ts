import { useHotkeys } from "react-hotkeys-hook";
import { useCallback } from "react";
import { useViewModeActions } from "@/store/hooks";
import { useActiveTasks, useToggleTask } from "@/entities/task";

// ============================================================================
// Keyboard Shortcuts Hook
// ============================================================================

export function useTaskKeyboardShortcuts() {
  const { setViewMode } = useViewModeActions();
  const { data: tasks = [] } = useActiveTasks();
  const toggleTaskMutation = useToggleTask();

  // Find current task
  const currentTask = tasks.find((t) => t.isCurrent && !t.isCompleted);

  // Toggle current task completion
  const toggleCurrentTask = useCallback(() => {
    if (currentTask) {
      toggleTaskMutation.mutate(currentTask.id);
    }
  }, [currentTask, toggleTaskMutation]);

  // Switch to Kanban view
  useHotkeys(
    "ctrl+k, cmd+k",
    (e) => {
      e.preventDefault();
      setViewMode("kanban");
    },
    { preventDefault: true },
    [setViewMode]
  );

  // Switch to Pipeline view
  useHotkeys(
    "ctrl+p, cmd+p",
    (e) => {
      e.preventDefault();
      setViewMode("pipeline");
    },
    { preventDefault: true },
    [setViewMode]
  );

  // Create new task
  useHotkeys(
    "ctrl+n, cmd+n",
    (e) => {
      e.preventDefault();
      // This would open the new task form
      // The actual implementation depends on how the form is triggered
      const event = new CustomEvent("hyprtask:new-task");
      window.dispatchEvent(event);
    },
    { preventDefault: true }
  );

  // Focus mode for current task - Changed to Ctrl+Shift+F to avoid conflict with browser Find
  useHotkeys(
    "ctrl+shift+f, cmd+shift+f",
    (e) => {
      e.preventDefault();
      if (currentTask) {
        const event = new CustomEvent("hyprtask:focus-mode", {
          detail: { taskId: currentTask.id },
        });
        window.dispatchEvent(event);
      }
    },
    { preventDefault: true },
    [currentTask]
  );

  // Close all modals
  useHotkeys(
    "esc",
    () => {
      const event = new CustomEvent("hyprtask:close-modals");
      window.dispatchEvent(event);
    },
    []
  );

  // Toggle current task
  useHotkeys(
    "space",
    (e) => {
      // Only trigger if not in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      toggleCurrentTask();
    },
    { preventDefault: true },
    [toggleCurrentTask]
  );

  // Navigate to next task
  useHotkeys(
    "j, arrowdown",
    (e) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      const event = new CustomEvent("hyprtask:navigate-next");
      window.dispatchEvent(event);
    },
    { preventDefault: true }
  );

  // Navigate to previous task
  useHotkeys(
    "k, arrowup",
    (e) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      e.preventDefault();
      const event = new CustomEvent("hyprtask:navigate-prev");
      window.dispatchEvent(event);
    },
    { preventDefault: true }
  );

  return {
    shortcutsEnabled: true,
    currentTaskId: currentTask?.id,
  };
}

// ============================================================================
// Hook to listen for keyboard events
// ============================================================================

export function useKeyboardEvent(
  eventName: string,
  callback: (detail?: unknown) => void
) {
  useHotkeys(
    "",
    () => {},
    {},
    []
  );

  // This is a placeholder - actual implementation would use useEffect
  // with addEventListener for CustomEvents
}
