"use client";

import React, { Suspense } from "react";
import type { Task } from "@/entities/task";

const FocusMode = React.lazy(() =>
  import("./FocusMode").then((mod) => ({ default: mod.FocusMode })),
);

interface FocusModeWrapperProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onToggleTask: () => void;
}

export function FocusModeWrapper({
  task,
  isOpen,
  onClose,
  onComplete,
  onToggleTask,
}: FocusModeWrapperProps) {
  // Don't render if no task available
  if (!task || !isOpen) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <FocusMode
        task={task}
        isOpen={isOpen}
        onClose={onClose}
        onComplete={onComplete}
        onToggleTask={onToggleTask}
      />
    </Suspense>
  );
}

// Preload hook for eager loading
export function usePreloadFocusMode() {
  return () => {
    if (typeof window !== "undefined") {
      import("./FocusMode");
    }
  };
}
