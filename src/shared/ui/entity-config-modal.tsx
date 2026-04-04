"use client";

import type React from "react";
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
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { ModalProps } from "@/shared/types/modal";

interface EntityColorClasses {
  bg: string;
  text: string;
  [key: string]: string;
}

interface EntityConfigHook<TEntity, TColor extends string, TIcon extends string> {
  entities: TEntity[];
  isCreating: boolean;
  setIsCreating: (v: boolean) => void;
  editingEntity: TEntity | null;
  name: string;
  setName: (v: string) => void;
  color: TColor;
  setColor: (v: TColor) => void;
  icon: TIcon;
  setIcon: (v: TIcon) => void;
  handleSave: () => void;
  handleDelete: (entity: TEntity) => void;
  startEditing: (entity: TEntity) => void;
  resetForm: () => void;
  getIconComponent: (iconName: TIcon) => React.ComponentType<{ className?: string }>;
}

interface EntityConfigModalProps<
  TEntity extends { id: string; name: string; color: TColor; icon: TIcon },
  TColor extends string,
  TIcon extends string,
> extends ModalProps {
  title: string;
  description: string;
  entityLabel: string;
  addButtonText: string;
  inputId: string;
  inputPlaceholder: string;
  colorClasses: Record<TColor, EntityColorClasses>;
  availableColors: TColor[];
  availableIcons: TIcon[];
  hook: EntityConfigHook<TEntity, TColor, TIcon>;
}

export function EntityConfigModal<
  TEntity extends { id: string; name: string; color: TColor; icon: TIcon },
  TColor extends string,
  TIcon extends string,
>({
  isOpen,
  onClose,
  title,
  description,
  entityLabel,
  addButtonText,
  inputId,
  inputPlaceholder,
  colorClasses,
  availableColors,
  availableIcons,
  hook,
}: EntityConfigModalProps<TEntity, TColor, TIcon>) {
  const {
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
  } = hook;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 my-4">
          {entities.map((entity) => {
            const classes = colorClasses[entity.color];
            const IconComponent = getIconComponent(entity.icon);
            return (
              <div
                key={entity.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
              >
                <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                <div className={cn("p-2 rounded-md", classes.bg)}>
                  <IconComponent className={cn("size-4", classes.text)} />
                </div>
                <span className="flex-1 font-medium">{entity.name}</span>
                <Button variant="ghost" size="sm" onClick={() => startEditing(entity)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(entity)}
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
                {editingEntity ? `Editar ${entityLabel}` : `Nuevo ${entityLabel}`}
              </h4>

              <div className="flex flex-col gap-2">
                <Label htmlFor={inputId}>Nombre</Label>
                <Input
                  id={inputId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={inputPlaceholder}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        "size-8 rounded-full",
                        colorClasses[c].bg,
                        "border-2",
                        color === c ? "border-foreground" : "border-transparent",
                      )}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Icono</Label>
                <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                  {availableIcons.map((i) => {
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
                  {editingEntity ? "Guardar Cambios" : `Crear ${entityLabel}`}
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
            {addButtonText}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
