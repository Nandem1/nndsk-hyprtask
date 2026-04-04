import type { ProjectColor } from "./types";

export const PROJECT_COLOR_CLASSES: Record<
  ProjectColor,
  { bg: string; text: string; border: string; badge: string }
> = {
  red: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/30",
    badge: "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
  },
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    border: "border-indigo-500/30",
    badge:
      "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/30",
    badge:
      "bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/30",
    badge:
      "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-500",
    border: "border-teal-500/30",
    badge: "bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-500",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
  },
  pink: {
    bg: "bg-pink-500/10",
    text: "text-pink-500",
    border: "border-pink-500/30",
    badge: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/30",
    badge: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/30",
    badge:
      "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/30",
    badge:
      "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
    badge:
      "bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400",
  },
  gray: {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    border: "border-gray-500/30",
    badge: "bg-gray-500/10 border-gray-500/30 text-gray-600 dark:text-gray-400",
  },
  slate: {
    bg: "bg-slate-500/10",
    text: "text-slate-500",
    border: "border-slate-500/30",
    badge:
      "bg-slate-500/10 border-slate-500/30 text-slate-600 dark:text-slate-400",
  },
  zinc: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-500",
    border: "border-zinc-500/30",
    badge: "bg-zinc-500/10 border-zinc-500/30 text-zinc-600 dark:text-zinc-400",
  },
};

export const CATEGORY_COLOR_CLASSES = PROJECT_COLOR_CLASSES;
