'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getTaskViewMode, saveTaskViewMode } from '@/lib/tasks/view-mode-storage';
import type { TaskViewMode } from '@/types/view-mode';

interface ViewModeContextType {
  viewMode: TaskViewMode;
  changeViewMode: (mode: TaskViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<TaskViewMode>('terminal');

  useEffect(() => {
    const savedMode = getTaskViewMode();
    setViewMode(savedMode);
  }, []);

  const changeViewMode = (mode: TaskViewMode) => {
    setViewMode(mode);
    saveTaskViewMode(mode);
  };

  return (
    <ViewModeContext.Provider value={{ viewMode, changeViewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}

export function useTaskViewMode() {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useTaskViewMode must be used within ViewModeProvider');
  }
  return context;
}
