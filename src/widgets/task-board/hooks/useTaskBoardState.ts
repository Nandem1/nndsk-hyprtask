"use client";

import { useState, useCallback } from "react";
import {
  useToggleTask,
  useDeleteTask,
  useSetCurrentTask,
} from "@/entities/task";
import type { Task } from "@/entities/task";

export function useTaskBoardState() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();
  const setCurrentTaskMutation = useSetCurrentTask();

  const handleToggle = useCallback(
    (id: string) => toggleTaskMutation.mutate(id),
    [toggleTaskMutation],
  );
  const handleDelete = useCallback(
    (id: string) => deleteTaskMutation.mutate(id),
    [deleteTaskMutation],
  );
  const handleSetCurrent = useCallback(
    (id: string) => setCurrentTaskMutation.mutate(id),
    [setCurrentTaskMutation],
  );

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  }, []);

  const handleEnterFocus = useCallback((task: Task) => {
    setFocusTask(task);
    setIsFocusModeOpen(true);
  }, []);

  const handleNavigateToTask = useCallback((task: Task) => {
    setSelectedTask(task);
  }, []);

  const handleOpenCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const handleCloseCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const handleTaskCreated = useCallback(() => setIsCreateModalOpen(false), []);

  return {
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
  };
}
