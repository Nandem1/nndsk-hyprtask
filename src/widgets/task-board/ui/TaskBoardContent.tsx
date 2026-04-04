"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/entities/task";
import type { ExtendedThemeClasses } from "@/shared/types/theme";
import { PipelineView } from "./views/PipelineView";
import { KanbanView } from "./views/KanbanView";

interface TaskBoardContentProps {
  viewMode: "pipeline" | "kanban";
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onSetCurrent: (id: string) => void;
  classes: ExtendedThemeClasses;
  onSelectTask: (task: Task) => void;
  onEnterFocus: (task: Task) => void;
  onCreateTask: () => void;
  canAddTask: boolean;
  totalCount: number;
}

export function TaskBoardContent({
  viewMode,
  tasks,
  onToggle,
  onDelete,
  onSetCurrent,
  classes,
  onSelectTask,
  onEnterFocus,
  onCreateTask,
  canAddTask,
  totalCount,
}: TaskBoardContentProps) {
  const commonProps = { tasks, onToggle, onDelete, onSetCurrent, classes };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {viewMode === "pipeline" ? (
          <PipelineView
            {...commonProps}
            onSelectTask={onSelectTask}
            onEnterFocus={onEnterFocus}
            onCreateTask={onCreateTask}
            canAddTask={canAddTask}
          />
        ) : (
          <KanbanView
            {...commonProps}
            onSelectTask={onSelectTask}
            onEnterFocus={onEnterFocus}
            onCreateTask={onCreateTask}
            canAddTask={canAddTask}
            totalCount={totalCount}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
