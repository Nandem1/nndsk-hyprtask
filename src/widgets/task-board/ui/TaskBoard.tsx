"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { AlertCircle, Plus, LayoutList, GitBranch } from "lucide-react";
import {
  useThemeState,
  useViewModeState,
  useViewModeActions,
  useTaskFiltersState,
} from "@/store/hooks";
import {
  useActiveTasks,
  useToggleTask,
  useDeleteTask,
  useSetCurrentTask,
  useTaskSettings,
} from "@/entities/task";
import type { Task } from "@/entities/task";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { KanbanViewWrapper } from "./KanbanViewWrapper";
import { PipelineView } from "./views/PipelineView";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskCreateModal } from "./TaskCreateModal";
import { FocusMode } from "./FocusMode";

const VIEW_MODES = [
  { id: "pipeline" as const, label: "Pipeline", icon: GitBranch },
  { id: "kanban" as const, label: "Kanban", icon: LayoutList },
];

export function TaskBoard() {
  const { themeClasses } = useThemeState();
  const { viewMode } = useViewModeState();
  const { setViewMode } = useViewModeActions();
  const { selectedProjectId, selectedCategoryId } = useTaskFiltersState();
  const { data: allTasks = [] } = useActiveTasks();
  const { data: settings } = useTaskSettings();
  const maxTasks = settings?.maxActiveTasks ?? 5;

  // Modal states
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  const tasks = allTasks.filter((task) => {
    if (selectedProjectId !== "all" && task.projectId !== selectedProjectId)
      return false;
    if (selectedCategoryId !== "all" && task.categoryId !== selectedCategoryId)
      return false;
    return true;
  });

  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();
  const setCurrentTaskMutation = useSetCurrentTask();

  const handleToggle = (id: string) => toggleTaskMutation.mutate(id);
  const handleDelete = (id: string) => deleteTaskMutation.mutate(id);
  const handleSetCurrent = (id: string) => setCurrentTaskMutation.mutate(id);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const handleEnterFocus = (task: Task) => {
    setFocusTask(task);
    setIsFocusModeOpen(true);
  };

  const handleNavigateToTask = (task: Task) => {
    setSelectedTask(task);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleTaskCreated = () => {
    setIsCreateModalOpen(false);
  };

  const canAddTask = allTasks.length < maxTasks;
  const remainingSlots = maxTasks - allTasks.length;
  const filteredCount = tasks.length;
  const totalCount = allTasks.length;

  const commonProps = {
    tasks,
    onToggle: handleToggle,
    onDelete: handleDelete,
    onSetCurrent: handleSetCurrent,
    classes: themeClasses,
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", themeClasses.textPrimary)}>
            {filteredCount}
          </span>
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
            className="bg-muted p-1 rounded-lg"
          >
            {VIEW_MODES.map((mode) => (
              <ToggleGroupItem
                key={mode.id}
                value={mode.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm data-[state=on]:text-foreground"
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
            <div className="px-3 py-1.5 rounded-lg border border-border bg-muted text-muted-foreground">
              <span className="text-xs font-medium">
                {remainingSlots} restantes
              </span>
            </div>
          )}
        </div>
      </div>

      {viewMode === "pipeline" ? (
        <PipelineView
          {...commonProps}
          onSelectTask={handleSelectTask}
          onEnterFocus={handleEnterFocus}
          onCreateTask={handleOpenCreateModal}
          canAddTask={canAddTask}
        />
      ) : (
        <KanbanViewWrapper
          viewMode={viewMode}
          tasks={tasks}
          allTasks={allTasks}
          filteredCount={filteredCount}
          totalCount={totalCount}
          canAddTask={canAddTask}
          remainingSlots={remainingSlots}
          maxTasks={maxTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onSetCurrent={handleSetCurrent}
          onCreateTask={handleOpenCreateModal}
          onSelectTask={handleSelectTask}
          onEnterFocus={handleEnterFocus}
          themeClasses={themeClasses}
        />
      )}

      {/* FAB for mobile - Kanban only */}
      {viewMode === "kanban" && canAddTask && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <Button
            size="default"
            onClick={handleOpenCreateModal}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-full size-12"
          >
            <Plus className="size-5" />
          </Button>
        </div>
      )}

      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onToggle={handleToggle}
        onSetCurrent={handleSetCurrent}
        onDelete={handleDelete}
        onEnterFocus={() => {
          if (selectedTask) {
            setFocusTask(selectedTask);
            setIsFocusModeOpen(true);
          }
        }}
        onNavigateToTask={handleNavigateToTask}
      />

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

      <FocusMode
        task={focusTask || selectedTask || tasks[0]}
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        onComplete={() => {
          setIsFocusModeOpen(false);
        }}
        onToggleTask={() => {
          if (focusTask) {
            handleToggle(focusTask.id);
          }
        }}
      />
    </div>
  );
}
