import { type RefObject } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { Task } from "@/entities/task";
import { useUpdateTaskPriority } from "@/entities/task";
import { SHORTCUTS } from "@/shared/lib/keyboard-shortcuts";
import type { NotesSectionHandle } from "../ui/NotesSection";

const PRIORITY_CYCLE: Task["priority"][] = ["low", "medium", "high"];

interface UseDetailModalShortcutsOptions {
  task: Task;
  isOpen: boolean;
  notesRef: RefObject<NotesSectionHandle | null>;
}

export function useDetailModalShortcuts({
  task,
  isOpen,
  notesRef,
}: UseDetailModalShortcutsOptions) {
  const updatePriority = useUpdateTaskPriority();

  // e → start editing notes (only when not already editing)
  useHotkeys(
    SHORTCUTS.DETAIL_EDIT_NOTES.hotkeyString,
    () => {
      if (notesRef.current && !notesRef.current.isEditing()) {
        notesRef.current.startEdit();
      }
    },
    { enabled: isOpen },
    [isOpen, notesRef],
  );

  // Ctrl+Enter → save notes (only when editing)
  useHotkeys(
    SHORTCUTS.DETAIL_SAVE_NOTES.hotkeyString,
    (e) => {
      e.preventDefault();
      if (notesRef.current?.isEditing()) {
        notesRef.current.save();
      }
    },
    { enabled: isOpen, enableOnFormTags: ["TEXTAREA"] },
    [isOpen, notesRef],
  );

  // p → cycle priority
  useHotkeys(
    SHORTCUTS.DETAIL_CYCLE_PRIORITY.hotkeyString,
    () => {
      if (notesRef.current?.isEditing()) return; // don't cycle while typing
      const idx = PRIORITY_CYCLE.indexOf(task.priority);
      const next = PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length];
      updatePriority.mutate({ id: task.id, priority: next });
    },
    { enabled: isOpen },
    [isOpen, task.id, task.priority],
  );
}
