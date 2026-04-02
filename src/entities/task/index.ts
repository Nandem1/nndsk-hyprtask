// Public API for entities/task
export type { Task, TaskPriority, TaskSettings } from "./model/types";
export type { TaskViewMode, ViewModeConfig } from "./model/view-mode";
export { VIEW_MODES } from "./model/view-mode";
export { taskKeys } from "./model/query-keys";

// Tipos de proyectos/categorías configurables
export type {
  Project,
  Category,
  ProjectColor,
  CategoryColor,
  ProjectIcon,
  CategoryIcon,
} from "./model/project-types";
export {
  PROJECT_COLOR_CLASSES,
  CATEGORY_COLOR_CLASSES,
  DEFAULT_PROJECTS,
  DEFAULT_CATEGORIES,
  LEGACY_PROJECT_MAP,
  LEGACY_CATEGORY_MAP,
} from "./model/project-types";
export { projectKeys, categoryKeys } from "./model/project-query-keys";

// Storage de proyectos/categorías
export {
  getProjects,
  getActiveProjects,
  getProjectById,
  saveProject,
  deleteProject,
  getCategories,
  getActiveCategories,
  getCategoryById,
  saveCategory,
  deleteCategory,
  migrateLegacyProjectsAndCategories,
} from "./lib/project-storage";

// Hooks de proyectos/categorías
export {
  useProjects,
  useActiveProjects,
  useProject,
  useSaveProject,
  useDeleteProject,
} from "./hooks/use-projects";
export {
  useCategories,
  useActiveCategories,
  useCategory,
  useSaveCategory,
  useDeleteCategory,
} from "./hooks/use-categories";
export { useProjectInfo, useCategoryInfo } from "./hooks/use-project-colors";

// Storage de tareas
export {
  getTasks,
  getActiveTasks,
  getCurrentTask,
  getTaskById,
  getTaskSettings,
  saveTask,
  saveTaskSettings,
  deleteTask,
  toggleTask,
  setCurrentTask,
  autoArchiveCompletedTasks,
  updateTaskNotes,
  getTaskParent,
  getTaskChild,
  setTaskParent,
  setTaskChild,
} from "./lib/storage";
export { getTaskViewMode, saveTaskViewMode } from "./lib/view-mode-storage";

// Hooks de tareas
export {
  useActiveTasks,
  useCurrentTask,
  useTaskById,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
  useSetCurrentTask,
  useTaskSettings,
  useUpdateTaskSettings,
  usePrefetchTask,
  useUpdateTaskNotes,
  useTaskParent,
  useTaskChild,
  useSetTaskParent,
  useSetTaskChild,
} from "./hooks/use-tasks";
export {
  useConnectTasks,
  useDisconnectTasks,
  useAutoConnectPipeline,
  useReorderTasks,
} from "./hooks/use-task-relations";

// Hooks de focus sessions
export { useFocusSessions } from "./hooks/use-focus-sessions";
export type { FocusSessionData } from "./hooks/use-focus-sessions";

// UI Components (solo modales de configuración — TaskSidebar movido a widgets/task-sidebar)
export { ProjectConfigModal } from "./ui/ProjectConfigModal";
export { CategoryConfigModal } from "./ui/CategoryConfigModal";
