// Storage para Proyectos y Categorías
// localStorage por ahora, preparado para migrar a Supabase

import type { Project, Category } from "../model/types";
import { DEFAULT_PROJECTS, DEFAULT_CATEGORIES } from "../model/types";
import { storageSet, upsertItem } from "@shared/lib/storage";
import { reorderById } from "@shared/lib/array";

const STORAGE_KEYS = {
  PROJECTS: "hyprtask_projects",
  CATEGORIES: "hyprtask_categories",
} as const;

// ============================================
// PROJECTS
// ============================================

export function getProjects(): Project[] {
  if (typeof window === "undefined") return initializeDefaultProjects();

  const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  if (!stored) return initializeDefaultProjects();

  return JSON.parse(stored) as Project[];
}

export function getActiveProjects(): Project[] {
  return getProjects().filter((p) => p.isActive).sort((a, b) => a.order - b.order);
}

export function getProjectById(id: string): Project | null {
  return getProjects().find((p) => p.id === id) ?? null;
}

export function saveProject(project: Project): void {
  storageSet(STORAGE_KEYS.PROJECTS, upsertItem(getProjects(), project));
}

export function deleteProject(id: string): void {
  // Soft delete — marcar como inactivo en lugar de eliminar
  const project = getProjectById(id);
  if (project) saveProject({ ...project, isActive: false });
}

export function reorderProjects(orderedIds: string[]): void {
  storageSet(STORAGE_KEYS.PROJECTS, reorderById(getProjects(), orderedIds));
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

export function getCategories(): Category[] {
  if (typeof window === "undefined") return initializeDefaultCategories();

  const stored = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  if (!stored) return initializeDefaultCategories();

  return JSON.parse(stored) as Category[];
}

export function getActiveCategories(): Category[] {
  return getCategories().filter((c) => c.isActive).sort((a, b) => a.order - b.order);
}

export function getCategoryById(id: string): Category | null {
  return getCategories().find((c) => c.id === id) ?? null;
}

export function saveCategory(category: Category): void {
  storageSet(STORAGE_KEYS.CATEGORIES, upsertItem(getCategories(), category));
}

export function deleteCategory(id: string): void {
  // Soft delete
  const category = getCategoryById(id);
  if (category) saveCategory({ ...category, isActive: false });
}

export function reorderCategories(orderedIds: string[]): void {
  storageSet(STORAGE_KEYS.CATEGORIES, reorderById(getCategories(), orderedIds));
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
