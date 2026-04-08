"use client";

/**
 * Preload utilities for bundle optimization
 *
 * Following Vercel's bundle-preload pattern:
 * https://vercel.com/blog/react-server-components#bundle-preload
 *
 * These functions preload components on hover/focus for perceived speed.
 * They use dynamic imports to code-split and only load when needed.
 */

/**
 * Preload TaskCreateModal - use when hovering over FAB or add button
 */
export function preloadTaskCreateModal(): void {
  if (typeof window !== "undefined") {
    import("@/widgets/task-board/ui/TaskCreateModal");
  }
}

/**
 * Preload TaskDetailModal - use when hovering over a task row
 */
export function preloadTaskDetailModal(): void {
  if (typeof window !== "undefined") {
    import("@/widgets/task-board/ui/TaskDetailModal");
  }
}

/**
 * Preload FocusMode - use when entering focus mode context
 */
export function preloadFocusMode(): void {
  if (typeof window !== "undefined") {
    import("@/widgets/task-board/ui/FocusMode");
  }
}

/**
 * Preload ColacionMode - use when hovering colacion button
 */
export function preloadColacionMode(): void {
  if (typeof window !== "undefined") {
    import("@/widgets/task-board/ui/ColacionMode");
  }
}
