"use client";

import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { GitBranch, Link2, Check } from "lucide-react";
import type { TaskCreateFieldsProps } from "../model";

const priorityOptions = [
  { value: "low" as const, label: "Baja" },
  { value: "medium" as const, label: "Media" },
  { value: "high" as const, label: "Alta" },
];

// GPU-accelerated animation variants using scaleY instead of height
const parentTaskSectionVariants = {
  hidden: { 
    opacity: 0, 
    scaleY: 0,
  },
  visible: { 
    opacity: 1, 
    scaleY: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1], // standard easing
    },
  },
  exit: { 
    opacity: 0, 
    scaleY: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1], // accelerate easing
    },
  },
};

// Reduced motion variants - instant transitions
const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export function TaskCreateFields({
  control,
  watch,
  errors,
  projects,
  categories,
  incompleteTasks,
  titleValue,
}: TaskCreateFieldsProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const parentTaskId = watch("parentTaskId");
  
  const selectedParentTask = useMemo(() => {
    return incompleteTasks.find((t) => t.id === parentTaskId);
  }, [parentTaskId, incompleteTasks]);

  // Use appropriate variants based on motion preference
  const variants = shouldReduceMotion ? reducedMotionVariants : parentTaskSectionVariants;

  return (
    <div className="flex flex-col gap-5">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Título de la tarea
        </Label>
        <div className="relative">
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                id="title"
                placeholder="¿Qué necesitas hacer?"
                className="pr-16"
                autoFocus
                {...field}
              />
            )}
          />
          {/* CSS-based character counter - no Framer Motion */}
          <span
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground",
              "transition-all duration-200",
              titleValue.length > 0 
                ? "opacity-100 translate-x-0" 
                : "opacity-0 translate-x-2 pointer-events-none"
            )}
          >
            {titleValue.length}/100
          </span>
        </div>
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Project & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Proyecto</Label>
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "__none__"}
                onValueChange={(value) =>
                  field.onChange(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger className="transition-colors hover:border-primary/50">
                  <SelectValue placeholder="Sin proyecto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none__">Sin proyecto</SelectItem>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Categoría</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "__none__"}
                onValueChange={(value) =>
                  field.onChange(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger className="transition-colors hover:border-primary/50">
                  <SelectValue placeholder="Sin categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none__">Sin categoría</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Prioridad</Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={(value) => value && field.onChange(value)}
              className="flex gap-2"
            >
              {priorityOptions.map((option) => (
                <ToggleGroupItem
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex-1 transition-all duration-200",
                    option.value === "high" &&
                      "data-[state=on]:bg-destructive data-[state=on]:text-destructive-foreground"
                  )}
                >
                  {option.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        />
      </div>

      {/* Parent Task Link - GPU accelerated with scaleY */}
      {incompleteTasks.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          style={{ 
            transformOrigin: "top",
            willChange: shouldReduceMotion ? "auto" : "transform, opacity",
          }}
          className="space-y-2"
        >
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <GitBranch className="size-3.5" />
            Continuación de
          </Label>
          <Controller
            name="parentTaskId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "__none__"}
                onValueChange={(value) =>
                  field.onChange(value === "__none__" ? undefined : value)
                }
              >
                <SelectTrigger
                  className={cn(
                    "transition-all duration-200",
                    field.value
                      ? "border-primary/50 bg-primary/5"
                      : "hover:border-primary/50"
                  )}
                >
                  <SelectValue placeholder="Sin relación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="__none__">Sin relación</SelectItem>
                    {incompleteTasks.map((task) => (
                      <SelectItem key={task.id} value={task.id}>
                        <span className="flex items-center gap-2">
                          {task.title}
                          {task.isCurrent && (
                            <span className="text-xs text-primary">(actual)</span>
                          )}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* Link Indicator - CSS transitions instead of nested AnimatePresence */}
          <div
            className={cn(
              "flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm",
              "transition-all duration-200",
              selectedParentTask 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none h-0 py-0 overflow-hidden"
            )}
          >
            <div className="flex items-center justify-center size-6 rounded-full bg-primary/20">
              <Link2 className="size-3.5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground text-xs">
                Se vinculará con:
              </span>
              <p className="font-medium text-primary truncate">
                {selectedParentTask?.title}
              </p>
            </div>
            <div
              className={cn(
                "transition-transform duration-200 delay-100",
                selectedParentTask ? "scale-100" : "scale-0"
              )}
            >
              <Check className="size-4 text-primary" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
