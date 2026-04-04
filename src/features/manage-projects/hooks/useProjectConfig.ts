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
  const { data: projects = [] } = useActiveProjects();
  const saveProjectMutation = useSaveProject();
  const deleteProjectMutation = useDeleteProject();
  const { confirm } = useConfirm();

  const [isCreating, setIsCreating] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<ProjectColor>("blue");
  const [icon, setIcon] = useState<ProjectIcon>("FolderKanban");

  const resetForm = () => {
    setName("");
    setColor("blue");
    setIcon("FolderKanban");
    setIsCreating(false);
    setEditingProject(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const project: Project = {
      id: editingProject?.id || crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingProject?.order ?? projects.length,
      createdAt: editingProject?.createdAt || new Date().toISOString(),
    };

    saveProjectMutation.mutate(project, { onSuccess: resetForm });
  };

  const handleDelete = async (project: Project) => {
    const confirmed = await confirm({
      title: "Eliminar proyecto",
      description: `¿Estás seguro de que quieres eliminar "${project.name}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      deleteProjectMutation.mutate(project.id);
    }
  };

  const startEditing = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setColor(project.color);
    setIcon(project.icon);
    setIsCreating(true);
  };

  const getIconComponent = (iconName: ProjectIcon) => getProjectIcon(iconName);

  return {
    projects,
    isCreating,
    setIsCreating,
    editingProject,
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

export type UseProjectConfigReturn = ReturnType<typeof useProjectConfig>;
