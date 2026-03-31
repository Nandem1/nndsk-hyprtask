"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/entities/task";
import type { useThemeState } from "@/store/hooks";
import { useTaskFiltersState } from "@/store/hooks";
import { KanbanView } from "./views/KanbanView";

interface TaskListViewProps {
  viewMode: string;
  tasks: Task[];
  allTasks: Task[];
  filteredCount: number;
  totalCount: number;
  canAddTask: boolean;
  remainingSlots: number;
  showForm: boolean;
  maxTasks: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onTaskAdded: () => void;
  onCancelForm: () => void;
  onShowForm: () => void;
  themeClasses: ReturnType<typeof useThemeState>["themeClasses"];
}

export function KanbanViewWrapper({
  tasks,
  allTasks,
  filteredCount,
  totalCount,
  canAddTask,
  showForm,
  maxTasks,
  onToggle,
  onDelete,
  onSetCurrent,
  onTaskAdded,
  onCancelForm,
  onShowForm,
  themeClasses,
}: TaskListViewProps) {
  const { selectedProjectId, selectedCategoryId } = useTaskFiltersState();

  const commonProps = {
    tasks,
    onToggle,
    onDelete,
    onSetCurrent,
    classes: themeClasses,
  };

  const formProps = {
    onTaskAdded,
    onCancel: onCancelForm,
    maxTasks,
    currentTasks: allTasks.length,
    defaultProjectId:
      selectedProjectId !== "all" ? selectedProjectId : undefined,
    defaultCategoryId:
      selectedCategoryId !== "all" ? selectedCategoryId : undefined,
  };

  const viewProps = {
    ...commonProps,
    showForm,
    canAddTask,
    onShowForm,
    formProps,
    totalCount,
    filteredCount,
  } as const;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="kanban"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <KanbanView {...viewProps} />
      </motion.div>
    </AnimatePresence>
  );
}
