// Storage para Proyectos y Categorías
// localStorage por ahora, preparado para migrar a Supabase

import type { Project, Category } from "../model/types";
import {
  DEFAULT_PROJECTS,
  DEFAULT_CATEGORIES,
} from "../model/types";

const STORAGE_KEYS = {
  PROJECTS: "hyprtask_projects",
  CATEGORIES: "hyprtask_categories",
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
