"use client";

import { useMemo } from "react";
import { useProject } from "./use-projects";
import { useCategory } from "./use-categories";
import {
  PROJECT_COLOR_CLASSES,
  CATEGORY_COLOR_CLASSES,
  type ProjectIcon,
  type CategoryIcon,
} from "../model/types";

// Objetos constantes para evitar recreación
const DEFAULT_PROJECT_INFO = {
  colorClasses: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    badge: "bg-muted border-border text-muted-foreground",
  },
  icon: "FolderKanban" as ProjectIcon,
  name: "Sin proyecto",
};

const DELETED_PROJECT_INFO = {
  colorClasses: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    badge: "bg-muted border-border text-muted-foreground",
  },
  icon: "FolderKanban" as ProjectIcon,
  name: "Proyecto eliminado",
};

const DEFAULT_CATEGORY_INFO = {
  colorClasses: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    badge: "bg-muted border-border text-muted-foreground",
  },
  icon: "Tag" as CategoryIcon,
  name: "Sin categoría",
};

const DELETED_CATEGORY_INFO = {
  colorClasses: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    badge: "bg-muted border-border text-muted-foreground",
  },
  icon: "Tag" as CategoryIcon,
  name: "Categoría eliminada",
};

const FALLBACK_COLOR_CLASSES = {
  bg: "bg-gray-500/10",
  text: "text-gray-500",
  border: "border-gray-500/30",
  badge: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
};

export function useProjectInfo(projectId: string | undefined) {
  const { data: project } = useProject(projectId || "");

  return useMemo(() => {
    if (!projectId) {
      return DEFAULT_PROJECT_INFO;
    }

    if (!project) {
      return DELETED_PROJECT_INFO;
    }

    const colorClasses = PROJECT_COLOR_CLASSES[project.color] || FALLBACK_COLOR_CLASSES;

    return {
      colorClasses,
      icon: project.icon,
      name: project.name,
    };
  }, [projectId, project]);
}

export function useCategoryInfo(categoryId: string | undefined) {
  const { data: category } = useCategory(categoryId || "");

  return useMemo(() => {
    if (!categoryId) {
      return DEFAULT_CATEGORY_INFO;
    }

    if (!category) {
      return DELETED_CATEGORY_INFO;
    }

    const colorClasses = CATEGORY_COLOR_CLASSES[category.color] || FALLBACK_COLOR_CLASSES;

    return {
      colorClasses,
      icon: category.icon,
      name: category.name,
    };
  }, [categoryId, category]);
}
