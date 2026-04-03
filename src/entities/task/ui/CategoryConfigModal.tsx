"use client";

import { useState } from "react";
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
import {
  useActiveCategories,
  useSaveCategory,
  useDeleteCategory,
} from "../hooks/use-categories";
import type {
  Category,
  CategoryColor,
  CategoryIcon,
} from "../model/project-types";
import { CATEGORY_COLOR_CLASSES } from "../model/project-types";
import {
  Bug,
  Wrench,
  Zap,
  Sparkles,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  FileText,
  FileCheck,
  Clipboard,
  ClipboardList,
  List,
  ListChecks,
  ListTodo,
  Layout,
  LayoutGrid,
  BarChart,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Plus, Trash2, GripVertical } from "lucide-react";

const CATEGORY_ICON_MAP: Record<CategoryIcon, React.ComponentType<{ className?: string }>> = {
  Bug,
  Wrench,
  Zap,
  Sparkles,
  FolderKanban,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle: AlertCircle,
  FileText,
  FileCheck,
  FilePlus: FileCheck,
  FileMinus: FileText,
  FileX: FileText,
  FileQuestion: FileText,
  Clipboard,
  ClipboardCheck: Clipboard,
  ClipboardList,
  List,
  ListChecks,
  ListTodo,
  Layout,
  LayoutGrid,
  Grid: LayoutGrid,
  Table: LayoutGrid,
  BarChart,
  PieChart: BarChart,
  TrendingUp,
  TrendingDown: TrendingUp,
  Activity,
  Pulse: Activity,
};
import { useConfirm } from "@/shared/hooks/use-confirm";

interface CategoryConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_COLORS: CategoryColor[] = [
  "red",
  "orange",
  "amber",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
  "rose",
  "gray",
];

const AVAILABLE_ICONS: CategoryIcon[] = [
  "Bug",
  "Wrench",
  "Zap",
  "Sparkles",
  "FolderKanban",
  "CheckCircle",
  "AlertCircle",
  "AlertTriangle",
  "Info",
  "FileText",
  "FileCheck",
  "Clipboard",
  "ClipboardList",
  "List",
  "ListChecks",
  "ListTodo",
  "Layout",
  "LayoutGrid",
  "BarChart",
  "TrendingUp",
  "Activity",
];

export function CategoryConfigModal({
  isOpen,
  onClose,
}: CategoryConfigModalProps) {
  const { data: categories = [] } = useActiveCategories();
  const saveCategoryMutation = useSaveCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [color, setColor] = useState<CategoryColor>("blue");
  const [icon, setIcon] = useState<CategoryIcon>("FolderKanban");

  const { confirm } = useConfirm();

  const resetForm = () => {
    setName("");
    setColor("blue");
    setIcon("FolderKanban");
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const category: Category = {
      id: editingCategory?.id || crypto.randomUUID(),
      name: name.trim(),
      color,
      icon,
      isActive: true,
      order: editingCategory?.order ?? categories.length,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
    };

    saveCategoryMutation.mutate(category, {
      onSuccess: resetForm,
    });
  };

  const handleDelete = async (category: Category) => {
    const confirmed = await confirm({
      title: "Eliminar categoría",
      description: `¿Estás seguro de que quieres eliminar "${category.name}"?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "destructive",
    });
    if (confirmed) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setColor(category.color);
    setIcon(category.icon);
    setIsCreating(true);
  };

  const getIconComponent = (iconName: CategoryIcon) => {
    return CATEGORY_ICON_MAP[iconName] || FolderKanban;
  };

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
