"use client";

import { useState } from "react";
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

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleTaskCreated = () => setIsCreateModalOpen(false);

  return {
    // Modal state
    selectedTask,
    isDetailModalOpen,
    setIsDetailModalOpen,
    isCreateModalOpen,
    focusTask,
    isFocusModeOpen,
    setIsFocusModeOpen,
    // Handlers
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
