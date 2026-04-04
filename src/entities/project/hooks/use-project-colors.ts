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

// -------------------------------------------------------
// Constantes internas
// -------------------------------------------------------

const MUTED_COLOR_CLASSES = {
  bg: "bg-muted",
  text: "text-muted-foreground",
  border: "border-border",
  badge: "bg-muted border-border text-muted-foreground",
};

const FALLBACK_COLOR_CLASSES = {
  bg: "bg-gray-500/10",
  text: "text-gray-500",
  border: "border-gray-500/30",
  badge: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
};

function makeEntityInfo<TIcon extends string>(name: string, icon: TIcon) {
  return { colorClasses: MUTED_COLOR_CLASSES, icon, name } as const;
}

const DEFAULT_PROJECT_INFO  = makeEntityInfo("Sin proyecto",         "FolderKanban" as ProjectIcon);
const DELETED_PROJECT_INFO  = makeEntityInfo("Proyecto eliminado",   "FolderKanban" as ProjectIcon);
const DEFAULT_CATEGORY_INFO = makeEntityInfo("Sin categoría",        "Tag" as CategoryIcon);
const DELETED_CATEGORY_INFO = makeEntityInfo("Categoría eliminada",  "Tag" as CategoryIcon);

// -------------------------------------------------------
// Helper privado que comparte la lógica de ambos hooks
// -------------------------------------------------------

type ColorMap<TColor extends string> = Record<TColor, typeof FALLBACK_COLOR_CLASSES>;

function useEntityInfoBase<TColor extends string, TIcon extends string>(opts: {
  entityId: string | undefined;
  data: { color: TColor; icon: TIcon; name: string } | null | undefined;
  defaultInfo: ReturnType<typeof makeEntityInfo>;
  deletedInfo: ReturnType<typeof makeEntityInfo>;
  colorMap: ColorMap<TColor>;
}) {
  const { entityId, data, defaultInfo, deletedInfo, colorMap } = opts;

  return useMemo(() => {
    if (!entityId) return defaultInfo;
    if (!data)    return deletedInfo;

    return {
      colorClasses: colorMap[data.color] ?? FALLBACK_COLOR_CLASSES,
      icon: data.icon,
      name: data.name,
    };
  }, [entityId, data, defaultInfo, deletedInfo, colorMap]);
}

// -------------------------------------------------------
// Hooks públicos
// -------------------------------------------------------

export function useProjectInfo(projectId: string | undefined) {
  const { data: project } = useProject(projectId ?? "");
  return useEntityInfoBase({
    entityId: projectId,
    data: project,
    defaultInfo: DEFAULT_PROJECT_INFO,
    deletedInfo: DELETED_PROJECT_INFO,
    colorMap: PROJECT_COLOR_CLASSES,
  });
}

export function useCategoryInfo(categoryId: string | undefined) {
  const { data: category } = useCategory(categoryId ?? "");
  return useEntityInfoBase({
    entityId: categoryId,
    data: category,
    defaultInfo: DEFAULT_CATEGORY_INFO,
    deletedInfo: DELETED_CATEGORY_INFO,
    colorMap: CATEGORY_COLOR_CLASSES,
  });
}
