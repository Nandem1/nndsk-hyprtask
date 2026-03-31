"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task } from "@/entities/task";
import type { TaskViewMode } from "@/entities/task";
import type { useThemeState } from "@/store/hooks";
import { useTaskFiltersState } from "@/store/hooks";
import { Skeleton } from "@/shared/ui/skeleton";

// Importar vistas livianas de forma estática
import { KanbanView } from "./views/KanbanView";
import { MinimalView } from "./views/MinimalView";
import { TimelineView } from "./views/TimelineView";

// Importar vistas pesadas de forma dinámica
const TerminalView = dynamic(
  () =>
    import("./views/TerminalView").then((m) => ({ default: m.TerminalView })),
  {
    loading: () => <ViewSkeleton />,
    ssr: false,
  },
);

const TerminalOutView = dynamic(
  () =>
    import("./views/TerminalOutView").then((m) => ({
      default: m.TerminalOutView,
    })),
  {
    loading: () => <ViewSkeleton />,
    ssr: false,
  },
);

const CodeNotesView = dynamic(
  () =>
    import("./views/CodeNotesView").then((m) => ({ default: m.CodeNotesView })),
  {
    loading: () => <ViewSkeleton />,
    ssr: false,
  },
);

const StickyView = dynamic(
  () => import("./views/StickyView").then((m) => ({ default: m.StickyView })),
  {
    loading: () => <ViewSkeleton />,
  },
);

const PostItsView = dynamic(
  () => import("./views/PostItsView").then((m) => ({ default: m.PostItsView })),
  {
    loading: () => <ViewSkeleton />,
  },
);

// Skeleton para carga de vistas
function ViewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}

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
  themeClasses: ReturnType<typeof useThemeState>["themeClasses"];
}

export function TaskListView({
  viewMode,
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
  const { selectedProject, selectedCategory } = useTaskFiltersState();

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

  const renderView = () => {
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
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Suspense fallback={<ViewSkeleton />}>{renderView()}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
}
