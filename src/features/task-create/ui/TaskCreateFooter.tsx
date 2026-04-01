"use client";

import { Save, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { TaskCreateFooterProps } from "../model";

export function TaskCreateFooter({
  isSubmitting,
  canCreate,
  onCancel,
}: TaskCreateFooterProps) {
  return (
    <div className="flex gap-3 pt-2">
      <Button
        type="submit"
        disabled={!canCreate || isSubmitting}
        className="flex-1 gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      >
        <Save className="size-4" />
        {isSubmitting ? "Guardando..." : "Crear Tarea"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="gap-2 transition-all duration-200 hover:bg-muted"
      >
        <X className="size-4" />
        Cancelar
      </Button>
    </div>
  );
}
