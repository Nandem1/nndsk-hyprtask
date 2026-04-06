"use client";

import { useState } from "react";
import type React from "react";
import { useConfirm } from "./use-confirm";

type SaveFn<TEntity> = (entity: TEntity, opts?: { onSuccess?: () => void }) => void;
type DeleteFn = (id: string) => void;

interface EntityConfigDeps<TEntity extends BaseEntity, TColor extends string, TIcon extends string> {
  useEntities: () => { data?: TEntity[] };
  useSave: () => { mutate: SaveFn<TEntity> };
  useDelete: () => { mutate: DeleteFn };
  getIcon: (icon: TIcon) => React.ComponentType<{ className?: string }>;
  defaults: { color: TColor; icon: TIcon };
  deleteConfirm: { title: string; description: (name: string) => string };
}

type BaseEntity = {
  id: string;
  name: string;
  color: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: string;
};

export function useEntityConfig<
  TEntity extends BaseEntity,
  TColor extends string,
  TIcon extends string,
>(
  _onClose: () => void,
  deps: EntityConfigDeps<TEntity, TColor, TIcon>,
) {
  const { useEntities, useSave, useDelete, getIcon, defaults, deleteConfirm } = deps;
  const { data: entities = [] } = useEntities();
  const saveMutation = useSave();
  const deleteMutation = useDelete();
  const { confirm } = useConfirm();

  const [isCreating, setIsCreating] = useState(false);
  const [editingEntity, setEditingEntity] = useState<TEntity | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState<TColor>(defaults.color);
  const [icon, setIcon] = useState<TIcon>(defaults.icon);

  const resetForm = () => {
    setName("");
    setColor(defaults.color);
    setIcon(defaults.icon);
    setIsCreating(false);
    setEditingEntity(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const entity = {
      id: editingEntity?.id ?? crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingEntity?.order ?? entities.length,
      createdAt: editingEntity?.createdAt ?? new Date().toISOString(),
    } as unknown as TEntity;
    saveMutation.mutate(entity, { onSuccess: resetForm });
  };

  const handleDelete = async (entity: TEntity) => {
    const confirmed = await confirm({
      title: deleteConfirm.title,
      description: deleteConfirm.description(entity.name),
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) deleteMutation.mutate(entity.id);
  };

  const startEditing = (entity: TEntity) => {
    setEditingEntity(entity);
    setName(entity.name);
    setColor(entity.color as TColor);
    setIcon(entity.icon as TIcon);
    setIsCreating(true);
  };

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
    getIconComponent: getIcon,
  };
}
