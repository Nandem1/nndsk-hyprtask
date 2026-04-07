"use client";

import { useState, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { X, Tag, FolderKanban, PanelLeftClose, PanelLeft } from "lucide-react";
import {
  useTheme,
  useTaskFiltersState,
  useTaskFiltersActions,
  useUIPreferencesState,
  useUIPreferencesActions,
} from "@/store/hooks";
import { useActiveTasks } from "@/entities/task";
import type { Task } from "@/entities/task";
import { useActiveProjects, useActiveCategories } from "@/entities/project";
import { useEntityCounts } from "../hooks/useEntityCounts";
import { Button } from "@/shared/ui/button";
import { ProjectConfigModal } from "@/features/manage-projects";
import { CategoryConfigModal } from "@/features/manage-categories";
import { FilterSection } from "./FilterSection";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

interface TaskSidebarProps {
  onClose?: () => void;
}

export function TaskSidebar({ onClose }: TaskSidebarProps) {
  const { themeClasses } = useTheme();
  const { selectedProjectId, selectedCategoryId, hasActiveFilters } = useTaskFiltersState();
  const { setSelectedProject, setSelectedCategory } = useTaskFiltersActions();
  const { isSidebarCollapsed } = useUIPreferencesState();
  const { toggleSidebar } = useUIPreferencesActions();
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

  // Mobile: never collapsed
  const isCollapsed = !onClose && isSidebarCollapsed;

  if (isCollapsed) {
    const activeProjectCount = selectedProjectId !== "all" ? 1 : 0;
    const activeCategoryCount = selectedCategoryId !== "all" ? 1 : 0;

    return (
      <TooltipProvider delayDuration={300}>
        <aside className="w-12 border-r border-border bg-card h-full flex flex-col items-center py-3 gap-3">
          {/* Toggle expand */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={toggleSidebar}
                aria-label="Expandir sidebar"
              >
                <PanelLeft className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Expandir sidebar</TooltipContent>
          </Tooltip>

          <div className="flex flex-col items-center gap-1 mt-1">
            {/* Task count badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "flex flex-col items-center gap-0.5 px-1.5 py-2 rounded-lg cursor-default",
                  "text-center"
                )}>
                  <span className={cn("text-lg font-bold leading-none", themeClasses.textPrimary)}>
                    {tasks.length}
                  </span>
                  <span className="text-[9px] text-muted-foreground">notas</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{tasks.length} tareas activas</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-full border-t border-border/50 my-1" />

          {/* Projects icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className={cn(
                  "relative flex items-center justify-center size-8 rounded-lg transition-colors",
                  selectedProjectId !== "all"
                    ? cn("bg-accent", themeClasses.textPrimary)
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                aria-label="Proyectos"
              >
                <FolderKanban className="size-4" />
                {activeProjectCount > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 size-3.5 rounded-full flex items-center justify-center",
                    "text-[8px] font-bold bg-primary text-primary-foreground"
                  )}>
                    {activeProjectCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Proyectos {selectedProjectId !== "all" ? "(filtro activo)" : ""}
            </TooltipContent>
          </Tooltip>

          {/* Categories icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  toggleSidebar();
                }}
                className={cn(
                  "relative flex items-center justify-center size-8 rounded-lg transition-colors",
                  selectedCategoryId !== "all"
                    ? cn("bg-accent", themeClasses.textPrimary)
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                aria-label="Categorias"
              >
                <Tag className="size-4" />
                {activeCategoryCount > 0 && (
                  <span className={cn(
                    "absolute -top-1 -right-1 size-3.5 rounded-full flex items-center justify-center",
                    "text-[8px] font-bold bg-primary text-primary-foreground"
                  )}>
                    {activeCategoryCount}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Categorias {selectedCategoryId !== "all" ? "(filtro activo)" : ""}
            </TooltipContent>
          </Tooltip>
        </aside>

        <ProjectConfigModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
        />
        <CategoryConfigModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      </TooltipProvider>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card h-full overflow-y-auto">
      <div className="p-4 flex flex-col gap-5 h-full min-h-0">
        {onClose ? (
          <div className="flex justify-end md:hidden">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Activas</div>
            <div className={cn("text-3xl font-bold", themeClasses.textPrimary)}>
              {tasks.length}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {hasActiveFilters ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setSelectedProject("all");
                  setSelectedCategory("all");
                }}
              >
                Limpiar
              </Button>
            ) : null}
            {!onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={toggleSidebar}
                aria-label="Colapsar sidebar"
              >
                <PanelLeftClose className="size-4" />
              </Button>
            )}
          </div>
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
