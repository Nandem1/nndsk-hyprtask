"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { Task } from "@/entities/task";
import type { useThemeState } from "@/store/hooks";
import { KanbanView } from "./views/KanbanView";

interface KanbanViewWrapperProps {
  viewMode: string;
  tasks: Task[];
  allTasks: Task[];
  filteredCount: number;
  totalCount: number;
  canAddTask: boolean;
  remainingSlots: number;
  maxTasks: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  onSelectTask: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
  onCreateTask: () => void;
  themeClasses: ReturnType<typeof useThemeState>["themeClasses"];
}

export function KanbanViewWrapper({
  tasks,
  filteredCount,
  totalCount,
  canAddTask,
  onToggle,
  onDelete,
  onSetCurrent,
  onSelectTask,
  onEnterFocus,
  onCreateTask,
  themeClasses,
}: KanbanViewWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  const viewProps = {
    tasks,
    onToggle,
    onDelete,
    onSetCurrent,
    classes: themeClasses,
    totalCount,
    filteredCount,
    onSelectTask,
    onEnterFocus,
    onCreateTask,
    canAddTask,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="kanban"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
      >
        <KanbanView {...viewProps} />
      </motion.div>
    </AnimatePresence>
  );
}
