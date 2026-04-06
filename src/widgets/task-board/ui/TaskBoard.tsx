"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  useTheme,
  useViewModeState,
  useViewModeActions,
  useTaskFiltersState,
  useColacionState,
  useColacionActions,
} from "@/store/hooks";
import { useActiveTasks, useTaskSettings, useFilteredTasks } from "@/entities/task";
import { useTaskBoardState } from "../hooks/useTaskBoardState";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskCreateModal } from "./TaskCreateModal";
import { TaskBoardHeader } from "./TaskBoardHeader";
import { TaskBoardFAB } from "./TaskBoardFAB";
import { TaskBoardContent } from "./TaskBoardContent";
import { KeyboardShortcutsDialog } from "./KeyboardShortcutsDialog";

const FocusMode = React.lazy(() =>
  import("./FocusMode").then((mod) => ({ default: mod.FocusMode })),
);

const ColacionMode = React.lazy(() =>
  import("./ColacionMode").then((mod) => ({ default: mod.ColacionMode })),
);

export function TaskBoard() {
  const { themeClasses } = useTheme();
  const { viewMode } = useViewModeState();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { setViewMode } = useViewModeActions();
  const { selectedProjectId, selectedCategoryId } = useTaskFiltersState();
  const { isColacionOpen } = useColacionState();
  const { closeColacion } = useColacionActions();
  const { data: allTasks = [] } = useActiveTasks();
  const { data: settings } = useTaskSettings();
  const maxTasks = settings?.maxActiveTasks ?? 5;

  useEffect(() => {
    setIsTransitioning(true);
    const t = setTimeout(() => setIsTransitioning(false), 250);
    return () => clearTimeout(t);
  }, [viewMode]);

  const {
    selectedTask,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    focusTask,
    isFocusModeOpen,
    setIsFocusModeOpen,
    handleToggle,
    handleDelete,
    handleSetCurrent,
    handleSelectTask,
    handleEnterFocus,
    handleNavigateToTask,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleTaskCreated,
  } = useTaskBoardState();

  const tasks = useFilteredTasks(allTasks, selectedProjectId, selectedCategoryId);

  const canAddTask = allTasks.length < maxTasks;
  const remainingSlots = maxTasks - allTasks.length;

  const { isShortcutsDialogOpen, setIsShortcutsDialogOpen } = useKeyboardShortcuts({
    tasks,
    actions: {
      onOpenCreateModal: handleOpenCreateModal,
      onSelectTask: handleSelectTask,
      onToggleTask: handleToggle,
      onDeleteTask: handleDelete,
      onSetCurrent: handleSetCurrent,
      onEnterFocus: handleEnterFocus,
    },
    modals: {
      isDetailOpen: isDetailModalOpen,
      isCreateOpen: isCreateModalOpen,
      isFocusOpen: isFocusModeOpen,
    },
  });

  const handleCloseDetailModal = useCallback(() => setIsDetailModalOpen(false), [setIsDetailModalOpen]);
  const handleCloseFocusMode = useCallback(() => setIsFocusModeOpen(false), [setIsFocusModeOpen]);

  const handleEnterFocusFromDetail = useCallback(() => {
    if (selectedTask) handleEnterFocus(selectedTask);
  }, [selectedTask, handleEnterFocus]);

  const handleToggleFocusTask = useCallback(() => {
    if (focusTask) handleToggle(focusTask.id);
  }, [focusTask, handleToggle]);

  return (
    <div className="flex flex-col gap-4">
      <TaskBoardHeader
        filteredCount={tasks.length}
        totalCount={allTasks.length}
        viewMode={viewMode}
        isTransitioning={isTransitioning}
        onViewModeChange={setViewMode}
        canAddTask={canAddTask}
        remainingSlots={remainingSlots}
        themeClasses={themeClasses}
      />

      <TaskBoardContent
        viewMode={viewMode}
        tasks={tasks}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSetCurrent={handleSetCurrent}
        classes={themeClasses}
        onSelectTask={handleSelectTask}
        onEnterFocus={handleEnterFocus}
        onCreateTask={handleOpenCreateModal}
        canAddTask={canAddTask}
        totalCount={allTasks.length}
      />

      <TaskBoardFAB
        show={viewMode === "kanban" && canAddTask}
        onClick={handleOpenCreateModal}
      />

      <AnimatePresence mode="wait">
        {isDetailModalOpen && selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            isOpen={isDetailModalOpen}
            onClose={handleCloseDetailModal}
            onToggle={handleToggle}
            onSetCurrent={handleSetCurrent}
            onDelete={handleDelete}
            onEnterFocus={handleEnterFocusFromDetail}
            onNavigateToTask={handleNavigateToTask}
          />
        )}
      </AnimatePresence>

      <TaskCreateModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onTaskCreated={handleTaskCreated}
        maxTasks={maxTasks}
        currentTasks={allTasks.length}
        defaultProjectId={selectedProjectId !== "all" ? selectedProjectId : undefined}
        defaultCategoryId={selectedCategoryId !== "all" ? selectedCategoryId : undefined}
      />

      {(focusTask || selectedTask || tasks[0]) && (
        <React.Suspense fallback={null}>
          <FocusMode
            task={focusTask || selectedTask || tasks[0]}
            isOpen={isFocusModeOpen}
            onClose={handleCloseFocusMode}
            onComplete={handleCloseFocusMode}
            onToggleTask={handleToggleFocusTask}
          />
        </React.Suspense>
      )}

      <React.Suspense fallback={null}>
        <ColacionMode isOpen={isColacionOpen} onClose={closeColacion} />
      </React.Suspense>

      <KeyboardShortcutsDialog
        isOpen={isShortcutsDialogOpen}
        onClose={() => setIsShortcutsDialogOpen(false)}
      />
    </div>
  );
}
