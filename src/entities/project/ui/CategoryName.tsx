"use client";

import { cn } from "@/shared/lib/utils";
import { useCategoryInfo } from "../hooks/use-project-colors";

interface CategoryNameProps {
  categoryId: string;
}

export function CategoryName({ categoryId }: CategoryNameProps) {
  const { name, colorClasses } = useCategoryInfo(categoryId);
  return (
    <span className={cn("text-xs font-medium", colorClasses.text)}>{name}</span>
  );
}
