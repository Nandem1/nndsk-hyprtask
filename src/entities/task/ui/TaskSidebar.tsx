"use client";

import { useState } from "react";
import { X, Settings, FolderKanban, Tag } from "lucide-react";
import { useThemeState } from "@/store/hooks";
import { useTaskFiltersState, useTaskFiltersActions } from "@/store/hooks";
import { useActiveTasks } from "../hooks/use-tasks";
import { useActiveProjects } from "../hooks/use-projects";
import { useActiveCategories } from "../hooks/use-categories";
import { Button } from "@/shared/ui/button";
import { ProjectConfigModal } from "./ProjectConfigModal";
import { CategoryConfigModal } from "./CategoryConfigModal";
import * as Icons from "lucide-react";

interface TaskSidebarProps {
  onClose?: () => void;
}

export function TaskSidebar({ onClose }: TaskSidebarProps) {
  const { themeClasses } = useThemeState();
  const { selectedProjectId, selectedCategoryId } = useTaskFiltersState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  const { data: tasks = [] } = useActiveTasks();
  const { data: projects = [] } = useActiveProjects();
  const { data: categories = [] } = useActiveCategories();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Contar tareas por proyecto
  const projectCounts = projects.map((project) => ({
    ...project,
    count: tasks.filter((t) => t.projectId === project.id).length,
  }));

  // Contar tareas por categoría
  const categoryCounts = categories.map((category) => ({
    ...category,
    count: tasks.filter((t) => t.categoryId === category.id).length,
  }));

  const handleProjectChange = (projectId: string | "all") => {
    setSelectedProject(projectId);
    if (onClose) onClose();
  };

  const handleCategoryChange = (categoryId: string | "all") => {
    setSelectedCategory(categoryId);
    if (onClose) onClose();
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{ className?: string }>;
    return IconComponent || Icons.FolderKanban;
  };

  const hasActiveFilters =
    selectedProjectId !== "all" || selectedCategoryId !== "all";

  return (
    <aside className="w-72 border-r border-border bg-card h-full overflow-y-auto">
      <div className="p-4 space-y-6">
        {onClose && (
          <div className="flex justify-end mb-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Header con contador y limpiar filtros */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Tareas Activas</div>
            <div className={`text-3xl font-bold ${themeClasses.textPrimary}`}>
              {tasks.length}
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedProject("all");
                setSelectedCategory("all");
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>

        {/* Proyectos */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <FolderKanban className="h-4 w-4" />
              Proyectos
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            {projectCounts.map((project) => {
              const IconComponent = getIconComponent(project.icon);
              const isSelected = selectedProjectId === project.id;

              return (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? `bg-accent border ${themeClasses.border}`
                      : "border border-transparent hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`h-4 w-4 ${isSelected ? themeClasses.textPrimary : "text-muted-foreground"}`}
                    />
                    <span
                      className={
                        isSelected
                          ? `${themeClasses.textPrimary} font-medium`
                          : "text-foreground"
                      }
                    >
                      {project.name}
                    </span>
                  </div>
                  {project.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isSelected
                          ? `${themeClasses.textPrimary} bg-primary/10`
                          : "text-muted-foreground bg-muted"
                      }`}
                    >
                      {project.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <Tag className="h-4 w-4" />
              Categorías
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-1">
            {categoryCounts.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const isSelected = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? `bg-accent border ${themeClasses.border}`
                      : "border border-transparent hover:bg-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={`h-4 w-4 ${isSelected ? themeClasses.textPrimary : "text-muted-foreground"}`}
                    />
                    <span
                      className={
                        isSelected
                          ? `${themeClasses.textPrimary} font-medium`
                          : "text-foreground"
                      }
                    >
                      {category.name}
                    </span>
                  </div>
                  {category.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isSelected
                          ? `${themeClasses.textPrimary} bg-primary/10`
                          : "text-muted-foreground bg-muted"
                      }`}
                    >
                      {category.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modales de configuración */}
      <ProjectConfigModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <CategoryConfigModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </aside>
  );
}
