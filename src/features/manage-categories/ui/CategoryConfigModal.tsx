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
import { CATEGORY_COLOR_CLASSES } from "@/entities/project";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useCategoryConfig } from "../hooks/useCategoryConfig";
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from "../model/constants";
import type { CategoryConfigModalProps } from "../model/types";

export function CategoryConfigModal({
  isOpen,
  onClose,
}: CategoryConfigModalProps) {
  const {
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
  } = useCategoryConfig(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar Categorías</DialogTitle>
          <DialogDescription>
            Gestiona tus categorías. Los cambios se aplican inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 my-4">
          {categories.map((category) => {
            const colorClasses = CATEGORY_COLOR_CLASSES[category.color];
            const IconComponent = getIconComponent(category.icon);
            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                <div className={cn("p-2 rounded-md", colorClasses.bg)}>
                  <IconComponent className={cn("size-4", colorClasses.text)} />
                </div>
                <span className="flex-1 font-medium">{category.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing(category)}
                >
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(category)}
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
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </h4>

              <div className="flex flex-col gap-2">
                <Label htmlFor="category-name">Nombre</Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre de la categoría"
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
                        CATEGORY_COLOR_CLASSES[c].bg,
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
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
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
            Agregar Categoría
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
