"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useTheme, useViewMode } from "@/store/hooks";
import {
  useActiveTasks,
  useToggleTask,
  useDeleteTask,
  useSetCurrentTask,
  getTaskSettings,
  ViewModeSelector,
} from "@/entities/task";
import type { TaskProject, TaskCategory } from "@/entities/task";
import { TaskListView } from "./TaskListView";

interface TaskBoardProps {
  selectedProject?: TaskProject | "all";
  selectedCategory?: TaskCategory | "all";
}

export function TaskBoard({
  selectedProject = "all",
  selectedCategory = "all",
}: TaskBoardProps) {
  const { themeClasses } = useTheme();
  const { viewMode, setViewModeImmediate } = useViewMode();
  const { data: allTasks = [] } = useActiveTasks();
  const [maxTasks, setMaxTasks] = useState<number>(5);
  const [showForm, setShowForm] = useState<boolean>(false);

  // Filtrar tareas
  const tasks = allTasks.filter((task) => {
    if (selectedProject !== "all" && task.project !== selectedProject)
      return false;
    if (selectedCategory !== "all" && task.category !== selectedCategory)
      return false;
    return true;
  });

  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();
  const setCurrentTaskMutation = useSetCurrentTask();

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getTaskSettings();
      setMaxTasks(settings.maxActiveTasks);
    };
    loadSettings();
  }, []);

  const handleToggle = (id: string) => toggleTaskMutation.mutate(id);
  const handleDelete = (id: string) => deleteTaskMutation.mutate(id);
  const handleSetCurrent = (id: string) => setCurrentTaskMutation.mutate(id);
  const handleTaskAdded = () => setShowForm(false);

  const canAddTask = allTasks.length < maxTasks;
  const remainingSlots = maxTasks - allTasks.length;
  const filteredCount = tasks.length;
  const totalCount = allTasks.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            key={filteredCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-baseline gap-2"
          >
            <span className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
              {filteredCount}
            </span>
            {filteredCount !== totalCount && (
              <span className="text-sm text-muted-foreground">
                / {totalCount}
              </span>
            )}
            <span className="text-sm text-muted-foreground ml-2">
              {filteredCount === 1 ? "tarea" : "tareas"}
            </span>
          </motion.div>
          <div className="h-6 w-px bg-border/30" />
          <span className="text-sm text-muted-foreground">
            {totalCount} de {maxTasks} activas
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeSelector
            viewMode={viewMode}
            onChange={setViewModeImmediate}
          />
          {!canAddTask && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-yellow-400/30 text-yellow-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Limite</span>
            </div>
          )}
          {canAddTask && remainingSlots <= 2 && (
            <div className="px-3 py-1.5 rounded-lg glass border border-border/30 text-muted-foreground">
              <span className="text-xs font-medium">
                {remainingSlots} restantes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de tareas */}
      <TaskListView
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
        selectedProject={selectedProject}
        selectedCategory={selectedCategory}
        themeClasses={themeClasses}
      />
    </div>
  );
}
