"use client";

import { cn } from "@/shared/lib/utils";
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
import { Separator } from "@/shared/ui/separator";
import { PROJECT_COLOR_CLASSES } from "@/entities/project";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useProjectConfig } from "../hooks/useProjectConfig";
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from "../model/constants";
import type { ProjectConfigModalProps } from "../model/types";

export function ProjectConfigModal({
  isOpen,
  onClose,
}: ProjectConfigModalProps) {
  const {
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
  } = useProjectConfig(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Proyectos</DialogTitle>
          <DialogDescription>
            Gestiona tus proyectos. Los cambios se aplican inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 my-4">
          {projects.map((project) => {
            const colorClasses = PROJECT_COLOR_CLASSES[project.color];
            const IconComponent = getIconComponent(project.icon);
            return (
              <div
                key={project.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                <div className={cn("p-2 rounded-md", colorClasses.bg)}>
                  <IconComponent className={cn("size-4", colorClasses.text)} />
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
                  <Trash2 />
                </Button>
              </div>
            );
          })}
        </div>

        {isCreating ? (
          <>
            <Separator />
            <div className="flex flex-col gap-4 pt-4">
              <h4 className="font-medium">
                {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
              </h4>

              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Nombre</Label>
                <Input
                  id="project-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre del proyecto"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABLE_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "size-8 rounded-full",
                        PROJECT_COLOR_CLASSES[c].bg,
                        "border-2",
                        color === c
                          ? "border-foreground"
                          : "border-transparent",
                      )}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Icono</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                  {AVAILABLE_ICONS.map((i) => {
                    const IconComponent = getIconComponent(i);
                    return (
                      <button
                        key={i}
                        onClick={() => setIcon(i)}
                        className={cn(
                          "p-2 rounded-md border",
                          icon === i
                            ? "border-foreground bg-accent"
                            : "border-border hover:bg-accent/50",
                        )}
                        title={i}
                      >
                        <IconComponent className="size-4" />
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
          </>
        ) : (
          <Button onClick={() => setIsCreating(true)} className="w-full">
            <Plus data-icon="inline-start" />
            Agregar Proyecto
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
