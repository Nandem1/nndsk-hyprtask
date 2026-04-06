"use client";

import { useState, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { X, Tag, FolderKanban } from "lucide-react";
import { useTheme, useTaskFiltersState, useTaskFiltersActions } from "@/store/hooks";
import { useActiveTasks } from "@/entities/task";
import type { Task } from "@/entities/task";
import { useActiveProjects, useActiveCategories } from "@/entities/project";
import { useEntityCounts } from "../hooks/useEntityCounts";
import { Button } from "@/shared/ui/button";
import { ProjectConfigModal } from "@/features/manage-projects";
import { CategoryConfigModal } from "@/features/manage-categories";
import { FilterSection } from "./FilterSection";

interface TaskSidebarProps {
  onClose?: () => void;
}

export function TaskSidebar({ onClose }: TaskSidebarProps) {
  const { themeClasses } = useTheme();
  const { selectedProjectId, selectedCategoryId, hasActiveFilters } = useTaskFiltersState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  const { data: tasks = [] } = useActiveTasks();
  const { data: projects = [] } = useActiveProjects();
  const { data: categories = [] } = useActiveCategories();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const getProjectId = useCallback((task: Task) => task.projectId, []);
  const getCategoryId = useCallback((task: Task) => task.categoryId, []);
  const projectCounts = useEntityCounts(tasks, projects, getProjectId);
  const categoryCounts = useEntityCounts(tasks, categories, getCategoryId);

  const handleProjectChange = (projectId: string | "all") => {
    setSelectedProject(projectId);
    if (onClose) onClose();
  };

  const handleCategoryChange = (categoryId: string | "all") => {
    setSelectedCategory(categoryId);
    if (onClose) onClose();
  };

  return (
    <aside className="w-72 border-r border-border bg-card h-full overflow-y-auto">
      <div className="p-4 flex flex-col gap-6">
        {onClose ? (
          <div className="flex justify-end md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Tareas Activas</div>
            <div className={cn("text-3xl font-bold", themeClasses.textPrimary)}>
              {tasks.length}
            </div>
          </div>
          {hasActiveFilters ? (
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
          ) : null}
        </div>

        <FilterSection
          headerIcon={<FolderKanban className="size-4" />}
          label="Proyectos"
          items={projectCounts}
          selectedId={selectedProjectId}
          onSelect={handleProjectChange}
          onSettings={() => setIsProjectModalOpen(true)}
          themeClasses={themeClasses}
        />

        <FilterSection
          headerIcon={<Tag className="size-4" />}
          label="Categorias"
          items={categoryCounts}
          selectedId={selectedCategoryId}
          onSelect={handleCategoryChange}
          onSettings={() => setIsCategoryModalOpen(true)}
          themeClasses={themeClasses}
        />
      </div>

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
