"use client";

import { memo } from "react";
import { cn } from "@/shared/lib/utils";
import { useCategoryInfo } from "../hooks/use-project-colors";

interface CategoryNameProps {
  categoryId: string;
}

export const CategoryName = memo(function CategoryName({ categoryId }: CategoryNameProps) {
  const { name, colorClasses } = useCategoryInfo(categoryId);
  return (
    <span className={cn("text-xs font-medium", colorClasses.text)}>{name}</span>
  );
});
