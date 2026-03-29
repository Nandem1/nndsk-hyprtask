'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { TaskProject, TaskCategory } from '@/entities/task';

interface TaskFiltersContextType {
  selectedProject: TaskProject | 'all';
  selectedCategory: TaskCategory | 'all';
  setSelectedProject: (project: TaskProject | 'all') => void;
  setSelectedCategory: (category: TaskCategory | 'all') => void;
  clearFilters: () => void;
}

const TaskFiltersContext = createContext<TaskFiltersContextType | undefined>(undefined);

export function TaskFiltersProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<TaskProject | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory | 'all'>('all');

  const clearFilters = () => {
    setSelectedProject('all');
    setSelectedCategory('all');
  };

  return (
    <TaskFiltersContext.Provider value={{
      selectedProject,
      selectedCategory,
      setSelectedProject,
      setSelectedCategory,
      clearFilters,
    }}>
      {children}
    </TaskFiltersContext.Provider>
  );
}

export function useTaskFilters() {
  const context = useContext(TaskFiltersContext);
  if (!context) {
    throw new Error('useTaskFilters must be used within TaskFiltersProvider');
  }
  return context;
}
