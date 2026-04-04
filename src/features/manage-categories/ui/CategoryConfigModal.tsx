"use client";

import { EntityConfigModal } from "@/shared/ui/entity-config-modal";
import { CATEGORY_COLOR_CLASSES } from "@/entities/project";
import { useCategoryConfig } from "../hooks/useCategoryConfig";
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from "../model/constants";
import type { CategoryConfigModalProps } from "../model/types";

export function CategoryConfigModal({ isOpen, onClose }: CategoryConfigModalProps) {
  const hook = useCategoryConfig(onClose);

  return (
    <EntityConfigModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Categorías"
      description="Gestiona tus categorías. Los cambios se aplican inmediatamente."
      entityLabel="Categoría"
      addButtonText="Agregar Categoría"
      inputId="category-name"
      inputPlaceholder="Nombre de la categoría"
      colorClasses={CATEGORY_COLOR_CLASSES}
      availableColors={AVAILABLE_COLORS}
      availableIcons={AVAILABLE_ICONS}
      hook={hook}
    />
  );
}
