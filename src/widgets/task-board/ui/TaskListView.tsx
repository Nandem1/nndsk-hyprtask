"use client";

// AnimatePresence available for future animations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AnimatePresence } from "framer-motion";
import type { Task, TaskProject, TaskCategory } from "@/entities/task";
import type { TaskViewMode } from "@/entities/task";
import type { useTheme } from "@/store/hooks";
// TaskForm imported for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TaskForm } from "@/entities/task";
import { TerminalView } from "./views/TerminalView";
import { StickyView } from "./views/StickyView";
import { TimelineView } from "./views/TimelineView";
import { KanbanView } from "./views/KanbanView";
import { CodeNotesView } from "./views/CodeNotesView";
import { PostItsView } from "./views/PostItsView";
import { MinimalView } from "./views/MinimalView";
import { TerminalOutView } from "./views/TerminalOutView";

interface TaskListViewProps {
  viewMode: TaskViewMode;
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
  selectedProject: TaskProject | "all";
  selectedCategory: TaskCategory | "all";
  themeClasses: ReturnType<typeof useTheme>["themeClasses"];
}

export function TaskListView({
  viewMode,
  tasks,
  allTasks,
  filteredCount,
  totalCount,
  canAddTask,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remainingSlots,
  showForm,
  maxTasks,
  onToggle,
  onDelete,
  onSetCurrent,
  onTaskAdded,
  onCancelForm,
  onShowForm,
  selectedProject,
  selectedCategory,
  themeClasses,
}: TaskListViewProps) {
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
    defaultProject: selectedProject !== "all" ? selectedProject : undefined,
    defaultCategory: selectedCategory !== "all" ? selectedCategory : undefined,
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

  switch (viewMode) {
    case "terminal":
      return <TerminalView {...viewProps} />;
    case "sticky":
      return <StickyView {...viewProps} />;
    case "timeline":
      return <TimelineView {...viewProps} />;
    case "kanban":
      return <KanbanView {...viewProps} />;
    case "code-notes":
      return <CodeNotesView {...viewProps} />;
    case "post-its":
      return <PostItsView {...viewProps} />;
    case "minimal":
      return <MinimalView {...viewProps} />;
    case "terminal-out":
      return <TerminalOutView {...viewProps} />;
    default:
      return <TerminalView {...viewProps} />;
  }
}
