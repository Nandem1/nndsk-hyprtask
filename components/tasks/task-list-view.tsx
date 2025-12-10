'use client';

import { AnimatePresence } from 'framer-motion';
import type { Task, TaskProject, TaskCategory } from '@/types/task';
import type { TaskViewMode } from '@/types/view-mode';
import { TaskForm } from './task-form';
import { TerminalView } from './views/terminal-view';
import { StickyView } from './views/sticky-view';
import { TimelineView } from './views/timeline-view';
import { KanbanView } from './views/kanban-view';
import { CodeNotesView } from './views/code-notes-view';
import { PostItsView } from './views/post-its-view';
import { MinimalView } from './views/minimal-view';
import { TerminalOutView } from './views/terminal-out-view';
import type { useThemeContext } from '@/components/theme-provider-context';

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
  selectedProject: TaskProject | 'all';
  selectedCategory: TaskCategory | 'all';
  classes: ReturnType<typeof useThemeContext>['classes'];
}

export function TaskListView({
  viewMode,
  tasks,
  allTasks,
  filteredCount,
  totalCount,
  canAddTask,
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
  classes,
}: TaskListViewProps) {
  const commonProps = {
    tasks,
    onToggle,
    onDelete,
    onSetCurrent,
    classes,
  };

  const formProps = {
    onTaskAdded,
    onCancel: onCancelForm,
    maxTasks,
    currentTasks: allTasks.length,
    defaultProject: selectedProject !== 'all' ? selectedProject : undefined,
    defaultCategory: selectedCategory !== 'all' ? selectedCategory : undefined,
  };

  // Renderizar según viewMode
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
    case 'terminal':
      return <TerminalView {...viewProps} />;
    case 'sticky':
      return <StickyView {...viewProps} />;
    case 'timeline':
      return <TimelineView {...viewProps} />;
    case 'kanban':
      return <KanbanView {...viewProps} />;
    case 'code-notes':
      return <CodeNotesView {...viewProps} />;
    case 'post-its':
      return <PostItsView {...viewProps} />;
    case 'minimal':
      return <MinimalView {...viewProps} />;
    case 'terminal-out':
      return <TerminalOutView {...viewProps} />;
    default:
      return <TerminalView {...viewProps} />;
  }
}
