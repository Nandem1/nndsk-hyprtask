"use client";

import { useProject } from "./use-projects";
import { useCategory } from "./use-categories";
import {
  PROJECT_COLOR_CLASSES,
  CATEGORY_COLOR_CLASSES,
  type ProjectIcon,
  type CategoryIcon,
} from "../model/project-types";

/**
 * Hook para obtener la información de un proyecto
 */
export function useProjectInfo(projectId: string | undefined) {
  const { data: project } = useProject(projectId || "");

  if (!projectId || !project) {
    return {
      colorClasses: {
        bg: "bg-muted",
        text: "text-muted-foreground",
        border: "border-border",
        badge: "bg-muted border-border text-muted-foreground",
      },
      icon: "FolderKanban" as ProjectIcon,
      name: projectId ? "Proyecto eliminado" : "Sin proyecto",
    };
  }

  const colorClasses = PROJECT_COLOR_CLASSES[project.color] || {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/30",
    badge: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
  };

  return {
    colorClasses,
    icon: project.icon,
    name: project.name,
  };
}

/**
 * Hook para obtener la información de una categoría
 */
export function useCategoryInfo(categoryId: string | undefined) {
  const { data: category } = useCategory(categoryId || "");

  if (!categoryId || !category) {
    return {
      colorClasses: {
        bg: "bg-muted",
        text: "text-muted-foreground",
        border: "border-border",
        badge: "bg-muted border-border text-muted-foreground",
      },
      icon: "Tag" as CategoryIcon,
      name: categoryId ? "Categoría eliminada" : "Sin categoría",
    };
  }

  const colorClasses = CATEGORY_COLOR_CLASSES[category.color] || {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/30",
    badge: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
  };

  return {
    colorClasses,
    icon: category.icon,
    name: category.name,
  };
}
