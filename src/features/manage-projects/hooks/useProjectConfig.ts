"use client";

import {
  useActiveProjects,
  useSaveProject,
  useDeleteProject,
  getProjectIcon,
  type Project,
  type ProjectColor,
  type ProjectIcon,
} from "@/entities/project";
import { useEntityConfig } from "@/shared/hooks/use-entity-config";

export function useProjectConfig(onClose: () => void) {
  return useEntityConfig<Project, ProjectColor, ProjectIcon>(onClose, {
    useEntities: useActiveProjects,
    useSave: useSaveProject,
    useDelete: useDeleteProject,
    getIcon: getProjectIcon,
    defaults: { color: "blue", icon: "FolderKanban" },
    deleteConfirm: {
      title: "Eliminar proyecto",
      description: (name) => `¿Estás seguro de que quieres eliminar "${name}"?`,
    },
  });
}

/** @internal */
export type UseProjectConfigReturn = ReturnType<typeof useProjectConfig>;
