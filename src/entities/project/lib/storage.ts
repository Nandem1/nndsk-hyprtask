// Storage para Proyectos y Categorías
// localStorage por ahora, preparado para migrar a Supabase

import type { Project, Category } from "../model/types";
import { DEFAULT_PROJECTS, DEFAULT_CATEGORIES } from "../model/defaults";
import { storageGetList, storageSet } from "@shared/lib/storage";
import { upsertItem, reorderById } from "@shared/lib/array";

const STORAGE_KEYS = {
  PROJECTS: "hyprtodo_projects",
  CATEGORIES: "hyprtodo_categories",
} as const;

// ============================================
// PROJECTS
// ============================================

export function getProjects(): Project[] {
  const stored = storageGetList<Project>(STORAGE_KEYS.PROJECTS);
  if (stored.length === 0) return initializeDefaultProjects();
  return stored;
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
  storageSet(STORAGE_KEYS.PROJECTS, projects);
  return projects;
}

// ============================================
// CATEGORIES
// ============================================

export function getCategories(): Category[] {
  const stored = storageGetList<Category>(STORAGE_KEYS.CATEGORIES);
  if (stored.length === 0) return initializeDefaultCategories();
  return stored;
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
  storageSet(STORAGE_KEYS.CATEGORIES, categories);
  return categories;
}
