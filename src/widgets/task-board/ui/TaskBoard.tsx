"use client";

import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { transitions } from "@/shared/lib/animations";
import { AlertCircle, Plus, LayoutList, GitBranch } from "lucide-react";
import {
  useThemeState,
  useViewModeState,
  useViewModeActions,
  useTaskFiltersState,
} from "@/store/hooks";
import { useActiveTasks, useTaskSettings, useFilteredTasks } from "@/entities/task";
import { useTaskBoardState } from "../hooks/useTaskBoardState";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { PipelineView } from "./views/PipelineView";
import { KanbanView } from "./views/KanbanView";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskCreateModal } from "./TaskCreateModal";

const FocusMode = React.lazy(() =>
  import("./FocusMode").then((mod) => ({ default: mod.FocusMode })),
);

const VIEW_MODES = [
  { id: "pipeline" as const, label: "Pipeline", icon: GitBranch },
  { id: "kanban" as const, label: "Kanban", icon: LayoutList },
];

export function TaskBoard() {
  const { themeClasses } = useThemeState();
  const { viewMode, isTransitioning } = useViewModeState();
  const { setViewMode } = useViewModeActions();
  const { selectedProjectId, selectedCategoryId } = useTaskFiltersState();
  const { data: allTasks = [] } = useActiveTasks();
  const { data: settings } = useTaskSettings();
  const maxTasks = settings?.maxActiveTasks ?? 5;

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
  const filteredCount = tasks.length;
  const totalCount = allTasks.length;

  const commonProps = useMemo(
    () => ({
      tasks,
      onToggle: handleToggle,
      onDelete: handleDelete,
      onSetCurrent: handleSetCurrent,
      classes: themeClasses,
    }),
    [tasks, handleToggle, handleDelete, handleSetCurrent, themeClasses],
  );

  const handleCloseDetailModal = useCallback(
    () => setIsDetailModalOpen(false),
    [setIsDetailModalOpen],
  );

  const handleEnterFocusFromDetail = useCallback(
    () => {
      if (selectedTask) {
        handleEnterFocus(selectedTask);
      }
    },
    [selectedTask, handleEnterFocus],
  );

  const handleCloseFocusMode = useCallback(
    () => setIsFocusModeOpen(false),
    [setIsFocusModeOpen],
  );

  const handleToggleFocusTask = useCallback(
    () => {
      if (focusTask) {
        handleToggle(focusTask.id);
      }
    },
    [focusTask, handleToggle],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <motion.span 
            className={cn("text-3xl font-bold", themeClasses.textPrimary)}
            key={filteredCount}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={transitions.spring}
          >
            {filteredCount}
          </motion.span>
          {filteredCount !== totalCount && (
            <span className="text-sm text-muted-foreground">
              / {totalCount}
            </span>
          )}
          <span className="text-sm text-muted-foreground ml-2">
            {filteredCount === 1 ? "nota" : "notas"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as "pipeline" | "kanban");
            }}
            disabled={isTransitioning}
            className="bg-muted p-1 rounded-lg"
          >
            {VIEW_MODES.map((mode) => (
              <ToggleGroupItem
                key={mode.id}
                value={mode.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:text-foreground transition-colors duration-200"
              >
                <mode.icon className="size-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {!canAddTask && (
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10"
            >
              <AlertCircle className="size-3.5" />
              <span className="text-xs font-medium">Limite</span>
            </Badge>
          )}
          {canAddTask && remainingSlots <= 2 && (
            <motion.div 
              className="px-3 py-1.5 rounded-lg border border-border bg-muted text-muted-foreground"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={transitions.spring}
            >
              <span className="text-xs font-medium">
                {remainingSlots} restantes
              </span>
            </motion.div>
          )}
        </div>
      </div>

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
              onSelectTask={handleSelectTask}
              onEnterFocus={handleEnterFocus}
              onCreateTask={handleOpenCreateModal}
              canAddTask={canAddTask}
            />
          ) : (
            <KanbanView
              {...commonProps}
              onSelectTask={handleSelectTask}
              onEnterFocus={handleEnterFocus}
              onCreateTask={handleOpenCreateModal}
              canAddTask={canAddTask}
              totalCount={totalCount}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* FAB for mobile - Kanban only */}
      {viewMode === "kanban" && canAddTask && (
        <motion.div 
          className="fixed bottom-6 right-6 md:hidden"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, ...transitions.springBouncy }}
        >
          <Button
            size="default"
            onClick={handleOpenCreateModal}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-full size-12"
          >
            <Plus className="size-5" />
          </Button>
        </motion.div>
      )}

      {/* ARQUITECTURA: AnimatePresence coordina el ciclo de vida del modal */}
      {/* Evita parpadeo al sincronizar entrada/salida del Dialog */}
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
        defaultProjectId={
          selectedProjectId !== "all" ? selectedProjectId : undefined
        }
        defaultCategoryId={
          selectedCategoryId !== "all" ? selectedCategoryId : undefined
        }
      />

      <React.Suspense fallback={null}>
        <FocusMode
          task={focusTask || selectedTask || tasks[0]}
          isOpen={isFocusModeOpen}
          onClose={handleCloseFocusMode}
          onComplete={handleCloseFocusMode}
          onToggleTask={handleToggleFocusTask}
        />
      </React.Suspense>
    </div>
  );
}
