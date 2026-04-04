import type { Project } from "./types";
import type { Category } from "./types";

export const DEFAULT_PROJECTS: Omit<Project, "createdAt">[] = [
  {
    id: "proj-mh-backend",
    name: "MH-Backend",
    color: "blue",
    icon: "Server",
    isActive: true,
    order: 0,
  },
  {
    id: "proj-wails-letter",
    name: "Wails-Letter-MH",
    color: "indigo",
    icon: "Server",
    isActive: true,
    order: 1,
  },
  {
    id: "proj-mh-next",
    name: "MH-Next",
    color: "purple",
    icon: "Code",
    isActive: true,
    order: 2,
  },
  {
    id: "proj-cantera",
    name: "La Cantera",
    color: "green",
    icon: "Bot",
    isActive: true,
    order: 3,
  },
];

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
