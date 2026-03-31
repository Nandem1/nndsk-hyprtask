// Storage para Proyectos y Categorías
// localStorage por ahora, preparado para migrar a Supabase

import type { Project, Category } from "../model/project-types";
import {
  DEFAULT_PROJECTS,
  DEFAULT_CATEGORIES,
  LEGACY_PROJECT_MAP,
  LEGACY_CATEGORY_MAP,
} from "../model/project-types";
import type { Task } from "../model/types";
import { getTasks, saveTask } from "./storage";

const STORAGE_KEYS = {
  PROJECTS: "hyprtask_projects",
  CATEGORIES: "hyprtask_categories",
  MIGRATION_DONE: "hyprtask_project_migration_done",
} as const;

// ============================================
// PROJECTS
// ============================================

export async function getProjects(): Promise<Project[]> {
  if (typeof window === "undefined") {
    return initializeDefaultProjects();
  }

  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!stored) {
    return initializeDefaultProjects();
  }

  return JSON.parse(stored) as Project[];
}

export async function getActiveProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.isActive).sort((a, b) => a.order - b.order);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function saveProject(project: Project): Promise<void> {
  const projects = await getProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id);

  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.push(project);
  }

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export async function deleteProject(id: string): Promise<void> {
  // Soft delete - marcar como inactivo en lugar de eliminar
  const project = await getProjectById(id);
  if (project) {
    project.isActive = false;
    await saveProject(project);
  }
}

export async function reorderProjects(orderedIds: string[]): Promise<void> {
  const projects = await getProjects();

  orderedIds.forEach((id, index) => {
    const project = projects.find((p) => p.id === id);
    if (project) {
      project.order = index;
    }
  });

  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

function initializeDefaultProjects(): Project[] {
  const projects: Project[] = DEFAULT_PROJECTS.map((p) => ({
    ...p,
    createdAt: new Date().toISOString(),
  }));

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  return projects;
}

// ============================================
// CATEGORIES
// ============================================

export async function getCategories(): Promise<Category[]> {
  if (typeof window === "undefined") {
    return initializeDefaultCategories();
  }

  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!stored) {
    return initializeDefaultCategories();
  }

  return JSON.parse(stored) as Category[];
}

export async function getActiveCategories(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id) || null;
}

export async function saveCategory(category: Category): Promise<void> {
  const categories = await getCategories();
  const existingIndex = categories.findIndex((c) => c.id === category.id);

  if (existingIndex >= 0) {
    categories[existingIndex] = category;
  } else {
    categories.push(category);
  }

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

export async function deleteCategory(id: string): Promise<void> {
  // Soft delete
  const category = await getCategoryById(id);
  if (category) {
    category.isActive = false;
    await saveCategory(category);
  }
}

export async function reorderCategories(orderedIds: string[]): Promise<void> {
  const categories = await getCategories();

  orderedIds.forEach((id, index) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      category.order = index;
    }
  });

  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

function initializeDefaultCategories(): Category[] {
  const categories: Category[] = DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    createdAt: new Date().toISOString(),
  }));

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }

  return categories;
}

// ============================================
// Tipo temporal para migración de datos legacy
type LegacyTask = Task & {
  project?: string;
  category?: string;
};

// MIGRACIÓN DE DATOS LEGACY
// ============================================

export async function migrateLegacyProjectsAndCategories(): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Verificar si ya se hizo la migración
  const migrationDone = localStorage.getItem(STORAGE_KEYS.MIGRATION_DONE);
  if (migrationDone === "true") return false;

  const tasks = (await getTasks()) as LegacyTask[];

  // Verificar si hay datos legacy
  const hasLegacyData = tasks.some(
    (t) =>
      (t.project && !t.projectId) ||
      (t.category && !t.categoryId) ||
      Object.keys(LEGACY_PROJECT_MAP).includes(t.project || "") ||
      Object.keys(LEGACY_CATEGORY_MAP).includes(t.category || ""),
  );

  if (!hasLegacyData) {
    localStorage.setItem(STORAGE_KEYS.MIGRATION_DONE, "true");
    return false;
  }

  // Asegurar que existan proyectos/categorías por defecto
  await getProjects();
  await getCategories();

  // Migrar cada tarea
  for (const task of tasks) {
    let needsUpdate = false;

    // Migrar proyecto
    if (task.project && !task.projectId) {
      const projectId = LEGACY_PROJECT_MAP[task.project];
      if (projectId) {
        task.projectId = projectId;
        needsUpdate = true;
      }
    }

    // Migrar categoría
    if (task.category && !task.categoryId) {
      const categoryId = LEGACY_CATEGORY_MAP[task.category];
      if (categoryId) {
        task.categoryId = categoryId;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await saveTask(task);
    }
  }

  localStorage.setItem(STORAGE_KEYS.MIGRATION_DONE, "true");
  return true;
}

// ============================================
// HELPERS
// ============================================

export async function getProjectName(id: string | undefined): Promise<string> {
  if (!id) return "Sin proyecto";
  const project = await getProjectById(id);
  return project?.name || "Proyecto eliminado";
}

export async function getCategoryName(id: string | undefined): Promise<string> {
  if (!id) return "Sin categoría";
  const category = await getCategoryById(id);
  return category?.name || "Categoría eliminada";
}

export async function getProjectColorClasses(id: string | undefined): Promise<{
  bg: string;
  text: string;
  border: string;
  badge: string;
}> {
  if (!id) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      badge: "bg-muted border-border text-muted-foreground",
    };
  }

  const project = await getProjectById(id);
  if (!project) {
    return {
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/30",
      badge:
        "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
    };
  }

  const { PROJECT_COLOR_CLASSES } = await import("../model/project-types");
  return (
    PROJECT_COLOR_CLASSES[project.color] || {
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/30",
      badge:
        "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
    }
  );
}

export async function getCategoryColorClasses(id: string | undefined): Promise<{
  bg: string;
  text: string;
  border: string;
  badge: string;
}> {
  if (!id) {
    return {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      badge: "bg-muted border-border text-muted-foreground",
    };
  }

  const category = await getCategoryById(id);
  if (!category) {
    return {
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/30",
      badge:
        "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
    };
  }

  const { CATEGORY_COLOR_CLASSES } = await import("../model/project-types");
  return (
    CATEGORY_COLOR_CLASSES[category.color] || {
      bg: "bg-gray-500/10",
      text: "text-gray-500",
      border: "border-gray-500/30",
      badge:
        "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
    }
  );
}
