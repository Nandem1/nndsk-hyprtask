"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  useActiveProjects,
  useSaveProject,
  useDeleteProject,
} from "../hooks/use-projects";
import type { Project, ProjectColor, ProjectIcon } from "../model/project-types";
import { PROJECT_COLOR_CLASSES } from "../model/project-types";
import * as Icons from "lucide-react";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface ProjectConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_COLORS: ProjectColor[] = [
  "blue",
  "indigo",
  "purple",
  "green",
  "teal",
  "cyan",
  "pink",
  "rose",
  "orange",
  "amber",
  "yellow",
  "gray",
];

const AVAILABLE_ICONS: ProjectIcon[] = [
  "Server",
  "Code",
  "Bot",
  "FolderOpen",
  "FolderKanban",
  "Layers",
  "Box",
  "Database",
  "Cloud",
  "Globe",
  "Monitor",
  "Laptop",
  "Cpu",
  "GitBranch",
  "Terminal",
  "Briefcase",
  "Building",
  "Home",
  "Rocket",
  "Zap",
  "Star",
  "Heart",
  "Bookmark",
  "Flag",
  "Target",
];

export function ProjectConfigModal({ isOpen, onClose }: ProjectConfigModalProps) {
  const { data: projects = [] } = useActiveProjects();
  const saveProjectMutation = useSaveProject();
  const deleteProjectMutation = useDeleteProject();

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

    saveProjectMutation.mutate(project, {
      onSuccess: resetForm,
    });
  };

  const handleDelete = (project: Project) => {
    if (confirm(`¿Eliminar el proyecto "${project.name}"?`)) {
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

  const getIconComponent = (iconName: ProjectIcon) => {
    const IconComponent = Icons[iconName as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    return IconComponent || Icons.FolderKanban;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Proyectos</DialogTitle>
          <DialogDescription>
            Gestiona tus proyectos. Los cambios se aplican inmediatamente.
          </DialogDescription>
        </DialogHeader>

        {/* Lista de proyectos */}
        <div className="space-y-2 my-4">
          {projects.map((project) => {
            const colorClasses = PROJECT_COLOR_CLASSES[project.color];
            const IconComponent = getIconComponent(project.icon);
            return (
              <div
                key={project.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <div className={`p-2 rounded-md ${colorClasses.bg}`}>
                  <IconComponent className={`h-4 w-4 ${colorClasses.text}`} />
                </div>
                <span className="flex-1 font-medium">{project.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(project)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(project)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Formulario crear/editar */}
        {isCreating ? (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">
              {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
            </h4>

            <div>
              <Label htmlFor="project-name">Nombre</Label>
              <Input
                id="project-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del proyecto"
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {AVAILABLE_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${PROJECT_COLOR_CLASSES[c].bg} border-2 ${
                      color === c ? "border-foreground" : "border-transparent"
                    }`}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label>Icono</Label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                {AVAILABLE_ICONS.map((i) => {
                  const IconComponent = getIconComponent(i);
                  return (
                    <button
                      key={i}
                      onClick={() => setIcon(i)}
                      className={`p-2 rounded-md border ${
                        icon === i
                          ? "border-foreground bg-accent"
                          : "border-border hover:bg-accent/50"
                      }`}
                      title={i}
                    >
                      <IconComponent className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                {editingProject ? "Guardar Cambios" : "Crear Proyecto"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Proyecto
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
