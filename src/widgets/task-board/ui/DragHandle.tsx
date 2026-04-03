"use client";

import { cn } from "@/shared/lib/utils";
import { GripVertical } from "lucide-react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  className?: string;
}

export function DragHandle({ attributes, listeners, className }: DragHandleProps) {
  return (
    <div
      {...attributes}
      {...listeners}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 z-10",
        "p-1.5 rounded-md cursor-grab active:cursor-grabbing",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-white/10 dark:hover:bg-white/5",
        "transition-colors opacity-0 group-hover:opacity-100",
        className
      )}
    >
      <GripVertical className="size-4" />
    </div>
  );
}
