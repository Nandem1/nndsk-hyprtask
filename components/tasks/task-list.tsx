'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { getTaskSettings } from '@/lib/tasks/storage';
import { useActiveTasks, useToggleTask, useDeleteTask, useSetCurrentTask } from '@/hooks/use-tasks';
import { useThemeContext } from '@/components/theme-provider-context';
import { useTaskViewMode } from '@/hooks/use-task-view-mode';
import type { TaskProject, TaskCategory } from '@/types/task';
import { ViewModeSelector } from './view-mode-selector';
import { TaskListView } from './task-list-view';

interface TaskListProps {
  selectedProject?: TaskProject | 'all';
  selectedCategory?: TaskCategory | 'all';
}

export function TaskList({ selectedProject = 'all', selectedCategory = 'all' }: TaskListProps) {
  const { classes } = useThemeContext();
  const { viewMode } = useTaskViewMode();
  const { data: allTasks = [] } = useActiveTasks();
  const [maxTasks, setMaxTasks] = useState<number>(5);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Filtrar tareas según proyecto y categoría
  const tasks = allTasks.filter((task) => {
    if (selectedProject !== 'all' && task.project !== selectedProject) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
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

  const handleToggle = (id: string) => {
    toggleTaskMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleTaskAdded = () => {
    setShowForm(false);
  };

  const handleSetCurrent = (id: string) => {
    setCurrentTaskMutation.mutate(id);
  };

  const canAddTask = allTasks.length < maxTasks;
  const remainingSlots = maxTasks - allTasks.length;
  const filteredCount = tasks.length;
  const totalCount = allTasks.length;

  return (
    <div className="space-y-4">
      {/* Header compacto estilo comfy */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            key={filteredCount}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="flex items-baseline gap-2"
          >
            <span className={`text-3xl font-bold ${classes.textPrimary}`}>
              {filteredCount}
            </span>
            {filteredCount !== totalCount && (
              <span className="text-sm text-muted-foreground">
                / {totalCount}
              </span>
            )}
            <span className="text-sm text-muted-foreground ml-2">
              {filteredCount === 1 ? 'task' : 'tasks'}
            </span>
          </motion.div>
          <div className="h-6 w-px bg-border/30" />
          <span className="text-sm text-muted-foreground">
            {totalCount} of {maxTasks} active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ViewModeSelector />
          {!canAddTask && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-yellow-400/30 text-yellow-300">
              <AlertCircle className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Limit</span>
            </div>
          )}
          {canAddTask && remainingSlots <= 2 && (
            <div className="px-3 py-1.5 rounded-lg glass border border-border/30 text-muted-foreground">
              <span className="text-xs font-medium">{remainingSlots} left</span>
            </div>
          )}
        </div>
      </div>

      {/* Renderizar vista según viewMode */}
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
        classes={classes}
      />
    </div>
  );
}


