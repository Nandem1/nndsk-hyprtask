"use client";

import React, { Suspense } from "react";

const ColacionMode = React.lazy(() =>
  import("./ColacionMode").then((mod) => ({ default: mod.ColacionMode })),
);

interface ColacionModeWrapperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ColacionModeWrapper({
  isOpen,
  onClose,
}: ColacionModeWrapperProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <ColacionMode isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}

// Preload hook for eager loading
export function usePreloadColacionMode() {
  return () => {
    if (typeof window !== "undefined") {
      import("./ColacionMode");
    }
  };
}
