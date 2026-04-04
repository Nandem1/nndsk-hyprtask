// Public API for entities/task
export type { Task, TaskPriority, TaskSettings } from "./model/types";
export type { TaskViewMode, ViewModeConfig } from "./model/view-mode";
export { taskKeys } from "./model/query-keys";



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

// Hook de filtrado
export { useFilteredTasks } from "./hooks/use-filtered-tasks";

// Hooks de focus sessions
export { useFocusSessions } from "./hooks/use-focus-sessions";
export type { FocusSessionData } from "./hooks/use-focus-sessions";
