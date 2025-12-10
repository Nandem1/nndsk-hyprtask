// CONSTANTES PARA PROYECTOS Y CATEGORÍAS
// Edita aquí para cambiar en toda la aplicación

import { Server, Code, Bot, FolderOpen } from 'lucide-react';
import { Bug, Wrench, Zap, Sparkles, FolderKanban } from 'lucide-react';
import type { TaskProject, TaskCategory } from '@/types/task';
import type { LucideIcon } from 'lucide-react';

export interface ProjectConfig {
  id: TaskProject;
  label: string;
  icon: LucideIcon;
  color: string;
}

export interface CategoryConfig {
  id: TaskCategory;
  label: string;
  icon: LucideIcon;
  color: string;
}

// PROYECTOS - Edita aquí para cambiar en toda la app
export const PROJECTS: ProjectConfig[] = [
  { id: 'MH-Backend', label: 'MH-Backend', icon: Server, color: 'text-blue-400' },
  { id: 'Wails-Letter-MH', label: 'Wails-Letter-MH', icon: Server, color: 'text-blue-500' },
  { id: 'MH-Next', label: 'MH-Next', icon: Code, color: 'text-purple-400' },
  { id: 'La Cantera', label: 'La Cantera', icon: Bot, color: 'text-green-400' },
  { id: 'general', label: 'General', icon: FolderOpen, color: 'text-muted-foreground' },
];

// CATEGORÍAS - Edita aquí para cambiar en toda la app
export const CATEGORIES: CategoryConfig[] = [
  { id: 'issues', label: 'Issues', icon: Bug, color: 'text-red-400' },
  { id: 'fixes', label: 'Fixes', icon: Wrench, color: 'text-yellow-400' },
  { id: 'hotfix', label: 'Hotfix', icon: Zap, color: 'text-orange-400' },
  { id: 'features', label: 'Features', icon: Sparkles, color: 'text-blue-400' },
  { id: 'general', label: 'General', icon: FolderKanban, color: 'text-muted-foreground' },
];

// Helper para obtener proyecto por ID
export function getProjectById(id: TaskProject): ProjectConfig | undefined {
  return PROJECTS.find(p => p.id === id);
}

// Helper para obtener categoría por ID
export function getCategoryById(id: TaskCategory): CategoryConfig | undefined {
  return CATEGORIES.find(c => c.id === id);
}

// Helper para obtener colores de badge por proyecto
export function getProjectBadgeClasses(project: TaskProject): string {
  const projectColors: Record<TaskProject, string> = {
    'MH-Backend': 'bg-blue-500/15 border-blue-400/40 text-blue-200',
    'Wails-Letter-MH': 'bg-blue-600/15 border-blue-500/40 text-blue-200',
    'MH-Next': 'bg-purple-500/15 border-purple-400/40 text-purple-200',
    'La Cantera': 'bg-green-500/15 border-green-400/40 text-green-200',
    'general': 'bg-muted/50 border-border/40 text-muted-foreground',
  };
  return projectColors[project] || projectColors.general;
}

// Helper para obtener colores de badge por categoría
export function getCategoryBadgeClasses(category: TaskCategory): string {
  const categoryColors: Record<TaskCategory, string> = {
    'issues': 'bg-red-500/15 border-red-400/40 text-red-200',
    'fixes': 'bg-yellow-500/15 border-yellow-400/40 text-yellow-200',
    'hotfix': 'bg-orange-500/15 border-orange-400/40 text-orange-200',
    'features': 'bg-purple-500/15 border-purple-400/40 text-purple-200',
    'general': 'bg-muted/50 border-border/40 text-muted-foreground',
  };
  return categoryColors[category] || categoryColors.general;
}
