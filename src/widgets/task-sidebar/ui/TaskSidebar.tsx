"use client";

import { useState, useCallback } from "react";
import { cn } from "@/shared/lib/utils";
import { X, Tag, FolderKanban, Keyboard } from "lucide-react";
import { useTheme, useTaskFiltersState, useTaskFiltersActions } from "@/store/hooks";
import { useActiveTasks } from "@/entities/task";
import type { Task } from "@/entities/task";
import { useActiveProjects, useActiveCategories } from "@/entities/project";
import { useEntityCounts } from "../hooks/useEntityCounts";
import { Button } from "@/shared/ui/button";
import { ProjectConfigModal } from "@/features/manage-projects";
import { CategoryConfigModal } from "@/features/manage-categories";
import { FilterSection } from "./FilterSection";
import { KeyboardShortcutBadge } from "@/shared/ui/keyboard-shortcut-badge";
import { SHORTCUTS, SIDEBAR_SHORTCUT_IDS } from "@/shared/lib/keyboard-shortcuts";

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
      <div className="p-4 flex flex-col gap-6 h-full min-h-0">
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

        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Keyboard className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Atajos
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SIDEBAR_SHORTCUT_IDS.map((id) => {
              const s = SHORTCUTS[id];
              return (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.description}</span>
                  <KeyboardShortcutBadge className="text-[10px] min-w-[1.5rem] h-5 px-1">
                    {s.keys.join("/")}
                  </KeyboardShortcutBadge>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground/60 mt-3 text-center">
            Presiona <KeyboardShortcutBadge className="text-[10px] min-w-[1rem] h-5 px-1">?</KeyboardShortcutBadge> para ver todos
          </p>
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
