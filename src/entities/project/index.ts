// Public API for entities/project
export type {
  Project,
  Category,
  ProjectColor,
  CategoryColor,
  ProjectIcon,
  CategoryIcon,
} from "./model/types";
export {
  PROJECT_COLOR_CLASSES,
  CATEGORY_COLOR_CLASSES,
} from "./model/color-constants";
export { DEFAULT_PROJECTS, DEFAULT_CATEGORIES } from "./model/defaults";
export { projectKeys, categoryKeys } from "./model/query-keys";
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
export {
  PROJECT_ICON_MAP,
  CATEGORY_ICON_MAP,
  getProjectIcon,
  getCategoryIcon,
  getEntityIcon,
} from "./lib/icons";

// UI Components
export { TaskMetadataBadges } from "./ui/TaskMetadataBadges";
export { ProjectName } from "./ui/ProjectName";
