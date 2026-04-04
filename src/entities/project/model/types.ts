// Tipos para Proyectos y Categorías configurables
// Preparados para migrar a Supabase

/**
 * Proyecto configurable por el usuario
 * Ejemplo: "MH-Backend", "La Cantera", "Personal"
 */
export interface Project {
  id: string; // UUID
  name: string; // Nombre visible
  color: ProjectColor; // Color del tema
  icon: ProjectIcon; // Nombre del icono de Lucide
  isActive: boolean; // Soft delete
  order: number; // Orden en el sidebar
  createdAt: string; // ISO date
  userId?: string; // Para Supabase multi-tenant
}

/**
 * Categoría configurable por el usuario
 * Ejemplo: "Issues", "Features", "Bugfix"
 */
export interface Category {
  id: string; // UUID
  name: string; // Nombre visible
  color: CategoryColor; // Color del tema
  icon: CategoryIcon; // Nombre del icono de Lucide
  isActive: boolean; // Soft delete
  order: number; // Orden en el sidebar
  createdAt: string; // ISO date
  userId?: string; // Para Supabase multi-tenant
}

/**
 * Colores disponibles para proyectos
 * Mapean a clases de Tailwind
 */
export type ProjectColor =
  | "red"
  | "blue"
  | "indigo"
  | "purple"
  | "green"
  | "teal"
  | "cyan"
  | "pink"
  | "rose"
  | "orange"
  | "amber"
  | "yellow"
  | "gray"
  | "slate"
  | "zinc";

export type CategoryColor = ProjectColor;

/**
 * Iconos disponibles (nombres de Lucide)
 */
export type ProjectIcon =
  | "Server"
  | "Code"
  | "Bot"
  | "FolderOpen"
  | "FolderKanban"
  | "Layers"
  | "Box"
  | "Container"
  | "Database"
  | "Cloud"
  | "Globe"
  | "Smartphone"
  | "Monitor"
  | "Laptop"
  | "Cpu"
  | "CircuitBoard"
  | "GitBranch"
  | "GitCommit"
  | "Github"
  | "Terminal"
  | "FileCode"
  | "Briefcase"
  | "Building"
  | "Home"
  | "Rocket"
  | "Zap"
  | "Star"
  | "Heart"
  | "Bookmark"
  | "Flag"
  | "Target"
  | "Crosshair";

export type CategoryIcon =
  | "Bug"
  | "Wrench"
  | "Zap"
  | "Sparkles"
  | "FolderKanban"
  | "CheckCircle"
  | "AlertCircle"
  | "AlertTriangle"
  | "Info"
  | "HelpCircle"
  | "FileText"
  | "FileCheck"
  | "FilePlus"
  | "FileMinus"
  | "FileX"
  | "FileQuestion"
  | "Clipboard"
  | "ClipboardCheck"
  | "ClipboardList"
  | "List"
  | "ListChecks"
  | "ListTodo"
  | "Layout"
  | "LayoutGrid"
  | "Grid"
  | "Table"
  | "BarChart"
  | "PieChart"
  | "TrendingUp"
  | "TrendingDown"
  | "Activity"
  | "Pulse";



/**
 * Categorías por defecto (migración desde constants.ts)
 */
export const DEFAULT_CATEGORIES: Omit<Category, "createdAt">[] = [
  {
    id: "cat-issues",
    name: "Issues",
    color: "rose",
    icon: "Bug",
    isActive: true,
    order: 0,
  },
  {
    id: "cat-fixes",
    name: "Fixes",
    color: "amber",
    icon: "Wrench",
    isActive: true,
    order: 1,
  },
  {
    id: "cat-hotfix",
    name: "Hotfix",
    color: "orange",
    icon: "Zap",
    isActive: true,
    order: 2,
  },
  {
    id: "cat-features",
    name: "Features",
    color: "blue",
    icon: "Sparkles",
    isActive: true,
    order: 3,
  },
];

