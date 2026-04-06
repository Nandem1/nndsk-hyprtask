"use client";

import { EntityConfigModal } from "@/shared/ui/entity-config-modal";
import { PROJECT_COLOR_CLASSES } from "@/entities/project";
import { useProjectConfig } from "../hooks/useProjectConfig";
import {
  AVAILABLE_PROJECT_COLORS as AVAILABLE_COLORS,
  AVAILABLE_PROJECT_ICONS as AVAILABLE_ICONS,
} from "@/entities/project/model/available-options";
import type { ProjectConfigModalProps } from "../model/types";

export function ProjectConfigModal({ isOpen, onClose }: ProjectConfigModalProps) {
  const hook = useProjectConfig(onClose);

  return (
    <EntityConfigModal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Proyectos"
      description="Gestiona tus proyectos. Los cambios se aplican inmediatamente."
      entityLabel="Proyecto"
      addButtonText="Agregar Proyecto"
      inputId="project-name"
      inputPlaceholder="Nombre del proyecto"
      colorClasses={PROJECT_COLOR_CLASSES}
      availableColors={AVAILABLE_COLORS}
      availableIcons={AVAILABLE_ICONS}
      hook={hook}
    />
  );
}
