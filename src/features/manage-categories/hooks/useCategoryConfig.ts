"use client";

import {
  useActiveCategories,
  useSaveCategory,
  useDeleteCategory,
  getCategoryIcon,
  type Category,
  type CategoryColor,
  type CategoryIcon,
} from "@/entities/project";
import { useEntityConfig } from "@/shared/hooks/use-entity-config";

export function useCategoryConfig(onClose: () => void) {
  return useEntityConfig<Category, CategoryColor, CategoryIcon>(onClose, {
    useEntities: useActiveCategories,
    useSave: useSaveCategory,
    useDelete: useDeleteCategory,
    getIcon: getCategoryIcon,
    defaults: { color: "blue", icon: "FolderKanban" },
    deleteConfirm: {
      title: "Eliminar categoría",
      description: (name) => `¿Estás seguro de que quieres eliminar "${name}"?`,
    },
  });
}

/** @internal */
export type UseCategoryConfigReturn = ReturnType<typeof useCategoryConfig>;
