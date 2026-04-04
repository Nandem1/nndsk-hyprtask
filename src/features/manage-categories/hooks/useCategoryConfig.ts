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
import { CATEGORY_ICON_MAP } from "../model/constants";
import { FolderKanban } from "lucide-react";

export function useCategoryConfig(onClose: () => void) {
  const { data: categories = [] } = useActiveCategories();
  const saveCategoryMutation = useSaveCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const { confirm } = useConfirm();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColor>("blue");
  const [icon, setIcon] = useState<CategoryIcon>("FolderKanban");

  const resetForm = () => {
    setName("");
    setColor("blue");
    setIcon("FolderKanban");
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const category: Category = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingCategory?.order ?? categories.length,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
    };

    saveCategoryMutation.mutate(category, { onSuccess: resetForm });
  };

  const handleDelete = async (category: Category) => {
    const confirmed = await confirm({
      title: "Eliminar categoría",
      description: `¿Estás seguro de que quieres eliminar "${category.name}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setIcon(category.icon);
    setIsCreating(true);
  };

  const getIconComponent = (iconName: CategoryIcon) => {
    return CATEGORY_ICON_MAP[iconName] || FolderKanban;
  };

  return {
    categories,
    isCreating,
    setIsCreating,
    editingCategory,
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

export type UseCategoryConfigReturn = ReturnType<typeof useCategoryConfig>;
