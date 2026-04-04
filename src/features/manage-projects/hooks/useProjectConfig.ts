"use client";

import { useState } from "react";
import {
  useActiveProjects,
  useSaveProject,
  useDeleteProject,
  type Project,
  type ProjectColor,
  type ProjectIcon,
} from "@/entities/project";
import { useConfirm } from "@/shared/hooks/use-confirm";
import { getProjectIcon } from "@/entities/project";

export function useProjectConfig(onClose: () => void) {
  void onClose;
  const { data: entities = [] } = useActiveProjects();
  const saveProjectMutation = useSaveProject();
  const deleteProjectMutation = useDeleteProject();
  const { confirm } = useConfirm();

  const [isCreating, setIsCreating] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<ProjectColor>("blue");
  const [icon, setIcon] = useState<ProjectIcon>("FolderKanban");

  const resetForm = () => {
    setName("");
    setColor("blue");
    setIcon("FolderKanban");
    setIsCreating(false);
    setEditingEntity(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const project: Project = {
      id: editingEntity?.id || crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingEntity?.order ?? entities.length,
      createdAt: editingEntity?.createdAt || new Date().toISOString(),
    };

    saveProjectMutation.mutate(project, { onSuccess: resetForm });
  };

  const handleDelete = async (entity: Project) => {
    const confirmed = await confirm({
      title: "Eliminar proyecto",
      description: `¿Estás seguro de que quieres eliminar "${entity.name}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      deleteProjectMutation.mutate(entity.id);
    }
  };

  const startEditing = (entity: Project) => {
    setEditingEntity(entity);
    setName(entity.name);
    setColor(entity.color);
    setIcon(entity.icon);
    setIsCreating(true);
  };

  const getIconComponent = (iconName: ProjectIcon) => getProjectIcon(iconName);

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
export type UseProjectConfigReturn = ReturnType<typeof useProjectConfig>;
