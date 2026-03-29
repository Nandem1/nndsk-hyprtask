// Public API for entities/task
export type {
  Task,
  TaskPriority,
  TaskProject,
  TaskCategory,
  TaskSettings,
} from "./model/types";
export type { TaskViewMode, ViewModeConfig } from "./model/view-mode";
export { VIEW_MODES } from "./model/view-mode";
export { taskKeys } from "./model/query-keys";
export {
  PROJECTS,
  CATEGORIES,
  getProjectById,
  getCategoryById,
  getProjectBadgeClasses,
  getCategoryBadgeClasses,
} from "./lib/constants";
export type { ProjectConfig, CategoryConfig } from "./lib/constants";
export {
  getTasks,
  getActiveTasks,
  getCurrentTask,
  getTaskSettings,
  saveTask,
  saveTaskSettings,
  deleteTask,
  toggleTask,
  setCurrentTask,
  autoArchiveCompletedTasks,
} from "./lib/storage";
export { getTaskViewMode, saveTaskViewMode } from "./lib/view-mode-storage";
export {
  useActiveTasks,
  useCurrentTask,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
  useSetCurrentTask,
} from "./hooks/use-tasks";

// UI Components
export { TaskCard } from "./ui/TaskCard";
export { TaskForm } from "./ui/TaskForm";
export { TaskSidebar } from "./ui/TaskSidebar";
export { ViewModeSelector } from "./ui/ViewModeSelector";
