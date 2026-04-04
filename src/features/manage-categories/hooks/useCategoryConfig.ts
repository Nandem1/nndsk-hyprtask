"use client";

import { useState } from "react";
import {
  useActiveCategories,
  useSaveCategory,
  useDeleteCategory,
  type Category,
  type CategoryColor,
  type CategoryIcon,
} from "@/entities/project";
import { useConfirm } from "@/shared/hooks/use-confirm";
import { getCategoryIcon } from "@/entities/project";

export function useCategoryConfig(onClose: () => void) {
  const { data: entities = [] } = useActiveCategories();
  const saveCategoryMutation = useSaveCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const { confirm } = useConfirm();

  const [isCreating, setIsCreating] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColor>("blue");
  const [icon, setIcon] = useState<CategoryIcon>("FolderKanban");

  const resetForm = () => {
    setName("");
    setColor("blue");
    setIcon("FolderKanban");
    setIsCreating(false);
    setEditingEntity(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const category: Category = {
      id: editingEntity?.id || crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingEntity?.order ?? entities.length,
      createdAt: editingEntity?.createdAt || new Date().toISOString(),
    };

    saveCategoryMutation.mutate(category, { onSuccess: resetForm });
  };

  const handleDelete = async (entity: Category) => {
    const confirmed = await confirm({
      title: "Eliminar categoría",
      description: `¿Estás seguro de que quieres eliminar "${entity.name}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      deleteCategoryMutation.mutate(entity.id);
    }
  };

  const startEditing = (entity: Category) => {
    setEditingEntity(entity);
    setName(entity.name);
    setColor(entity.color);
    setIcon(entity.icon);
    setIsCreating(true);
  };

  const getIconComponent = (iconName: CategoryIcon) => getCategoryIcon(iconName);

  return {
    entities,
    isCreating,
    setIsCreating,
    editingEntity,
    name,
    setName,
    color,
    setColor,
    icon,
    setIcon,
    handleSave,
    handleDelete,
    startEditing,
    resetForm,
    getIconComponent,
  };
}

/** @internal */
export type UseCategoryConfigReturn = ReturnType<typeof useCategoryConfig>;
