"use client";

import { useState, useMemo } from "react";
import { cn } from "@/shared/lib/utils";
import { X, Settings, Tag, FolderKanban } from "lucide-react";
import { useThemeState, useTaskFiltersState, useTaskFiltersActions } from "@/store/hooks";
import { useActiveTasks } from "@/entities/task";
import { useActiveProjects, useActiveCategories, getEntityIcon } from "@/entities/project";
import { Button } from "@/shared/ui/button";
import { ProjectConfigModal } from "@/features/manage-projects";
import { CategoryConfigModal } from "@/features/manage-categories";

interface TaskSidebarProps {
  onClose?: () => void;
}

export function TaskSidebar({ onClose }: TaskSidebarProps) {
  const { themeClasses } = useThemeState();
  const { selectedProjectId, selectedCategoryId, hasActiveFilters } = useTaskFiltersState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  const { data: tasks = [] } = useActiveTasks();
  const { data: projects = [] } = useActiveProjects();
  const { data: categories = [] } = useActiveCategories();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const projectCounts = useMemo(() => {
    const countMap = new Map<string, number>();
    tasks.forEach((t) => {
      if (t.projectId)
        countMap.set(t.projectId, (countMap.get(t.projectId) ?? 0) + 1);
    });
    return projects.map((project) => ({
      ...project,
      count: countMap.get(project.id) ?? 0,
    }));
  }, [projects, tasks]);

  const categoryCounts = useMemo(() => {
    const countMap = new Map<string, number>();
    tasks.forEach((t) => {
      if (t.categoryId)
        countMap.set(t.categoryId, (countMap.get(t.categoryId) ?? 0) + 1);
    });
    return categories.map((category) => ({
      ...category,
      count: countMap.get(category.id) ?? 0,
    }));
  }, [categories, tasks]);

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

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <FolderKanban className="size-4" />
              Proyectos
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setIsProjectModalOpen(true)}
            >
              <Settings />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {projectCounts.map((project) => {
              const IconComponent = getEntityIcon(project.icon);
              const isSelected = selectedProjectId === project.id;

              return (
                <button
                  key={project.id}
                  onClick={() => handleProjectChange(project.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isSelected
                      ? cn("bg-accent border", themeClasses.border)
                      : "border border-transparent hover:bg-accent/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={cn(
                        "size-4",
                        isSelected
                          ? themeClasses.textPrimary
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        isSelected &&
                          cn(themeClasses.textPrimary, "font-medium"),
                        !isSelected && "text-foreground",
                      )}
                    >
                      {project.name}
                    </span>
                  </div>
                  {project.count > 0 ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isSelected
                          ? cn(themeClasses.textPrimary, "bg-primary/10")
                          : "text-muted-foreground bg-muted",
                      )}
                    >
                      {project.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
              <Tag className="size-4" />
              Categorias
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={() => setIsCategoryModalOpen(true)}
            >
              <Settings />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {categoryCounts.map((category) => {
              const IconComponent = getEntityIcon(category.icon);
              const isSelected = selectedCategoryId === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isSelected
                      ? cn("bg-accent border", themeClasses.border)
                      : "border border-transparent hover:bg-accent/50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent
                      className={cn(
                        "size-4",
                        isSelected
                          ? themeClasses.textPrimary
                          : "text-muted-foreground",
                      )}
                    />
                    <span
                      className={cn(
                        isSelected &&
                          cn(themeClasses.textPrimary, "font-medium"),
                        !isSelected && "text-foreground",
                      )}
                    >
                      {category.name}
                    </span>
                  </div>
                  {category.count > 0 ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        isSelected
                          ? cn(themeClasses.textPrimary, "bg-primary/10")
                          : "text-muted-foreground bg-muted",
                      )}
                    >
                      {category.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
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
