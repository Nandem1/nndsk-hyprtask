"use client";

import { useState } from "react";
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
import { KanbanViewWrapper } from "./KanbanViewWrapper";
import { PipelineView } from "./views/PipelineView";
import { TaskDetailModal } from "./TaskDetailModal";
import { FocusMode } from "./FocusMode";
import { TaskForm } from "@/entities/task";

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
  const [showForm, setShowForm] = useState<boolean>(false);

  // Estado para el modal de detalle
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para modo foco
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  // Filtrar tareas
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
  const handleTaskAdded = () => setShowForm(false);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleEnterFocus = (task: Task) => {
    setFocusTask(task);
    setIsFocusModeOpen(true);
  };

  const handleNavigateToTask = (task: Task) => {
    setSelectedTask(task);
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

  const formProps = {
    onTaskAdded: handleTaskAdded,
    onCancel: () => setShowForm(false),
    maxTasks,
    currentTasks: allTasks.length,
    defaultProjectId:
      selectedProjectId !== "all" ? selectedProjectId : undefined,
    defaultCategoryId:
      selectedCategoryId !== "all" ? selectedCategoryId : undefined,
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
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
          {/* Selector de vista */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-muted">
            {VIEW_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <mode.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {!canAddTask && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Limite</span>
            </div>
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

      {/* Vista según modo seleccionado */}
      {viewMode === "pipeline" ? (
        <PipelineView
          {...commonProps}
          showForm={showForm}
          canAddTask={canAddTask}
          onShowForm={() => setShowForm(true)}
          formProps={formProps}
          onSelectTask={handleSelectTask}
          onEnterFocus={handleEnterFocus}
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
          showForm={showForm}
          maxTasks={maxTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onSetCurrent={handleSetCurrent}
          onTaskAdded={handleTaskAdded}
          onCancelForm={() => setShowForm(false)}
          onShowForm={() => setShowForm(true)}
          themeClasses={themeClasses}
        />
      )}

      {/* Formulario flotante */}
      {showForm && canAddTask && (
        <div className="fixed inset-x-4 bottom-4 md:relative md:inset-auto md:bottom-auto z-50">
          <div className="bg-background border border-border rounded-xl shadow-2xl p-4 md:shadow-none">
            <TaskForm {...formProps} />
          </div>
        </div>
      )}

      {/* Botón flotante para agregar */}
      {!showForm && canAddTask && viewMode === "kanban" && (
        <div className="fixed bottom-6 right-6 md:relative md:bottom-auto md:right-auto">
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="shadow-lg hover:shadow-xl transition-shadow rounded-full md:rounded-lg w-14 h-14 md:w-auto md:h-auto"
          >
            <Plus className="h-6 w-6 md:h-4 md:w-4 md:mr-2" />
            <span className="hidden md:inline">Nueva nota</span>
          </Button>
        </div>
      )}

      {/* Modal de detalle */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

      {/* Modo Focus */}
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
