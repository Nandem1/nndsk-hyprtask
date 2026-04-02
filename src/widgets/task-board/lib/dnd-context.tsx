"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Task } from "@/entities/task";

// ============================================================================
// Types
// ============================================================================

interface DndContextType {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

interface TaskDndProviderProps {
  children: ReactNode;
  tasks: Task[];
  onReorder: (tasks: Task[]) => void;
}

interface UseTaskDragReturn {
  attributes: import('@dnd-kit/core').DraggableAttributes;
  listeners: import('@dnd-kit/core/dist/hooks/utilities').SyntheticListenerMap | undefined;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
  transition: string | undefined;
  isDragging: boolean;
}

// ============================================================================
// Context
// ============================================================================

const DndContextState = createContext<DndContextType | null>(null);

function useDndContextState() {
  const context = useContext(DndContextState);
  if (!context) {
    throw new Error("useDndContextState must be used within TaskDndProvider");
  }
  return context;
}

// ============================================================================
// Provider Component
// ============================================================================

export function TaskDndProvider({ children, tasks, onReorder }: TaskDndProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = tasks.findIndex((t) => t.id === active.id);
        const newIndex = tasks.findIndex((t) => t.id === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newTasks = arrayMove(tasks, oldIndex, newIndex);
          onReorder(newTasks);
        }
      }

      setActiveId(null);
    },
    [tasks, onReorder]
  );

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContextState.Provider value={{ activeId, setActiveId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>

        <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeTask ? (
            <div className="opacity-80 rotate-2 scale-105 cursor-grabbing">
              {/* Drag preview - will be rendered by parent component */}
              <DragPreview task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </DndContextState.Provider>
  );
}

// Simple drag preview component
function DragPreview({ task }: { task: Task }) {
  return (
    <div className="p-4 rounded-xl bg-card border-2 border-primary/50 shadow-2xl">
      <p className="font-medium text-foreground">{task.title}</p>
      <p className="text-sm text-muted-foreground mt-1">Arrastrando...</p>
    </div>
  );
}

// ============================================================================
// Hook for individual task items
// ============================================================================

export function useTaskDrag(taskId: string): UseTaskDragReturn {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: taskId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return {
    attributes,
    listeners,
    setNodeRef,
    transform: transform
      ? {
          x: transform.x,
          y: transform.y,
          scaleX: "scaleX" in transform ? (transform.scaleX as number) : 1,
          scaleY: "scaleY" in transform ? (transform.scaleY as number) : 1,
        }
      : null,
    transition: style.transition,
    isDragging,
  };
}

// ============================================================================
// Hook for drag state
// ============================================================================

export function useIsDragging(): boolean {
  const { activeId } = useDndContextState();
  return activeId !== null;
}

export function useActiveDragId(): string | null {
  const { activeId } = useDndContextState();
  return activeId;
}
